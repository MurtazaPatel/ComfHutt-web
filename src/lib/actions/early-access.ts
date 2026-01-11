"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const InvestmentIntent = {
  JUST_EXPLORING: "JUST_EXPLORING",
  INVEST_WITHIN_3_MONTHS: "INVEST_WITHIN_3_MONTHS",
  READY_TO_INVEST: "READY_TO_INVEST",
} as const;

const InvestmentRange = {
  BELOW_10K: "BELOW_10K",
  TEN_TO_FIFTY_K: "TEN_TO_FIFTY_K",
  FIFTY_K_TO_TWO_L: "FIFTY_K_TO_TWO_L",
  ABOVE_TWO_L: "ABOVE_TWO_L",
} as const;

const PropertyType = {
  RESIDENTIAL: "RESIDENTIAL",
  COMMERCIAL: "COMMERCIAL",
  MIXED_USE: "MIXED_USE",
} as const;

const earlyAccessSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  name: z.string().max(100, "Name too long").optional().transform(v => v?.trim()),
  investmentIntent: z.nativeEnum(InvestmentIntent),
  expectedInvestmentRange: z.nativeEnum(InvestmentRange),
  preferredPropertyType: z.nativeEnum(PropertyType).optional(),
  source: z.string().max(50).optional().default("website"),
});

export async function joinEarlyAccess(data: z.infer<typeof earlyAccessSchema>) {
  const startTime = Date.now();
  try {
    const validatedData = earlyAccessSchema.parse(data);

    if (process.env.MOCK_DB === "true") {
       await new Promise(resolve => setTimeout(resolve, 50));
       console.log(`[Waitlist MOCK] Success: ${validatedData.email}`);
       return { success: true };
    }

    if (!db || !db.waitlistEntry) {
        throw new Error("Database client not initialized properly");
    }

    const existingUser = await db.waitlistEntry.findUnique({
      where: { email: validatedData.email },
      select: { id: true }
    });

    if (existingUser) {
      console.log(`[Waitlist] Duplicate attempt: ${validatedData.email}`);
      return { success: false, error: "This email is already on the waitlist." };
    }

    const newUser = await db.waitlistEntry.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
      },
    });

    const duration = Date.now() - startTime;
    console.log(`[Waitlist] Success: ${newUser.email} (took ${duration}ms)`);
    
    return { success: true };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    if ((error as any).code === 'P2002') {
      console.log(`[Waitlist] Race condition duplicate: ${data.email}`);
      return { success: false, error: "This email is already on the waitlist." };
    }

    if ((error as any).code === 'P1001') {
      console.error(`[Waitlist] Database connection error after ${duration}ms:`, error);
      return { success: false, error: "Unable to connect to the database. Please try again later." };
    }

    console.error(`[Waitlist] Error after ${duration}ms:`, error);
    
    // Don't expose raw DB errors to client
    return { success: false, error: "Unable to join waitlist at this time. Please try again later." };
  }
}
