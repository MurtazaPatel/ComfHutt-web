// @ts-nocheck
import { NextResponse } from "next/server";
import { choiceSchema } from "@/lib/validations/choices";
import { z } from "zod";
import { upsertLead, logLeadEvent } from "@/lib/leads";
import { createChoiceResponses } from "@/lib/choices";

// Basic in-memory rate limiting (for demo purposes, use Redis/Upstash in production)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;
const ipRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = ipRequests.get(ip) || [];
  const recentRequests = requests.filter((time) => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }
  
  recentRequests.push(now);
  ipRequests.set(ip, recentRequests);
  return false;
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Body
    const body = await req.json();
    const validatedData = choiceSchema.parse(body);

    // 3. Database Operations
    // Upsert Lead
    let leadId;
    try {
      leadId = await upsertLead(
        validatedData.email,
        validatedData.name,
        "CHOICES"
      );
    } catch (error) {
      console.error("Error upserting lead:", error);
      return NextResponse.json(
        { error: "Could not save your preferences. Please try again." },
        { status: 500 }
      );
    }

    // Create Choice Responses
    const responses = [
      { key: "intent", value: validatedData.intent },
    ];
    if (validatedData.nps) {
      responses.push({ key: "nps", value: validatedData.nps.toString() });
    }

    try {
      await createChoiceResponses(leadId, responses);
    } catch (error) {
      console.error("Error creating choice responses:", error);
      return NextResponse.json(
        { error: "Could not save your preferences. Please try again." },
        { status: 500 }
      );
    }

    // Log the lead event
    try {
      await logLeadEvent(leadId, "CHOICES_SUBMISSION", "CHOICES");
    } catch (eventError) {
      console.error("Error logging lead event:", eventError);
      // Non-critical error
    }

    return NextResponse.json({ ok: true, leadId: leadId });

  } catch (error) {
    console.error("Choices API Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}