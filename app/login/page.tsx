import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Page Title */}
        <div className="text-gray-400 text-sm mb-4">Login Page</div>

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

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-teal-600 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">Sign in to your MedSync Account</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Link
              href="/login"
              className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg text-center font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-50"
            >
              Sign Up
            </Link>
          </div>

          {/* Form */}
          <form className="space-y-4">
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
                Password
              </label>
              <input
                type="password"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition mt-6"
            >
              Sign In
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

