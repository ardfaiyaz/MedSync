import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Client for server-side operations (uses service role key for admin operations)
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null as any; // Type assertion for build-time safety

// Client for regular server-side operations (uses anon key and reads cookies properly)
export async function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  let cookieStore: Awaited<ReturnType<typeof cookies>>;
  
  try {
    cookieStore = await cookies();
  } catch (error) {
    // If cookies() fails, create client without cookie support
    return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    });
  }
  
  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        try {
          const allCookies = cookieStore.getAll();
          // Return cookies in the format expected by @supabase/ssr
          // The format should be: { name: string, value: string }[]
          return allCookies;
        } catch (error) {
          // This can happen during static generation
          return [];
        }
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              httpOnly: options?.httpOnly ?? false, // Must be false for client-side access
              sameSite: options?.sameSite ?? 'lax',
              secure: options?.secure ?? process.env.NODE_ENV === 'production',
              path: options?.path ?? '/',
            });
          });
        } catch (error) {
          // Handle cookie setting errors silently
          // This can happen during static generation or in certain contexts
        }
      },
    },
  });
}
