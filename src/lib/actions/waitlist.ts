"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { waitlistSchema } from "@/lib/validations/auth";

export const joinWaitlist = async (values: z.infer<typeof waitlistSchema>) => {
  const validatedFields = waitlistSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email, name } = validatedFields.data;

  const existingEntry = await db.waitlistEntry.findUnique({
    where: { email },
  });

  if (existingEntry) {
    return { error: "You are already on the waitlist!" };
  }

  await db.waitlistEntry.create({
    data: {
      email,
      name,
    },
  });

  return { success: "Added to waitlist!" };
};