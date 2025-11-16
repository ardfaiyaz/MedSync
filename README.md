<div align="center">
# MedSync: Smart Medical Supply Inventory System

**MedSync is a web-based medical inventory management system designed to automate medicine tracking, expiration monitoring, stock control, and reporting for the NU Dasmariñas School Clinic.**

**This project uses **Next.js**, **Tailwind CSS**, and **Supabase** as its core technologies.**

</div>

---

## 🚀 Features

- Inventory management (add, edit, delete supplies)
- Expiration tracking with alerts
- Low-stock monitoring
- User authentication & role management (Admin/Staff)
- Activity logs & audit trail
- Clean dashboard UI using Tailwind CSS
- Supabase-managed database, auth, and API
- Secure environment configuration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 14 (App Router)** |
| Styling | **Tailwind CSS v4** |
| Backend / Database | **Supabase (PostgreSQL, Auth, Storage)** |
| Language | **TypeScript** |

---

## 📦 How to Clone and Run the Project

<div align="center">

Follow these steps to set up **MedSync** on your local machine.

</div>

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ardfaiyaz/medsync.git
cd medsync
```
---

## 2️⃣ Install Dependencies

Make sure Node.js (v18+) is installed.
```
npm install
```
---

## 3️⃣ Create .env.local File

Inside the project root, create a file called .env.local and paste the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://lcejelqbjkmpruhmtlwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjZWplbHFiamttcHJ1aG10bHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODE5NjQsImV4cCI6MjA3ODg1Nzk2NH0.SToiFsQXtu-ZNamZnNzTYhGmT9KOrCZhQY4IDCvpqkA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjZWplbHFiamttcHJ1aG10bHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI4MTk2NCwiZXhwIjoyMDc4ODU3OTY0fQ.ZfvPIAN4RbCBRk-N-gdowVxXWabgBFaobxj9FCVfbB4
```

---

## 4️⃣ Run the Development Server
```
npm run dev
```

---

## 📁 Project Structure

```
medsync/
├── app/                        # Next.js App Router pages
├── components/                 # React components
├── lib/                        # Utility libraries
│   └── supabase/               # Supabase clients
│       ├── client.ts           # Client-side Supabase
│       └── server.ts           # Server-side Supabase
├── .env.local                  # Supabase environment variables
├── package.json                # Dependencies
├── next.config.ts              # Next.js config
└── README.md                   # This file
```

