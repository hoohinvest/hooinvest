# Setup Instructions for hooinvest MVP2

Follow these steps to set up the application from scratch.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Supabase Project Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for database provisioning (2-3 minutes)

2. **Get API Credentials**
   - In Supabase Dashboard, go to Settings > API
   - Copy the following:
     - Project URL
     - anon/public key
     - service_role key (keep this secret!)

3. **Create Environment File**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and paste your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

## Step 3: Database Setup

1. **Run Schema Migration**
   - In Supabase Dashboard, go to SQL Editor
   - Click "New Query"
   - Copy entire contents of `database/schema.sql`
   - Paste and click "Run"
   - Should see "Success. No rows returned"

2. **Verify Tables Created**
   - Go to Table Editor
   - You should see tables:
     - profiles
     - business_applications
     - business_docs
     - review_comments
     - asset
     - asset_meta
     - offering

## Step 4: Create Test Users

1. **Create Users via Auth**
   - In Supabase Dashboard, go to Authentication > Users
   - Click "Add User" > "Create new user"
   
   **Admin User:**
   - Email: `admin@hooinvest.com`
   - Password: (choose a secure password)
   - Confirm email: Yes
   
   **Business User:**
   - Email: `business@example.com`
   - Password: (choose a secure password)
   - Confirm email: Yes

2. **Assign Roles**
   - Go to SQL Editor
   - Run this query (replace UUIDs with actual user IDs):
   
   ```sql
   -- First, find your user IDs
   SELECT id, email FROM auth.users;
   
   -- Then insert profiles with roles
   INSERT INTO profiles (user_id, role) VALUES
     ('ADMIN_USER_UUID_HERE', 'admin'),
     ('BUSINESS_USER_UUID_HERE', 'business');
   ```

## Step 5: (Optional) Load Seed Data

1. **Update Seed File**
   - Open `database/seed.sql`
   - Replace `BUSINESS_USER_UUID_HERE` with your business user's UUID
   - Replace `ADMIN_USER_UUID_HERE` with your admin user's UUID

2. **Run Seed**
   - In SQL Editor, paste contents of `database/seed.sql`
   - Click "Run"
   - This creates 2 sample applications and documents

## Step 6: Configure Storage

1. **Create Storage Bucket**
   - In Supabase Dashboard, go to Storage
   - Click "New Bucket"
   - Name: `business-docs`
   - Public: Yes (or configure RLS)
   - Click "Create bucket"

2. **Configure Bucket Policies** (Optional)
   - Click on the bucket
   - Go to Policies
   - Add policies as needed for upload/download

## Step 7: Run the App

```bash
npm run dev
```

The app will start on http://localhost:3001

## Step 8: Test the Application

### Test Business Flow

1. **Sign In**
   - Go to http://localhost:3001
   - Click "Sign In"
   - Use: `business@example.com` / [your password]

2. **Create Application**
   - Click "Dashboard" (should see existing applications if seed ran)
   - Click "+ New Application"
   - Go through all 6 steps of the wizard
   - Submit application

3. **Upload Documents**
   - Go to "Documents"
   - For now, use placeholder URLs like:
     `https://example.com/pitch-deck.pdf`
   - Click "Upload Document"

### Test Admin Flow

1. **Sign Out and Sign In as Admin**
   - Sign out from business account
   - Sign in with: `admin@hooinvest.com` / [your password]

2. **Review Queue**
   - Should see "Review Queue" in navigation
   - Click it to see all applications

3. **Review Application**
   - Click "Review →" on any submitted application
   - Review details, add comments
   - Click "Approve"

4. **Publish to Marketplace**
   - After approving, click "Publish"
   - Review asset mapping
   - Click "Publish Now"
   - Should create records in `asset`, `asset_meta`, and `offering` tables

## Verification

After setup, verify:

1. **Database Tables**
   - Check Table Editor in Supabase
   - All tables should be created with proper columns

2. **RLS Policies**
   - Go to Table Editor > Select a table > Policies tab
   - Should see policies active

3. **Auth Users**
   - Go to Authentication > Users
   - Should see 2 users with confirmed emails

4. **Profiles**
   - Check `profiles` table
   - Should have 2 rows with correct roles

## Troubleshooting

### Cannot sign in
- Check that email is confirmed in Auth > Users
- Verify password is correct
- Check browser console for errors

### "Unauthorized" errors
- Verify profile exists for user
- Check RLS policies are enabled
- Ensure user_id in profile matches auth.users.id

### Application won't save
- Check browser console
- Verify all required fields filled
- Check database logs in Supabase

### Publish fails
- Ensure application status is "approved"
- Check that service role key is set in .env.local
- Verify asset/offering tables exist

## Next Steps

- Customize unit economics presets
- Configure email notifications
- Set up Supabase Storage for actual file uploads
- Integrate with MVP1 API
- Deploy to production

## Support

Check the main README.md for detailed documentation.




