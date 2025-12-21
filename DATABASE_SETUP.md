# Database Setup Guide for MedSync

This guide will help you set up the Supabase database for MedSync.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Setup Steps

### 1. Create Your Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: MedSync (or your preferred name)
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
4. Wait for the project to be created (takes a few minutes)

### 2. Run the Database Schema

1. In your Supabase project dashboard, go to the **SQL Editor** (left sidebar)
2. Click **New Query**
3. Create the following tables and policies:

#### Create Tables

```sql
-- Profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  first_name text,
  last_name text,
  email text,
  phone_number text,
  house_number text,
  street_name text,
  barangay text,
  city text,
  province text,
  postal_code text,
  birthday date,
  license_url text,
  role text DEFAULT 'staff'::text CHECK (role = ANY (ARRAY['admin'::text, 'staff'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Medicines table
CREATE TABLE public.medicines (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category text,
  quantity integer NOT NULL DEFAULT 0,
  unit text DEFAULT 'pieces'::text,
  expiry_date date,
  supplier text,
  batch_number text,
  price numeric,
  low_stock_threshold integer DEFAULT 10,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT medicines_pkey PRIMARY KEY (id),
  CONSTRAINT medicines_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);

-- Activity logs table
CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
```

#### Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
```

#### Create RLS Policies

```sql
-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Medicines policies
CREATE POLICY "Users can view medicines"
  ON medicines FOR SELECT
  USING (true);

CREATE POLICY "Users can create medicines"
  ON medicines FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own medicines"
  ON medicines FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own medicines"
  ON medicines FOR DELETE
  USING (created_by = auth.uid());

-- Activity logs policies
CREATE POLICY "Users can view activity logs"
  ON activity_logs FOR SELECT
  USING (true);

CREATE POLICY "Users can create activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Create Trigger for New Users

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')::text
  )
  ON CONFLICT (id) DO UPDATE
  SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** (or press Ctrl+Enter)
5. Wait for the query to complete successfully

### 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY`)

### 4. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Verify Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables:
   - `profiles`
   - `medicines`
   - `activity_logs`

## Database Schema Overview

### Tables

#### `profiles`
Stores user profile information (extends Supabase auth.users)
- `id` (UUID, references auth.users)
- `first_name`, `last_name`, `email`
- `phone_number`
- Address fields (house_number, street_name, barangay, city, province, postal_code)
- `birthday`
- `license_url`
- `role` (admin or staff)

#### `medicines`
Stores medicine/inventory items
- `id` (UUID)
- `name`, `description`, `category`
- `quantity`, `unit`, `low_stock_threshold`
- `expiry_date`
- `supplier`, `batch_number`
- `price`
- `created_by` (references profiles.id)
- Timestamps

#### `activity_logs`
Stores activity history
- `id` (UUID)
- `user_id` (references profiles.id)
- `action` (create, update, delete)
- `entity_type`, `entity_id`
- `description`
- `created_at`

## Security (RLS Policies)

Row Level Security (RLS) is enabled on all tables:

- **Profiles**: Users can view/update their own profile
- **Medicines**: All authenticated users can view; Users can create/update/delete their own
- **Activity Logs**: All authenticated users can view and create logs

## Testing

1. Start your Next.js development server: `npm run dev`
2. Navigate to `/signup` and create a test account
3. Check Supabase dashboard → **Table Editor** → `profiles` to see your new user
4. Log in and try adding a medicine in the inventory page
5. Check `medicines` and `activity_logs` tables to verify data

## Troubleshooting

### "relation does not exist" error
- Make sure you ran all the SQL commands above
- Check that all tables were created in the Table Editor

### Authentication errors
- Verify your `.env.local` file has the correct credentials
- Make sure you're using the correct project URL and keys

### RLS policy errors
- Check that you're logged in
- Verify the RLS policies were created (check in Supabase dashboard → Authentication → Policies)

## Next Steps

After setup, you can:
- Create your first admin user (manually update `role` to 'admin' in the profiles table)
- Start adding medicines through the inventory page
- View activity logs in the dashboard

