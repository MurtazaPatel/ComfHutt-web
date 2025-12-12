import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ownerDetailsSchema, propertyDetailsSchema } from "@/lib/validations/owner-onboarding";
import { z } from "zod";
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
      return NextResponse.json(
        { error: "Invalid owner details", details: ownerValidation.error.errors },
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
      return NextResponse.json(
        { error: "Invalid property details", details: propertyValidation.error.errors },
        { status: 400 }
      );
    }

    const { owner, property, documents } = body;
    const validatedProperty = propertyValidation.data;

    // 3. Database Transaction
    // We create the owner, property, and link documents in one transaction to ensure data integrity
    const result = await db.$transaction(async (tx) => {
      // Check if owner already exists by email (optional: could update existing or error)
      // For this flow, we'll create or update based on email uniqueness
      const existingOwner = await tx.owner.findUnique({
        where: { email: owner.email },
      });

      let ownerId = existingOwner?.id;

      if (!ownerId) {
        const newOwner = await tx.owner.create({
          data: {
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
            address: owner.address,
            // aadharPan would be a URL in a real app
          },
        });
        ownerId = newOwner.id;
      }

      // Create Property
      const newProperty = await tx.property.create({
        data: {
            ownerId: ownerId!,
            title: validatedProperty.title,
            type: validatedProperty.type,
            location: validatedProperty.location,
            builtUpArea: validatedProperty.builtUpArea,
            carpetArea: validatedProperty.carpetArea,
            expectedValuation: validatedProperty.expectedValuation
        }
      });

      // Create Documents if any
      if (documents && Array.isArray(documents)) {
        await tx.propertyDocument.createMany({
            data: documents.map((doc: any) => ({
                propertyId: newProperty.id,
                type: doc.type,
                url: doc.url
            }))
        })
      }

      return newProperty;
    });

    return NextResponse.json(
      { message: "Application submitted successfully", propertyId: result.id },
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