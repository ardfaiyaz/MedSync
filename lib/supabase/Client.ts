import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Browser client that stores auth in cookies (compatible with SSR)
// createBrowserClient from @supabase/ssr automatically handles cookies
// Use placeholder values during build if env vars are not set
export const supabase = createBrowserClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
