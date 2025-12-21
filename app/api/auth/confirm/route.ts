// API route to auto-confirm users
import { confirmUserByEmail, confirmUserById } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
    }

    const { email, userId } = await request.json();

    if (userId) {
      const result = await confirmUserById(userId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, data: result.data });
    }

    if (email) {
      const result = await confirmUserByEmail(email);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, data: result.data });
    }

    return NextResponse.json({ error: "Email or userId required" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

