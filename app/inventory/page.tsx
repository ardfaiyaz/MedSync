import { createServerClient } from "@/lib/supabase/Server";
import { redirect } from "next/navigation";
import InventoryContent from "./InventoryContent";

// Force dynamic rendering - requires environment variables
export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const supabase = await createServerClient();
  
  // Check authentication - try getSession first, then getUser
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // If no session, try getUser as fallback
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      redirect("/login");
    }
  }
  
  // Get user from session or fetch it
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch all medicines
  const { data: medicines } = await supabase
    .from("medicines")
    .select("*")
    .order("created_at", { ascending: false });

  return <InventoryContent profile={profile} medicines={medicines || []} />;
}

