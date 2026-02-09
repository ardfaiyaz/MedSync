"use client";

import Sidebar from "@/components/Sidebar";
import { Profile, ActivityLog } from "@/types/database";
import { motion } from "framer-motion";
import { Package, AlertTriangle, Clock, XCircle, Plus, Activity } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface DashboardContentProps {
  profile: Profile | null;
  totalMedicines: number;
  lowStockCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  recentActivity: (ActivityLog & {
    profiles: { first_name: string | null; last_name: string | null } | null;
  })[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function DashboardContent({
  profile,
  totalMedicines,
  lowStockCount,
  expiringSoonCount,
  expiredCount,
  recentActivity,
}: DashboardContentProps) {
  const userName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
      "User"
    : "User";

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""} ago`;
  };

  const statsCards = [
    {
      icon: Package,
      label: "Total Medicines",
      value: totalMedicines,
      color: "blue",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-100 to-blue-200",
    },
    {
      icon: AlertTriangle,
      label: "Low Stock",
      value: lowStockCount,
      color: "yellow",
      gradient: "from-yellow-600 to-yellow-700",
      bgGradient: "from-yellow-100 to-yellow-200",
    },
    {
      icon: Clock,
      label: "Expiring Soon",
      value: expiringSoonCount,
      color: "orange",
      gradient: "from-orange-600 to-orange-700",
      bgGradient: "from-orange-100 to-orange-200",
    },
    {
      icon: XCircle,
      label: "Expired",
      value: expiredCount,
      color: "red",
      gradient: "from-red-600 to-red-700",
      bgGradient: "from-red-100 to-red-200",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activePage="dashboard" />

      <div className="flex-1 flex flex-col md:ml-0">
        <motion.div
          className="text-gray-400 text-xs md:text-sm px-4 md:px-8 pt-16 md:pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Dashboard
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm px-4 md:px-10 py-4 md:py-8 border-b border-gray-200/50 shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-lg font-light">Welcome back, {userName}</p>
            </div>
            <Link href="/inventory" className="w-full sm:w-auto">
              <Button size="md" className="w-full sm:w-auto">
                <Plus className="w-4 h-4 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">Add Medicine</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="flex-1 p-4 md:p-6 lg:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-10">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 lg:p-8 border border-gray-100 relative overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`absolute top-3 right-3 md:top-6 md:right-6 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br ${card.bgGradient} rounded-full flex items-center justify-center shadow-md`}>
                    <span className={`text-${card.color}-600 text-xs md:text-base font-bold`}>
                      {card.value}
                    </span>
                  </div>
                  <div className="mb-2 md:mb-4">
                    <Icon className={`w-12 h-12 md:w-16 md:h-16 text-${card.color}-600`} />
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm lg:text-base mb-1 md:mb-2 font-medium">{card.label}</p>
                  <p className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 lg:p-8 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-teal-600" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Recent Activity
              </h2>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {recentActivity.map((activity, index) => {
                  const userName = activity.profiles
                    ? `${activity.profiles.first_name || ""} ${activity.profiles.last_name || ""}`.trim() ||
                      "Unknown"
                    : "System";
                  return (
                    <motion.div
                      key={activity.id}
                      className="flex justify-between items-start md:items-center p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 bg-gray-50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-semibold text-sm md:text-base lg:text-lg truncate">
                          {activity.description || activity.action}
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1 md:mt-2">
                          By {userName} - {formatTimeAgo(activity.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm md:text-base lg:text-lg text-center py-8 md:py-12">No recent activity</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
