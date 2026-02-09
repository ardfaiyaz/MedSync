"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase/Client";
import { Profile } from "@/types/database";
import { motion, AnimatePresence } from "framer-motion";
import { User, Save, Upload, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProfileContentProps {
  profile: Profile | null;
  userId: string;
}

export default function ProfileContent({ profile: initialProfile, userId }: ProfileContentProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: initialProfile?.first_name || "",
    last_name: initialProfile?.last_name || "",
    phone_number: initialProfile?.phone_number || "",
    house_number: initialProfile?.house_number || "",
    street_name: initialProfile?.street_name || "",
    barangay: initialProfile?.barangay || "",
    city: initialProfile?.city || "",
    province: initialProfile?.province || "",
    postal_code: initialProfile?.postal_code || "",
    birthday: initialProfile?.birthday || "",
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setSuccess("Profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `licenses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('licenses')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('licenses')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ license_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccess("License uploaded successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to upload license");
    } finally {
      setUploading(false);
    }
  };

  const userName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User"
    : "User";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activePage="profile" />

      <div className="flex-1 flex flex-col md:ml-0">
        <motion.div
          className="text-gray-400 text-xs md:text-sm px-4 md:px-8 pt-16 md:pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Profile
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm px-4 md:px-10 py-4 md:py-8 border-b border-gray-200/50 shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-lg font-light">Manage your account information</p>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 p-4 md:p-6 lg:p-10">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 lg:p-8 border border-gray-100 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <XCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="profile-first-name" className="block text-gray-700 text-sm font-semibold mb-2">
                    First Name
                  </label>
                  <input
                    id="profile-first-name"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Enter first name"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="profile-last-name" className="block text-gray-700 text-sm font-semibold mb-2">
                    Last Name
                  </label>
                  <input
                    id="profile-last-name"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Enter last name"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profile-phone" className="block text-gray-700 text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-house-number" className="block text-gray-700 text-sm font-semibold mb-2">
                      House/Building No.
                    </label>
                    <input
                      id="profile-house-number"
                      type="text"
                      value={formData.house_number}
                      onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                      placeholder="Enter house/building number"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-street-name" className="block text-gray-700 text-sm font-semibold mb-2">
                      Street Name
                    </label>
                    <input
                      id="profile-street-name"
                      type="text"
                      value={formData.street_name}
                      onChange={(e) => setFormData({ ...formData, street_name: e.target.value })}
                      placeholder="Enter street name"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="profile-barangay" className="block text-gray-700 text-sm font-semibold mb-2">
                    Barangay
                  </label>
                  <input
                    id="profile-barangay"
                    type="text"
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    placeholder="Enter barangay"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label htmlFor="profile-city" className="block text-gray-700 text-sm font-semibold mb-2">
                      City/Municipality
                    </label>
                    <input
                      id="profile-city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter city"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-province" className="block text-gray-700 text-sm font-semibold mb-2">
                      Province
                    </label>
                    <input
                      id="profile-province"
                      type="text"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="Enter province"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-postal-code" className="block text-gray-700 text-sm font-semibold mb-2">
                      Postal Code
                    </label>
                    <input
                      id="profile-postal-code"
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      placeholder="Enter postal code"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="profile-birthday" className="block text-gray-700 text-sm font-semibold mb-2">
                  Birthday
                </label>
                <input
                  id="profile-birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  placeholder="Select birthday"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="profile-license" className="block text-gray-700 text-sm font-semibold mb-2">
                  License Upload
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-600 transition cursor-pointer relative">
                  <input
                    id="profile-license"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                    aria-label="Upload license file"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-700 font-medium mb-1">
                    {uploading ? "Uploading..." : "Click to upload license"}
                  </p>
                  <p className="text-xs text-gray-500">Max 5MB. JPG/PNG/PDF only</p>
                  {profile?.license_url && (
                    <a
                      href={profile.license_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline text-sm mt-2 inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View current license
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 md:gap-4 pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  size="md"
                  className="w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Save Changes</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
