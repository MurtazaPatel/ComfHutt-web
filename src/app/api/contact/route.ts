import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ContactFormSchema } from "@/lib/validations/contact";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = ContactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // Fallback: If the global db instance is stale (hot reload issue), instantiate a fresh client.
    // This happens because 'prisma generate' updates node_modules, but the global instance in dev
    // might still be the old one without the new model.
    let prisma = db;
    if (!(prisma as any).contactUs) {
      prisma = new PrismaClient();
    }

    // 1. Rate Limiting (Basic)
    // Check database for recent duplicate message from same email.
    const recentMessage = await (prisma as any).contactUs.findFirst({
      where: {
        email: email,
        createdAt: {
          gt: new Date(Date.now() - 60 * 1000), // Check last 1 minute
        },
      },
    });

    if (recentMessage) {
      return NextResponse.json(
        { message: "You are sending messages too quickly. Please wait a moment." },
        { status: 429 }
      );
    }

    // 2. Save to Database
    await (prisma as any).contactUs.create({
      data: {
        name,
        email,
        message,
        source: "website_contact_form",
      },
    });

    // 3. Send Email
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"ComfHutt Support" <${emailUser}>`,
        to: email,
        subject: "Your message has been received – ComfHutt",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000; margin-bottom: 20px;">Your response has been received. Thank you for reaching out to ComfHutt.</h2>
          
          <p style="line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
            We know that trust is the foundation of every great investment. By reaching out, you’ve taken the first step toward a smarter, more transparent way to build wealth through real estate. Whether you have questions about our SPV model or just want to explore how fractional ownership can work for you, we are here to provide clear, honest answers.
          </p>
          
          <p style="line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
            Our team is reviewing your message right now and will get back to you personally within 24–48 hours. In the meantime, feel free to browse our latest opportunities and learn more about our vision at <a href="https://comfhutt.vercel.app" style="color: #059669; text-decoration: none; font-weight: bold;">https://comfhutt.vercel.app</a>. We are building this for you—to give you the power of ownership without the barriers of the past.
          </p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="font-style: italic; color: #555; font-size: 15px; margin-bottom: 10px;">
            “Real estate shouldn’t be a fortress for the few, but a foundation for the many. Your piece of the future starts here.”
          </p>
          
          <p style="font-weight: bold; font-size: 16px;">
            — Murtaza Patel & Yagnesh Akbari
          </p>
        </div>
      `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.warn("Skipping email send: EMAIL_USER or EMAIL_PASS not set.");
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}