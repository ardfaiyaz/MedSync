"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/Client";
import { useEffect, useState } from "react";
import { Home, Package, LogOut, User, Menu, X } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  activePage: "dashboard" | "inventory" | "profile";
}

export default function Sidebar({ activePage }: SidebarProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home, key: "dashboard" },
    { href: "/inventory", label: "Inventory", icon: Package, key: "inventory" },
    { href: "/profile", label: "Profile", icon: User, key: "profile" },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-teal-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3 mb-2 group cursor-pointer">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="MedSync Logo"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12"
            />
          </div>
          <span className="text-white text-lg md:text-xl font-bold tracking-tight">MedSync</span>
        </div>
        <p className="text-teal-200 text-xs font-light mt-1 hidden md:block">Clinical Inventory</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl mb-2 transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg"
                    : "text-teal-100 hover:bg-teal-700/50"
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-2 md:p-4 border-t border-teal-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3 mb-2 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-semibold text-xs md:text-sm">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs md:text-sm font-semibold truncate">{userName}</p>
            <button
              onClick={handleLogout}
              className="text-teal-200 text-xs hover:text-white hover:underline transition-colors duration-200 flex items-center gap-1 mt-1"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-teal-700 text-white p-2 rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 bg-gradient-to-b from-teal-800 to-teal-900 min-h-screen flex-col shadow-2xl">
        <SidebarContent />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-teal-800 to-teal-900 flex flex-col shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}
