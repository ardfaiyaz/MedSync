import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="text-gray-400 text-sm px-8 pt-4">Dashboard</div>

        {/* Top Bar */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Overview
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

        {/* Content Area */}
        <div className="flex-1 p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow p-6 relative">
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">12</span>
              </div>
              <div className="text-3xl mb-2">📦</div>
              <p className="text-gray-500 text-sm mb-1">Total Medicines</p>
              <p className="text-2xl font-bold text-gray-800">147</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow p-6 relative">
              <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xs font-bold">10</span>
              </div>
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-gray-500 text-sm mb-1">Total Medicines</p>
              <p className="text-2xl font-bold text-gray-800">147</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow p-6 relative">
              <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs font-bold">6</span>
              </div>
              <div className="text-3xl mb-2">⏰</div>
              <p className="text-gray-500 text-sm mb-1">Total Medicines</p>
              <p className="text-2xl font-bold text-gray-800">147</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg shadow p-6 relative">
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">10</span>
              </div>
              <div className="text-3xl mb-2">🌊</div>
              <p className="text-gray-500 text-sm mb-1">Total Medicines</p>
              <p className="text-2xl font-bold text-gray-800">147</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <p className="text-gray-800 font-medium">
                    Restocked Paracetamol 500mg
                  </p>
                  <p className="text-gray-500 text-sm">By Ravi Khan - 10 min ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <p className="text-gray-800 font-medium">
                    Updated Paracetamol 500mg
                  </p>
                  <p className="text-gray-500 text-sm">By Ravi Khan - 10 min ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <p className="text-gray-800 font-medium">
                    Added Amoxicillin 200mg
                  </p>
                  <p className="text-gray-500 text-sm">By Ravi Khan - 10 min ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <p className="text-gray-800 font-medium">
                    Updated Amoxicillin 200mg
                  </p>
                  <p className="text-gray-500 text-sm">By Ravi Khan - 10 min ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">
                    Added Amoxicillin 200mg
                  </p>
                  <p className="text-gray-500 text-sm">By Ravi Khan - 10 min ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

