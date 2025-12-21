import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-teal-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <span className="text-teal-800 font-bold text-xl">M</span>
          </div>
          <span className="text-white text-xl font-semibold">MedSync</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-white border border-white rounded-lg px-4 py-2 hover:bg-teal-700 transition"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-12">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12 mb-12">
            {/* Headline */}
            <div className="flex-1">
              <h1 className="text-6xl font-bold text-gray-800 leading-tight mb-6">
                SMART MEDICAL
                <br />
                <span className="text-teal-800">INVENTORY</span> MANAGEMENT
                <br />
                MADE SIMPLE
              </h1>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-lg text-gray-700 leading-relaxed">
                MedSync streamlines your medical supply chain with intelligent
                tracking, automated expiration alerts, and real-time inventory
                visibility. Keep your facility stocked and compliant.
              </p>
            </div>
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Image - Medical Professionals */}
            <div className="bg-teal-800 rounded-lg h-96 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-4">👨‍⚕️👩‍⚕️👩‍⚕️</div>
                <p className="text-lg">Medical Professionals</p>
              </div>
            </div>

            {/* Right Image - Hospital Building */}
            <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <div className="text-4xl mb-4">🏥</div>
                <p className="text-lg">Modern Hospital Facility</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
