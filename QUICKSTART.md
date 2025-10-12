# hooinvest MVP2 - Quick Start Guide

Get up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier is fine)

## Quick Setup

### 1. Install Dependencies (1 min)

```bash
cd /Users/jhoo/Documents/app1/hooinvest-mvp2
npm install
```

### 2. Create Supabase Project (3 min)

1. Go to https://supabase.com → New Project
2. Wait for provisioning
3. Go to Settings → API
4. Copy Project URL and API keys

### 3. Configure Environment (1 min)

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials.

### 4. Setup Database (2 min)

1. In Supabase Dashboard → SQL Editor
2. Copy/paste contents of `database/schema.sql`
3. Click Run

### 5. Create Users (2 min)

In Supabase Dashboard → Authentication → Users:

**Create Admin User:**
- Email: `admin@hooinvest.com`
- Password: `admin123` (change this!)
- Auto Confirm: Yes

**Create Business User:**
- Email: `business@example.com`  
- Password: `business123` (change this!)
- Auto Confirm: Yes

**Assign Roles:**

In SQL Editor, find user IDs:
```sql
SELECT id, email FROM auth.users;
```

Then assign roles:
```sql
INSERT INTO profiles (user_id, role) VALUES
  ('ADMIN_USER_ID', 'admin'),
  ('BUSINESS_USER_ID', 'business');
```

### 6. Run the App (1 min)

```bash
npm run dev
```

Open http://localhost:3001

## Quick Test

### Business User Flow
1. Sign in as `business@example.com`
2. Click "Dashboard" → "+ New Application"
3. Complete the wizard (all 6 steps)
4. Submit application

### Admin User Flow
1. Sign out, sign in as `admin@hooinvest.com`
2. Click "Review Queue"
3. Click "Review" on the submitted application
4. Add a comment and click "Approve"
5. Click "Publish" button
6. Confirm publication

## What's Created

After publishing, check your Supabase database:
- `asset` table: New business listing
- `asset_meta` table: Business details
- `offering` table: Investment terms
- `business_applications` table: Updated status to 'published'

## Ports

- **MVP2** (this app): http://localhost:3001
- **MVP1** (investor app): http://localhost:3000

Both can run simultaneously!

## Troubleshooting

**Can't sign in?**
- Check user exists in Supabase Auth
- Verify email is confirmed
- Check browser console

**"Unauthorized" errors?**
- Make sure profile exists with role
- Check .env.local has correct keys

**Application won't save?**
- Fill all required fields (marked with *)
- Check browser console for validation errors

## Next Steps

1. Read full `README.md` for detailed docs
2. Check `scripts/setup-instructions.md` for advanced setup
3. Customize unit economics presets in `lib/businessCalc.ts`
4. Configure Supabase Storage for document uploads
5. Deploy to production (Vercel recommended)

## Features Tour

### Business Dashboard
- View all applications
- Track status and next actions
- Quick stats

### Application Wizard
- 6-step guided form
- Auto-filled unit economics by business type
- Real-time validation
- Save as draft anytime

### Document Upload
- Upload required docs
- Track uploads by application
- Supports multiple doc types

### Admin Review
- Filter by status
- Detailed review interface
- Commenting system
- One-click decisions

### Publishing
- Preview asset mapping
- See how it appears in MVP1
- One-click publish
- Creates all required records

## Demo Credentials

**Admin:**
- Email: `admin@hooinvest.com`
- Password: `admin123`

**Business:**
- Email: `business@example.com`
- Password: `business123`

**⚠️ Change these passwords in production!**

## Support

- Full docs: `README.md`
- Setup guide: `scripts/setup-instructions.md`
- Database schema: `database/schema.sql`

---

Built for hooinvest 🚀




