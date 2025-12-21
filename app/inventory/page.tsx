import Sidebar from "@/components/Sidebar";

export default function InventoryPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePage="inventory" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="text-gray-400 text-sm px-8 pt-4">Inventory</div>

        {/* Top Bar */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Inventory Overview
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back, Dr. Mehtap Donato
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-800">
                <span className="text-xl">🔍</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800 relative">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  1
                </span>
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium">
                + Add Medicine
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Blank */}
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
            <p className="text-gray-400">Inventory content will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

