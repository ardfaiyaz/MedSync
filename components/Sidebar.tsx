import Link from "next/link";

interface SidebarProps {
  activePage: "dashboard" | "inventory" | "alerts" | "settings";
}

export default function Sidebar({ activePage }: SidebarProps) {
  return (
    <div className="w-64 bg-teal-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-teal-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <span className="text-teal-800 font-bold text-xl">M</span>
          </div>
          <span className="text-white text-xl font-semibold">MedSync</span>
        </div>
        <p className="text-teal-200 text-sm mt-1">Clinical Inventory</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            activePage === "dashboard"
              ? "bg-teal-700 text-white"
              : "text-teal-100 hover:bg-teal-700"
          }`}
        >
          <span className="text-xl">🏠</span>
          <span>Dashboard</span>
        </Link>

        <Link
          href="/inventory"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            activePage === "inventory"
              ? "bg-teal-700 text-white"
              : "text-teal-100 hover:bg-teal-700"
          }`}
        >
          <span className="text-xl">📦</span>
          <span>Inventory</span>
        </Link>

        <Link
          href="/alerts"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            activePage === "alerts"
              ? "bg-teal-700 text-white"
              : "text-teal-100 hover:bg-teal-700"
          }`}
        >
          <span className="text-xl relative">
            🔔
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              3
            </span>
          </span>
          <span>Alerts</span>
        </Link>

        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            activePage === "settings"
              ? "bg-teal-700 text-white"
              : "text-teal-100 hover:bg-teal-700"
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-teal-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">MD</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              Dr. Mehtap Donato
            </p>
            <Link
              href="/login"
              className="text-teal-200 text-xs hover:underline"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

