# Vercel Deployment Guide

## Quick Setup

1. **Import your repository** in Vercel dashboard
2. **Add Environment Variables** in Vercel project settings:

### Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Where to Find Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Important Notes

- **All three environment variables are required** for the app to work
- After adding env vars, **redeploy** your application
- The build will succeed even without env vars, but the app will show errors at runtime if they're missing
- Make sure to set env vars for **Production**, **Preview**, and **Development** environments if needed

## After Deployment

1. Visit your deployed URL
2. Test signup/login functionality
3. Verify database connections are working
4. Check that medicines can be added/edited/deleted

## Troubleshooting

### Build succeeds but app shows errors
- Check that all environment variables are set correctly
- Verify the Supabase project is active
- Check Vercel function logs for specific errors

### "supabaseUrl is required" error
- Environment variables are not set in Vercel
- Go to Settings → Environment Variables and add them
- Redeploy after adding

### Authentication not working
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase project is not paused
- Verify email confirmation is disabled in Supabase Auth settings

