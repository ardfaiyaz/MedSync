// Database types for MedSync

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  house_number: string | null;
  street_name: string | null;
  barangay: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  birthday: string | null;
  license_url: string | null;
  role: 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  supplier: string | null;
  batch_number: string | null;
  price: number | null;
  low_stock_threshold: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string | null;
  created_at: string;
}

export interface MedicineFormData {
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  unit?: string;
  expiry_date?: string;
  supplier?: string;
  batch_number?: string;
  price?: number;
  low_stock_threshold?: number;
}

