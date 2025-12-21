"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/Client";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get email from URL params or sessionStorage
  const urlEmail = searchParams.get("email");
  const storedEmail = typeof window !== "undefined" ? sessionStorage.getItem("signup_email") : null;
  const storedPassword = typeof window !== "undefined" ? sessionStorage.getItem("signup_password") : null;
  
  const [email, setEmail] = useState(urlEmail || storedEmail || "");
  const [password, setPassword] = useState(storedPassword || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear stored credentials after reading them and show success message
  useEffect(() => {
    if (storedEmail || storedPassword || urlEmail) {
      setShowSuccess(true);
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      
      if (storedEmail || storedPassword) {
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("signup_password");
      }
      
      return () => clearTimeout(timer);
    }
  }, [storedEmail, storedPassword, urlEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If error is about email not confirmed, auto-confirm and retry
      if (error && (error.message.includes("email not confirmed") || error.message.includes("Email not confirmed"))) {
        try {
          // Auto-confirm the user
          const confirmResponse = await fetch("/api/auth/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (confirmResponse.ok) {
            // Retry login after confirmation
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (retryError) throw retryError;

            if (retryData.user && retryData.session) {
              // Clear any stored credentials on successful login
              sessionStorage.removeItem("signup_email");
              sessionStorage.removeItem("signup_password");
              
              // Wait for cookies to be set
              await new Promise(resolve => setTimeout(resolve, 200));
              
              // Force redirect to dashboard
              window.location.href = "/dashboard";
              return;
            }
          }
        } catch (confirmErr) {
          // If confirmation fails, show original error
          throw error;
        }
      }

      if (error) throw error;

      if (data.user && data.session) {
        // Clear any stored credentials on successful login
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("signup_password");
        
        // The createBrowserClient automatically sets cookies
        // Wait a moment for cookies to be properly set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Force full page reload - this ensures server can read the cookies
        window.location.replace("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-100 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl animate-slideUp">
        {/* Page Title */}
        <div className="text-gray-400 text-sm mb-4 animate-fadeIn delay-100">Login Page</div>

        {/* Logo and Tagline */}
        <div className="text-center mb-8 animate-fadeIn delay-200">
          <div className="flex items-center justify-center gap-3 mb-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-teal-700 text-3xl font-bold tracking-tight">
              MedSync
            </span>
          </div>
          <p className="text-gray-600 text-sm font-light">
            Smart Medical Inventory. Made Simple.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/50 animate-slideUp delay-300 hover:shadow-teal-500/10 transition-all duration-300">
          {/* Welcome Message */}
          <div className="mb-6 animate-fadeIn delay-400">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 font-light">Sign in to your MedSync Account</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 animate-fadeIn delay-500">
            <Link
              href="/login"
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-4 rounded-xl text-center font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl text-center font-semibold hover:bg-gray-50 hover:border-teal-500 hover:text-teal-700 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>

          {/* Success Message (from signup) */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg text-sm animate-slideDown shadow-md">
              <p className="font-semibold">✓ Account created successfully!</p>
              <p className="text-sm mt-1">Your email and password are pre-filled. Just click Sign In.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-shake shadow-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn delay-600">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3.5 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-6 animate-fadeIn delay-700">
            By continuing, you agree to MedSync's Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

