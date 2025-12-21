// Admin functions for Supabase (uses service role key)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Admin client with service role key (bypasses RLS)
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null as any; // Type assertion for build-time safety

// Auto-confirm a user by email
export async function confirmUserByEmail(email: string) {
  try {
    // Get user by email using admin API
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      return { error: listError.message };
    }

    const user = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { error: "User not found" };
    }

    // Update user to confirmed
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    return { error: error.message || "Failed to confirm user" };
  }
}

// Auto-confirm a user by ID
export async function confirmUserById(userId: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    return { error: error.message || "Failed to confirm user" };
  }
}

