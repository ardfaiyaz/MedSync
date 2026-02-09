"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase/Client";
import { Medicine, Profile, MedicineFormData } from "@/types/database";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, X, Package } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SortableTable from "@/components/ui/SortableTable";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
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

  const handleDeleteClick = (medicine: Medicine) => {
    setMedicineToDelete(medicine);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!medicineToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("medicines")
        .delete()
        .eq("id", medicineToDelete.id);

      if (error) throw error;

      setMedicines(medicines.filter((m) => m.id !== medicineToDelete.id));

      await createActivityLog(
        "delete",
        "medicine",
        medicineToDelete.id,
        `Deleted ${medicineToDelete.name}`
      );

      setShowDeleteModal(false);
      setMedicineToDelete(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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

  const tableColumns = [
    {
      key: "name" as keyof Medicine,
      label: "Name",
      sortable: true,
      render: (value: any, row: Medicine) => (
        <div>
          <div className="text-sm md:text-base font-semibold text-gray-900">{row.name}</div>
          {row.description && (
            <div className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">
              {row.description.substring(0, 50)}
              {row.description.length > 50 ? "..." : ""}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "category" as keyof Medicine,
      label: "Category",
      sortable: true,
      render: (value: any) => <div className="text-sm md:text-base text-gray-900">{value || "N/A"}</div>,
    },
    {
      key: "quantity" as keyof Medicine,
      label: "Quantity",
      sortable: true,
      render: (value: any, row: Medicine) => (
        <div className="text-sm md:text-base text-gray-900 font-medium">
          {value} {row.unit}
        </div>
      ),
    },
    {
      key: "expiry_date" as keyof Medicine,
      label: "Expiry Date",
      sortable: true,
      render: (value: any) => (
        <div className="text-sm md:text-base text-gray-900">
          {value ? new Date(value).toLocaleDateString() : "N/A"}
        </div>
      ),
    },
    {
      key: "low_stock_threshold" as keyof Medicine,
      label: "Status",
      sortable: false,
      render: (value: any, row: Medicine) => getStatusBadge(row),
    },
    {
      key: "id" as keyof Medicine,
      label: "Actions",
      sortable: false,
      render: (value: any, row: Medicine) => (
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              openEditModal(row);
            }}
            aria-label={`Edit ${row.name}`}
            className="text-xs md:text-sm"
          >
            <Edit className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              handleDeleteClick(row);
            }}
            disabled={loading}
            aria-label={`Delete ${row.name}`}
            className="text-xs md:text-sm"
          >
            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activePage="inventory" />

      <div className="flex-1 flex flex-col md:ml-0">
        <motion.div
          className="text-gray-400 text-xs md:text-sm px-4 md:px-8 pt-16 md:pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Inventory
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm px-4 md:px-10 py-4 md:py-8 border-b border-gray-200/50 shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Inventory Overview
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-lg font-light">Welcome back, {userName}</p>
            </div>
            <Button onClick={openAddModal} size="md" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">Add Medicine</span>
            </Button>
          </div>
        </motion.div>

        <div className="flex-1 p-4 md:p-6 lg:p-10">
          <motion.div
            className="mb-4 md:mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines..."
                className="w-full bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 pl-10 md:pl-16 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 shadow-md"
              />
              <Search className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-6 md:h-6" />
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredMedicines.length > 0 ? (
              <SortableTable data={filteredMedicines} columns={tableColumns} />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg p-8 md:p-16 text-center border border-gray-100">
                <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                <p className="text-gray-400 text-sm md:text-base lg:text-lg">
                  {searchQuery
                    ? "No medicines found matching your search"
                    : "No medicines in inventory. Add your first medicine!"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-4 md:mb-6 lg:mb-8">
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                    {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    disabled={loading}
                    aria-label="Close modal"
                    title="Close modal"
                  >
                    <X className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm md:text-base">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="medicine-name" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Name *
                      </label>
                      <input
                        id="medicine-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        placeholder="Enter medicine name"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="medicine-category" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Category
                      </label>
                      <input
                        id="medicine-category"
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        placeholder="Enter category"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="medicine-description" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                      Description
                    </label>
                    <textarea
                      id="medicine-description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      placeholder="Enter description"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="medicine-quantity" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Quantity *
                      </label>
                      <input
                        id="medicine-quantity"
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
                        placeholder="0"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="medicine-unit" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Unit
                      </label>
                      <input
                        id="medicine-unit"
                        type="text"
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                        placeholder="pieces"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="medicine-threshold" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Low Stock Threshold
                      </label>
                      <input
                        id="medicine-threshold"
                        type="number"
                        value={formData.low_stock_threshold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            low_stock_threshold: parseInt(e.target.value) || 10,
                          })
                        }
                        min="0"
                        placeholder="10"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="medicine-expiry" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Expiry Date
                      </label>
                      <input
                        id="medicine-expiry"
                        type="date"
                        value={formData.expiry_date}
                        onChange={(e) =>
                          setFormData({ ...formData, expiry_date: e.target.value })
                        }
                        placeholder="Select expiry date"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="medicine-price" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Price
                      </label>
                      <input
                        id="medicine-price"
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
                        placeholder="0.00"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="medicine-supplier" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Supplier
                      </label>
                      <input
                        id="medicine-supplier"
                        type="text"
                        value={formData.supplier}
                        onChange={(e) =>
                          setFormData({ ...formData, supplier: e.target.value })
                        }
                        placeholder="Enter supplier name"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="medicine-batch" className="block text-gray-700 text-sm md:text-base font-semibold mb-2 md:mb-3">
                        Batch Number
                      </label>
                      <input
                        id="medicine-batch"
                        type="text"
                        value={formData.batch_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            batch_number: e.target.value,
                          })
                        }
                        placeholder="Enter batch number"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-6 mt-6 md:mt-8">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full sm:w-auto"
                    >
                      {editingMedicine ? "Update Medicine" : "Add Medicine"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setMedicineToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Medicine"
          message={`Are you sure you want to delete "${medicineToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={loading}
        />
      </AnimatePresence>
    </div>
  );
}
