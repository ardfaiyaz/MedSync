"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/Client";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const urlEmail = searchParams.get("email");
  const storedEmail = typeof window !== "undefined" ? sessionStorage.getItem("signup_email") : null;
  const storedPassword = typeof window !== "undefined" ? sessionStorage.getItem("signup_password") : null;
  
  const [email, setEmail] = useState(urlEmail || storedEmail || "");
  const [password, setPassword] = useState(storedPassword || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (storedEmail || storedPassword || urlEmail) {
      setShowSuccess(true);
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

      if (error && (error.message.includes("email not confirmed") || error.message.includes("Email not confirmed"))) {
        try {
          const confirmResponse = await fetch("/api/auth/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (confirmResponse.ok) {
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (retryError) throw retryError;

            if (retryData.user && retryData.session) {
              sessionStorage.removeItem("signup_email");
              sessionStorage.removeItem("signup_password");
              await new Promise(resolve => setTimeout(resolve, 200));
              window.location.href = "/dashboard";
              return;
            }
          }
        } catch (confirmErr) {
          throw error;
        }
      }

      if (error) throw error;

      if (data.user && data.session) {
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("signup_password");
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.replace("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl">
        <motion.div
          className="text-gray-400 text-xs md:text-sm mb-2 md:mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Login Page
        </motion.div>

        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3 group">
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
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </motion.div>
            <span className="text-teal-700 text-2xl md:text-3xl font-bold tracking-tight">
              MedSync
            </span>
          </div>
          <p className="text-gray-600 text-xs md:text-sm font-light">
            Smart Medical Inventory. Made Simple.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 backdrop-blur-sm border border-white/50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="mb-4 md:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-light">Sign in to your MedSync Account</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 md:mb-6">
            <Link href="/login" className="flex-1">
              <Button variant="primary" fullWidth size="md">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="secondary" fullWidth size="md">
                Sign Up
              </Button>
            </Link>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg text-sm shadow-md flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Account created successfully!</p>
                  <p className="text-sm mt-1">Your email and password are pre-filled. Just click Sign In.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm shadow-md flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <XCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 pr-10 md:pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                loading={loading}
                fullWidth
                className="mt-6"
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          <motion.p
            className="text-xs text-gray-400 text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            By continuing, you agree to MedSync's Terms of Service and Privacy Policy.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
