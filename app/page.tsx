import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-800 shadow-lg px-8 py-5 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <span className="text-teal-800 font-bold text-xl">M</span>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">MedSync</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-white font-medium hover:text-teal-200 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-white border-2 border-white/30 rounded-xl px-6 py-2.5 font-semibold hover:bg-white hover:text-teal-800 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-16 mb-16">
            {/* Headline */}
            <div className="flex-1 space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                SMART MEDICAL
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">INVENTORY</span> MANAGEMENT
                <br />
                MADE SIMPLE
              </h1>
              <div className="h-1.5 w-24 bg-gradient-to-r from-teal-600 to-teal-400 rounded-full"></div>
            </div>

            {/* Description */}
            <div className="flex-1 space-y-6 pt-4">
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                MedSync streamlines your medical supply chain with intelligent
                tracking, automated expiration alerts, and real-time inventory
                visibility. Keep your facility stocked and compliant.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Get Started →
              </Link>
            </div>
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Image - Medical Professionals */}
            <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl h-96 flex items-center justify-center shadow-2xl hover:shadow-teal-500/20 hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="text-white text-center z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="text-5xl mb-4">👨‍⚕️👩‍⚕️👩‍⚕️</div>
                <p className="text-xl font-semibold">Medical Professionals</p>
                <p className="text-teal-200 text-sm mt-2">Trusted by healthcare experts</p>
              </div>
            </div>

            {/* Right Image - Hospital Building */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-96 flex items-center justify-center shadow-2xl hover:shadow-gray-400/20 hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
              <div className="text-gray-700 text-center z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="text-5xl mb-4">🏥</div>
                <p className="text-xl font-semibold">Modern Hospital Facility</p>
                <p className="text-gray-600 text-sm mt-2">Built for efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
