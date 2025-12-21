"use client";

import Sidebar from "@/components/Sidebar";
import { Profile, ActivityLog } from "@/types/database";
import { Package, AlertTriangle, Clock, XCircle, Plus, Activity } from "lucide-react";

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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col animate-fadeIn">
        {/* Page Title */}
        <div className="text-gray-400 text-sm px-8 pt-4 animate-fadeIn delay-100">Dashboard</div>

        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm px-10 py-8 border-b border-gray-200/50 shadow-sm animate-slideDown delay-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-light">Welcome back, {userName}</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/inventory"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg text-lg flex items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Add Medicine
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 animate-fadeIn delay-300">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Card 1 - Total Medicines */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 animate-slideUp delay-400 relative">
              <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-md">
                <span className="text-blue-600 text-base font-bold">
                  {totalMedicines}
                </span>
              </div>
              <div className="mb-4">
                <Package className="w-16 h-16 text-blue-600" />
              </div>
              <p className="text-gray-500 text-base mb-2 font-medium">Total Medicines</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {totalMedicines}
              </p>
            </div>

            {/* Card 2 - Low Stock */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 animate-slideUp delay-500 relative">
              <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center shadow-md">
                <span className="text-yellow-600 text-base font-bold">
                  {lowStockCount}
                </span>
              </div>
              <div className="mb-4">
                <AlertTriangle className="w-16 h-16 text-yellow-600" />
              </div>
              <p className="text-gray-500 text-base mb-2 font-medium">Low Stock</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                {lowStockCount}
              </p>
            </div>

            {/* Card 3 - Expiring Soon */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 animate-slideUp delay-600 relative">
              <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-md">
                <span className="text-orange-600 text-base font-bold">
                  {expiringSoonCount}
                </span>
              </div>
              <div className="mb-4">
                <Clock className="w-16 h-16 text-orange-600" />
              </div>
              <p className="text-gray-500 text-base mb-2 font-medium">Expiring Soon</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                {expiringSoonCount}
              </p>
            </div>

            {/* Card 4 - Expired */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 animate-slideUp delay-700 relative">
              <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-md">
                <span className="text-red-600 text-base font-bold">
                  {expiredCount}
                </span>
              </div>
              <div className="mb-4">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
              <p className="text-gray-500 text-base mb-2 font-medium">Expired</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">{expiredCount}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 animate-slideUp delay-800">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-8 h-8 text-teal-600" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Recent Activity
              </h2>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const userName = activity.profiles
                    ? `${activity.profiles.first_name || ""} ${activity.profiles.last_name || ""}`.trim() ||
                      "Unknown"
                    : "System";
                  return (
                    <div
                      key={activity.id}
                      className="flex justify-between items-center p-6 rounded-2xl border border-gray-100 bg-gray-50 animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div>
                        <p className="text-gray-800 font-semibold text-lg">
                          {activity.description || activity.action}
                        </p>
                        <p className="text-gray-500 text-base mt-2">
                          By {userName} - {formatTimeAgo(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-lg text-center py-12">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

