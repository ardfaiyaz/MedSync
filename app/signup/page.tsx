import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="text-gray-400 text-sm mb-4">Sign Up Page</div>

        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-teal-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-teal-600 text-2xl font-semibold">
              MedSync
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Smart Medical Inventory. Made Simple.
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-teal-600 mb-2">
              Create Account
            </h1>
            <p className="text-gray-500">
              Join the MedSync Community Today
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Link
              href="/login"
              className="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg text-center font-medium"
            >
              Sign Up
            </Link>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Full Address Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Full Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    House/Building No.
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter house/building number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Street Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter street name"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Barangay
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Enter barangay"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    City/Municipality
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Province
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter province"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            {/* Birthday Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Birthday
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Day
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>

            {/* License Upload Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                License
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-600 transition cursor-pointer">
                <div className="text-4xl mb-2">📤</div>
                <p className="text-gray-700 font-medium mb-1">Upload ID</p>
                <p className="text-xs text-gray-500">
                  Max 5MB. JPG/PNG/PDF only
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to MedSync's Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

