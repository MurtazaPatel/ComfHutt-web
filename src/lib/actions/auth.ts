"use server";

import { z } from "zod";
import { registerSchema } from "@/lib/validations/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "Email already in use" };
  }

  const hashedPassword = await hashPassword(password);

  await db.user.create({
    data: {
      name: email.split("@")[0],
      email,
      passwordHash: hashedPassword,
    },
  });

  // Check if waitlist entry exists and link it
  const waitlistEntry = await db.waitlistEntry.findUnique({
    where: { email },
  });

  if (waitlistEntry) {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      await db.waitlistEntry.update({
        where: { email },
        data: { userId: user.id, status: "approved" },
      });
    }
  }
  
  // Login user after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials!" }
          default:
            return { error: "Something went wrong!" }
        }
      }
    throw error;
  }

  return { success: "Account created!" };
};