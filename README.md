# MedSync - Smart Medical Inventory Management System

A modern, full-stack medical inventory management system built with Next.js, Supabase, and Tailwind CSS. MedSync helps medical facilities track medicines, monitor expiration dates, manage stock levels, and maintain comprehensive activity logs.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure sign-up and login with email/password
- **Dashboard Overview**: Real-time statistics and recent activity tracking
- **Inventory Management**: Full CRUD operations for medicines
  - Add, edit, and delete medicines with confirmation modals
  - Search and filter functionality
  - Sortable tables (click column headers to sort)
  - Status badges (In Stock, Low Stock, Expiring Soon, Expired)
- **Smart Alerts**: Automatic tracking of:
  - Low stock items
  - Expiring medicines (within 30 days)
  - Expired medicines
- **Activity Logging**: Complete audit trail of all actions
- **User Profiles**: Comprehensive user information with email integration
  - Profile editing with form validation
  - License upload to Supabase Storage
  - Address management

### Design & UX
- **Modern UI**: Clean, professional medical-themed design with Inter font
- **Framer Motion Animations**: Smooth, performant animations throughout
- **Loading States**: Circular loading indicators in all buttons
- **Confirmation Modals**: Custom confirmation dialogs for all CRUD operations
- **Responsive Design**: Works seamlessly on all devices (mobile-first)
- **Sortable Tables**: Click any column header to sort data
- **Accessibility**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Design Tokens**: Consistent teal + neutral color palette

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v4 |
| **Backend/Database** | Supabase (PostgreSQL, Auth, RLS) |
| **Language** | TypeScript |
| **Icons** | Lucide React |
| **Font** | Inter (Google Fonts) |

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ardfaiyaz/medsync.git
cd medsync
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL files in this order:
   - `database/schema.sql` - Main schema
   - `database/add_email_to_profiles.sql` - Add email column (optional but recommended)
4. Get your Supabase credentials from Settings → API

### 4. Configure Environment Variables

Create a `.env.local` file in the project root (copy from `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DEBUG=true  # Optional: bypasses email verification for local development
```

**Important**: Make sure to create a Supabase Storage bucket named `licenses` for profile license uploads.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
medsync/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── profile/              # Profile management
│   ├── dashboard/                # Dashboard page
│   ├── inventory/                # Inventory management
│   ├── login/                    # Login page
│   ├── signup/                   # Sign-up page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   └── Sidebar.tsx               # Navigation sidebar
├── lib/                          # Utility libraries
│   └── supabase/                 # Supabase clients
│       ├── Client.ts             # Browser client
│       ├── Server.ts             # Server client
│       └── admin.ts              # Admin operations
├── types/                        # TypeScript types
│   └── database.ts               # Database type definitions
├── database/                     # SQL scripts
│   ├── schema.sql                # Main database schema
│   ├── add_email_to_profiles.sql # Email column addition
│   └── fix_*.sql                 # Database fixes
└── public/                       # Static assets
```

## 🗄️ Database Schema

### Tables

- **profiles**: User profiles with personal information and role (admin/staff)
- **medicines**: Medicine inventory with details, quantities, and expiry dates
- **activity_logs**: Audit trail of all user actions

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have elevated permissions
- Secure authentication via Supabase Auth

## 🔐 Authentication

- Email/password authentication
- Automatic email confirmation (bypassed for development)
- Session management with cookies
- Protected routes with server-side authentication checks

## 🎨 Design System

- **Font**: Inter (regular for body, semibold for headings)
- **Colors**: Teal primary, gray neutrals
- **Icons**: Lucide React
- **Animations**: Smooth fade-in, slide-up transitions
- **Spacing**: Consistent padding and margins

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

The app is fully Vercel-ready with:
- ✅ Optimized build configuration
- ✅ Proper environment variable handling
- ✅ Server-side rendering support
- ✅ Static asset optimization

### Supabase Storage Setup

For profile license uploads to work:
1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `licenses`
3. Set bucket to public (or configure RLS policies as needed)

## 🧪 Testing

1. Create a test account via `/signup`
2. Add medicines via `/inventory`
3. Check dashboard statistics
4. Verify activity logs are being created

## 📝 Key Features Implementation

### Recent Updates
- ✅ Inter font implementation for professional appearance
- ✅ Icon-based UI with Lucide React
- ✅ Email field in profiles table
- ✅ Improved authentication flow with cookie-based sessions
- ✅ Removed hover effects for cleaner interface
- ✅ Larger, more readable UI elements
- ✅ Streamlined sidebar (Dashboard & Inventory only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check the database setup guide in `database/README.md`
2. Review Supabase documentation
3. Check Next.js documentation

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- Icons by Lucide
- Font by Google Fonts (Inter)
