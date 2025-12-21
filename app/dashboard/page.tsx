import Sidebar from "@/components/Sidebar";
import { createServerClient } from "@/lib/supabase/Server";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
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

  // Fetch medicines statistics
  const { data: medicines, count: totalMedicines } = await supabase
    .from("medicines")
    .select("*", { count: "exact" });

  // Calculate statistics
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const lowStockMedicines =
    medicines?.filter(
      (m) => m.quantity <= (m.low_stock_threshold || 10)
    ) || [];
  const expiringSoon =
    medicines?.filter((m) => {
      if (!m.expiry_date) return false;
      const expiryDate = new Date(m.expiry_date);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    }) || [];
  const expiredMedicines =
    medicines?.filter((m) => {
      if (!m.expiry_date) return false;
      return new Date(m.expiry_date) < today;
    }) || [];

  // Fetch recent activity logs
  const { data: recentActivity } = await supabase
    .from("activity_logs")
    .select(
      `
      *,
      profiles:user_id (
        first_name,
        last_name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <DashboardContent
      profile={profile}
      totalMedicines={totalMedicines || 0}
      lowStockCount={lowStockMedicines.length}
      expiringSoonCount={expiringSoon.length}
      expiredCount={expiredMedicines.length}
      recentActivity={recentActivity || []}
    />
  );
}

