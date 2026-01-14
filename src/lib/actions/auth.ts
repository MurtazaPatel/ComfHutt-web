"use server";

import { z } from "zod";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/password";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { createUser, getUserByEmail } from "@/lib/users";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await hashPassword(password);

    await createUser(email, hashedPassword);
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return { error: "An unexpected error occurred. Please try again." };
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