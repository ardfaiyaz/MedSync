"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase/Client";
import { Medicine, Profile, MedicineFormData } from "@/types/database";
import { Search, Plus, Edit, Trash2, X, Package } from "lucide-react";

interface InventoryContentProps {
  profile: Profile | null;
  medicines: Medicine[];
}

export default function InventoryContent({
  profile,
  medicines: initialMedicines,
}: InventoryContentProps) {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<MedicineFormData>({
    name: "",
    description: "",
    category: "",
    quantity: 0,
    unit: "pieces",
    expiry_date: "",
    supplier: "",
    batch_number: "",
    price: 0,
    low_stock_threshold: 10,
  });

  const userName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
      "User"
    : "User";

  // Filter medicines based on search
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingMedicine(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      quantity: 0,
      unit: "pieces",
      expiry_date: "",
      supplier: "",
      batch_number: "",
      price: 0,
      low_stock_threshold: 10,
    });
    setShowModal(true);
    setError(null);
  };

  const openEditModal = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description || "",
      category: medicine.category || "",
      quantity: medicine.quantity,
      unit: medicine.unit,
      expiry_date: medicine.expiry_date || "",
      supplier: medicine.supplier || "",
      batch_number: medicine.batch_number || "",
      price: medicine.price || 0,
      low_stock_threshold: medicine.low_stock_threshold,
    });
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
    setError(null);
  };

  const createActivityLog = async (
    action: string,
    entityType: string,
    entityId: string,
    description: string
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        description,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      if (editingMedicine) {
        // Update existing medicine
        const { data, error } = await supabase
          .from("medicines")
          .update({
            name: formData.name,
            description: formData.description || null,
            category: formData.category || null,
            quantity: formData.quantity,
            unit: formData.unit,
            expiry_date: formData.expiry_date || null,
            supplier: formData.supplier || null,
            batch_number: formData.batch_number || null,
            price: formData.price || null,
            low_stock_threshold: formData.low_stock_threshold || 10,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingMedicine.id)
          .select()
          .single();

        if (error) throw error;

        setMedicines(
          medicines.map((m) => (m.id === editingMedicine.id ? data : m))
        );

        await createActivityLog(
          "update",
          "medicine",
          data.id,
          `Updated ${data.name}`
        );
      } else {
        // Create new medicine
        const { data, error } = await supabase
          .from("medicines")
          .insert({
            name: formData.name,
            description: formData.description || null,
            category: formData.category || null,
            quantity: formData.quantity,
            unit: formData.unit,
            expiry_date: formData.expiry_date || null,
            supplier: formData.supplier || null,
            batch_number: formData.batch_number || null,
            price: formData.price || null,
            low_stock_threshold: formData.low_stock_threshold || 10,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        setMedicines([data, ...medicines]);

        await createActivityLog(
          "create",
          "medicine",
          data.id,
          `Added ${data.name}`
        );
      }

      closeModal();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (medicine: Medicine) => {
    if (!confirm(`Are you sure you want to delete ${medicine.name}?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("medicines")
        .delete()
        .eq("id", medicine.id);

      if (error) throw error;

      setMedicines(medicines.filter((m) => m.id !== medicine.id));

      await createActivityLog(
        "delete",
        "medicine",
        medicine.id,
        `Deleted ${medicine.name}`
      );

      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (medicine: Medicine) => {
    const today = new Date();
    const expiryDate = medicine.expiry_date
      ? new Date(medicine.expiry_date)
      : null;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiryDate && expiryDate < today) {
      return (
        <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
          Expired
        </span>
      );
    }
    if (
      expiryDate &&
      expiryDate >= today &&
      expiryDate <= thirtyDaysFromNow
    ) {
      return (
        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
          Expiring Soon
        </span>
      );
    }
    if (medicine.quantity <= medicine.low_stock_threshold) {
      return (
        <span className="px-4 py-2 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full">
          Low Stock
        </span>
      );
    }
    return (
      <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
        In Stock
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar activePage="inventory" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col animate-fadeIn">
        {/* Page Title */}
        <div className="text-gray-400 text-sm px-8 pt-4 animate-fadeIn delay-100">Inventory</div>

        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm px-10 py-8 border-b border-gray-200/50 shadow-sm animate-slideDown delay-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Inventory Overview
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-light">Welcome back, {userName}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={openAddModal}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg text-lg flex items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Add Medicine
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 animate-fadeIn delay-300">
          {/* Search Bar */}
          <div className="mb-8 animate-slideUp delay-400">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines by name, category, or description..."
                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-6 py-5 pl-16 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 shadow-md text-lg"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm animate-shake shadow-md">
              {error}
            </div>
          )}

          {/* Medicines Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-gray-100 animate-slideUp delay-500">
            {filteredMedicines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMedicines.map((medicine, index) => (
                      <tr 
                        key={medicine.id} 
                        className="bg-gray-50 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base font-semibold text-gray-900">
                            {medicine.name}
                          </div>
                          {medicine.description && (
                            <div className="text-base text-gray-500 mt-1">
                              {medicine.description.substring(0, 50)}
                              {medicine.description.length > 50 ? "..." : ""}
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base text-gray-900">
                            {medicine.category || "N/A"}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base text-gray-900 font-medium">
                            {medicine.quantity} {medicine.unit}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base text-gray-900">
                            {medicine.expiry_date
                              ? new Date(medicine.expiry_date).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          {getStatusBadge(medicine)}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => openEditModal(medicine)}
                              className="text-teal-600 font-semibold flex items-center gap-2"
                            >
                              <Edit className="w-5 h-5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(medicine)}
                              className="text-red-600 font-semibold flex items-center gap-2"
                              disabled={loading}
                            >
                              <Trash2 className="w-5 h-5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {searchQuery
                    ? "No medicines found matching your search"
                    : "No medicines in inventory. Add your first medicine!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp border border-gray-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800">
                  {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 text-3xl"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-base">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-base font-semibold mb-3">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                      min="0"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          low_stock_threshold: parseInt(e.target.value) || 10,
                        })
                      }
                      min="0"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) =>
                        setFormData({ ...formData, expiry_date: e.target.value })
                      }
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-base font-semibold mb-3">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={formData.batch_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          batch_number: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-6 mt-8">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl font-semibold shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Saving...
                      </span>
                    ) : editingMedicine ? (
                      "Update Medicine"
                    ) : (
                      "Add Medicine"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

