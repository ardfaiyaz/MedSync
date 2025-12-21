"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/Client";
import { useEffect, useState } from "react";

interface SidebarProps {
  activePage: "dashboard" | "inventory";
}

export default function Sidebar({ activePage }: SidebarProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          const name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
          setUserName(name || "User");
          const initials =
            (profile.first_name?.[0] || "") + (profile.last_name?.[0] || "") ||
            "U";
          setUserInitials(initials.toUpperCase());
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };
  return (
    <div className="w-64 bg-gradient-to-b from-teal-800 to-teal-900 min-h-screen flex flex-col shadow-2xl animate-slideInLeft">
      {/* Logo */}
      <div className="p-6 border-b border-teal-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2 group cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span className="text-teal-800 font-bold text-xl">M</span>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">MedSync</span>
        </div>
        <p className="text-teal-200 text-xs font-light mt-1">Clinical Inventory</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 group ${
            activePage === "dashboard"
              ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg scale-105"
              : "text-teal-100 hover:bg-teal-700/50 hover:scale-105 hover:shadow-md"
          }`}
        >
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏠</span>
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          href="/inventory"
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 group ${
            activePage === "inventory"
              ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg scale-105"
              : "text-teal-100 hover:bg-teal-700/50 hover:scale-105 hover:shadow-md"
          }`}
        >
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">📦</span>
          <span className="font-medium">Inventory</span>
        </Link>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-teal-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2 group">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
            <span className="text-white font-semibold">{userInitials}</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{userName}</p>
            <button
              onClick={handleLogout}
              className="text-teal-200 text-xs hover:text-white hover:underline transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

