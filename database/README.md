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
3. Open the `database/schema.sql` file from this project
4. Copy the entire contents of `schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for the query to complete successfully

### 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY`)

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local` in your project root
2. Fill in your Supabase credentials:

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
- `first_name`, `last_name`
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

- **Profiles**: Users can view/update their own profile; Admins can view all
- **Medicines**: All authenticated users can view; Users can create/update/delete their own; Admins can manage all
- **Activity Logs**: All authenticated users can view and create logs

## Testing

1. Start your Next.js development server: `npm run dev`
2. Navigate to `/signup` and create a test account
3. Check Supabase dashboard → **Table Editor** → `profiles` to see your new user
4. Log in and try adding a medicine in the inventory page
5. Check `medicines` and `activity_logs` tables to verify data

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the entire `schema.sql` file
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

