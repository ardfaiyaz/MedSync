import { createServerClient } from "@/lib/supabase/Server";
import { redirect } from "next/navigation";
import ProfileContent from "./ProfileContent";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createServerClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      redirect("/login");
    }
  }
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <ProfileContent profile={profile} userId={user.id} />;
}
