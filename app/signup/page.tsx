"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/Client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    houseNumber: "",
    streetName: "",
    barangay: "",
    city: "",
    province: "",
    postalCode: "",
    month: "",
    day: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Create auth user (email confirmation disabled)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Auto-confirm the user (bypass email confirmation)
        try {
          const confirmResponse = await fetch("/api/auth/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: authData.user.id }),
          });

          if (!confirmResponse.ok) {
            console.warn("Failed to auto-confirm user, but continuing...");
          }
        } catch (confirmError) {
          console.warn("Error confirming user:", confirmError);
          // Continue anyway - user can still use the app
        }

        // Build birthday date
        const birthday =
          formData.year && formData.month && formData.day
            ? `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`
            : null;

        // Wait a moment for the trigger to potentially create the profile
        await new Promise(resolve => setTimeout(resolve, 500));

        // Prepare profile data (email will be set by trigger from auth.users, but include it here too)
        const profileData = {
          id: authData.user.id,
          first_name: formData.firstName || null,
          last_name: formData.lastName || null,
          email: formData.email || authData.user.email || null, // Include email from form or auth
          phone_number: formData.phone || null,
          house_number: formData.houseNumber || null,
          street_name: formData.streetName || null,
          barangay: formData.barangay || null,
          city: formData.city || null,
          province: formData.province || null,
          postal_code: formData.postalCode || null,
          birthday: birthday || null,
          role: 'staff' as const,
        };

        // Use API route directly (bypasses RLS using service role)
        // This is more reliable than trying client-side insert which can be blocked by RLS
        try {
          const profileResponse = await fetch("/api/profile/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: authData.user.id,
              profileData: profileData
            }),
          });

          if (!profileResponse.ok) {
            const errorData = await profileResponse.json();
            console.warn("Profile creation warning:", errorData.error || "Profile may be created by trigger");
            // Continue anyway - trigger might have created it, or we can update later
          }
        } catch (apiError: any) {
          console.warn("Profile API call failed:", apiError.message || apiError);
          // Continue anyway - user account is created, profile can be updated later
        }

        // Store email and password temporarily for auto-fill on login page
        sessionStorage.setItem("signup_email", formData.email);
        sessionStorage.setItem("signup_password", formData.password);
        
        // Redirect to login with email pre-filled
        router.push(`/login?email=${encodeURIComponent(formData.email)}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-100 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl mx-auto animate-slideUp">
        {/* Page Title */}
        <div className="text-gray-400 text-sm mb-4 animate-fadeIn delay-100">Sign Up Page</div>

        {/* Logo and Tagline */}
        <div className="text-center mb-8 animate-fadeIn delay-200">
          <motion.div
            className="flex items-center justify-center gap-3 mb-3 group"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
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
            <span className="text-teal-700 text-3xl font-bold tracking-tight">
              MedSync
            </span>
          </motion.div>
          <p className="text-gray-600 text-sm font-light">
            Smart Medical Inventory. Made Simple.
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 backdrop-blur-sm border border-white/50 animate-slideUp delay-300 hover:shadow-teal-500/10 transition-all duration-300">
          {/* Header */}
          <div className="mb-4 md:mb-6 animate-fadeIn delay-400">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-light">
              Join the MedSync Community Today
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 md:mb-6">
            <Link href="/login" className="flex-1">
              <Button variant="secondary" fullWidth size="md">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="primary" fullWidth size="md">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 md:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-xs md:text-sm animate-shake shadow-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 hover:text-teal-600 transition-colors duration-200 focus:outline-none border-0 p-0"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 hover:text-teal-600 transition-colors duration-200 focus:outline-none border-0 p-0"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Full Address Section */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                Full Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    House/Building No.
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter house/building number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Street Name
                  </label>
                  <input
                    type="text"
                    name="streetName"
                    value={formData.streetName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
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
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter barangay"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    City/Municipality
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter province"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            {/* Birthday Section */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                Birthday
              </h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    maxLength={2}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Day
                  </label>
                  <input
                    type="text"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    maxLength={2}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    maxLength={4}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>

            {/* License Upload Section */}
            {/* License upload will be handled in the profile page with proper storage integration */}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              fullWidth
              className="mt-6"
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to MedSync's Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

