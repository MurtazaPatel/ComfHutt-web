import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { choiceSchema } from "@/lib/validations/choices";
import { z } from "zod";

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
    // Note: We use sequential operations instead of $transaction to avoid potential issues
    // with Prisma Client types not being fully synced in the dev environment.
    
    // Upsert Lead
    // @ts-ignore - Prisma client might not be fully generated in dev environment
    // debug snippet — drop this before the upsert line, inspect logs
console.log('DB export keys:', Object.keys(db));
console.log('Is db null/undefined?', db == null);
console.log('Has lead?', typeof (db as any).lead, Object.prototype.hasOwnProperty.call(db, 'lead'));

    const lead = await db.lead.upsert({
      where: { email: validatedData.email },
      update: {
        name: validatedData.name || undefined,
      },
      create: {
        email: validatedData.email,
        name: validatedData.name,
        source: validatedData.source || "choices_form",
        anonymous: false,
      },
    });

    // Create Choice Response
    // @ts-ignore
    const response = await db.choiceResponse.create({
      data: {
        leadId: lead.id,
        intent: validatedData.intent,
        nps: validatedData.nps,
        meta: {
          ip_hash: Buffer.from(ip).toString("base64"), // Simple hash/encoding
          user_agent: req.headers.get("user-agent"),
        },
      },
    });

    return NextResponse.json({ ok: true, leadId: lead.id, responseId: response.id });

  } catch (error) {
    console.error("Choices API Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as z.ZodError).errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}