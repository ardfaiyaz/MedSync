"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/Client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Package, LogOut, User } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  activePage: "dashboard" | "inventory" | "profile";
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

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home, key: "dashboard" },
    { href: "/inventory", label: "Inventory", icon: Package, key: "inventory" },
    { href: "/profile", label: "Profile", icon: User, key: "profile" },
  ];

  return (
    <motion.div
      className="w-64 bg-gradient-to-b from-teal-800 to-teal-900 min-h-screen flex flex-col shadow-2xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Logo */}
      <motion.div
        className="p-6 border-b border-teal-700/50 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-2 group cursor-pointer">
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/logo.svg"
              alt="MedSync Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </motion.div>
          <span className="text-white text-xl font-bold tracking-tight">MedSync</span>
        </div>
        <p className="text-teal-200 text-xs font-light mt-1">Clinical Inventory</p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          return (
            <motion.div
              key={item.key}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg"
                      : "text-teal-100 hover:bg-teal-700/50"
                  }`}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile */}
      <motion.div
        className="p-4 border-t border-teal-700/50 backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2 group">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-white font-semibold">{userInitials}</span>
          </motion.div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">{userName}</p>
            <button
              onClick={handleLogout}
              className="text-teal-200 text-xs hover:text-white hover:underline transition-colors duration-200 flex items-center gap-1 mt-1"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
