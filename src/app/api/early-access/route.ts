import { NextResponse } from "next/server";
import { joinEarlyAccess } from "@/lib/actions/early-access";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[API Early Access] Received request:", body);

    const result = await joinEarlyAccess(body);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      // result.error comes from Zod or DB checks
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error?.includes("already") ? 409 : 400 }
      );
    }
  } catch (error) {
    console.error("[API Early Access] Crash:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
