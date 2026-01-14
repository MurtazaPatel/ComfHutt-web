import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ownerDetailsSchema, propertyDetailsSchema } from "@/lib/validations/owner-onboarding";
import { z } from "zod";
import { upsertOwner, createProperty, createPropertyDocuments } from "@/lib/onboarding";
import { FEATURES } from "@/config/feature-flags";

export async function POST(req: Request) {
  try {
    const session = await auth();

    // If Auth is strictly required by flag, enforce it.
    // Otherwise, allow anonymous submissions (MVP requirement).
    if (FEATURES.AUTH_REQUIRED) {
        if (!session || !session.user?.email) {
           return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    const body = await req.json();

    // 1. Validate Owner Details
    const ownerValidation = ownerDetailsSchema.safeParse(body.owner);
    if (!ownerValidation.success) {
      const { fieldErrors, formErrors } = ownerValidation.error.flatten();
      return NextResponse.json(
        { error: "Invalid owner details", details: { fieldErrors, formErrors } },
        { status: 400 }
      );
    }

    // Security: Ensure the submitted email matches the logged-in user ONLY if auth is required
    if (FEATURES.AUTH_REQUIRED && session?.user?.email) {
        if (body.owner.email !== session.user.email) {
            return NextResponse.json({ error: "Email mismatch" }, { status: 403 });
        }
    }

    // 2. Validate Property Details (transforming numbers)
    const propertyValidation = propertyDetailsSchema.safeParse(body.property);
    if (!propertyValidation.success) {
      const { fieldErrors, formErrors } = propertyValidation.error.flatten();
      return NextResponse.json(
        { error: "Invalid property details", details: { fieldErrors, formErrors } },
        { status: 400 }
      );
    }

    const { owner, property, documents } = body;
    const validatedProperty = propertyValidation.data;

    // 3. Database Operations
    let ownerId;
    try {
      ownerId = await upsertOwner({
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
      });
    } catch (error) {
      console.error("Error creating owner:", error);
      return NextResponse.json(
        { error: "Could not process owner details. Please try again." },
        { status: 500 }
      );
    }

    let propertyId;
    try {
      propertyId = await createProperty(ownerId, {
        title: validatedProperty.title,
        type: validatedProperty.type,
        location: validatedProperty.location,
        built_up_area: validatedProperty.builtUpArea,
        carpet_area: validatedProperty.carpetArea,
        expected_valuation: validatedProperty.expectedValuation,
      });
    } catch (error) {
      console.error("Error creating property:", error);
      return NextResponse.json(
        { error: "Could not process property details. Please try again." },
        { status: 500 }
      );
    }

    if (documents && Array.isArray(documents) && documents.length > 0) {
      try {
        await createPropertyDocuments(propertyId, documents);
      } catch (error) {
        console.error("Error creating documents:", error);
        return NextResponse.json(
          { error: "Could not save documents. Please try again." },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
        { message: "Application submitted successfully", propertyId: propertyId },
        { status: 201 }
    );
  } catch (error) {
    console.error("Owner Onboarding Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}