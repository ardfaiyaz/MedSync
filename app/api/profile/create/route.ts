// API route to create/update profile using service role (bypasses RLS)
import { supabaseAdmin } from "@/lib/supabase/Server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, profileData } = await request.json();

    if (!userId || !profileData) {
      return NextResponse.json(
        { error: "userId and profileData are required" },
        { status: 400 }
      );
    }

    // If email is not provided in profileData, get it from auth.users
    let finalProfileData = { ...profileData };
    if (!finalProfileData.email) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (authUser?.user?.email) {
        finalProfileData.email = authUser.user.email;
      }
    }

    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          ...finalProfileData,
        },
        {
          onConflict: "id",
        }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create profile" },
      { status: 500 }
    );
  }
}

