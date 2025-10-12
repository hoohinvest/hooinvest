# hooinvest Business Onboarding (MVP2)

A companion web application for **hooinvest** that enables businesses to apply for funding, complete due diligence, and publish offerings to the investor marketplace (MVP1).

## Features

### Business User Flow
- **Application Wizard**: Multi-step form for company profile, business details, unit economics, funding terms, and compliance
- **Document Upload**: Secure upload for pitch decks, P&L statements, leases, and other due diligence docs
- **Dashboard**: Track application status and next actions
- **Preview**: See how the offering will appear in the marketplace

### Admin Flow
- **Review Queue**: Manage all applications with filtering by status
- **Application Review**: Detailed review interface with financial metrics, documents, and commenting
- **Decision System**: Approve, reject, or request changes with feedback
- **Publishing**: One-click publish to MVP1 marketplace (creates ASSET + OFFERING records)

### Technical Features
- Next.js 14 with App Router
- Supabase Auth (role-based: business, admin)
- Supabase/Postgres database with RLS
- TypeScript + Tailwind CSS
- Zod validation
- Business metrics calculator
- Unit economics presets for restaurant, retail, and convenience stores

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth
- **Database**: Supabase/Postgres
- **Storage**: Supabase Storage (for documents)
- **Validation**: Zod

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- MVP1 database access (for publishing features)

## Setup Instructions

### 1. Clone and Install

```bash
cd /Users/jhoo/Documents/app1/hooinvest-mvp2
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to provision

#### Run Database Migrations
1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the query
5. (Optional) Run `database/seed.sql` for sample data

#### Create Auth Users
1. In Supabase Dashboard, go to Authentication > Users
2. Create two test users:
   - **Admin**: `admin@hooinvest.com` (password of your choice)
   - **Business**: `business@example.com` (password of your choice)

#### Set User Roles
After creating users, run this in SQL Editor (replace UUIDs with actual user IDs):

```sql
INSERT INTO profiles (user_id, role) VALUES
  ('ADMIN_USER_UUID', 'admin'),
  ('BUSINESS_USER_UUID', 'business');
```

To find user UUIDs:
```sql
SELECT id, email FROM auth.users;
```

#### Configure Storage Bucket
1. Go to Storage in Supabase Dashboard
2. Create a new bucket called `business-docs`
3. Set to Public or configure RLS policies as needed

### 3. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```env
# Get these from: Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3001
MVP1_API_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3001** (runs on port 3001 to avoid conflict with MVP1 on 3000).

## Project Structure

```
hooinvest-mvp2/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── auth/
│   │   └── sign-in/            # Sign-in page
│   ├── dashboard/              # Business dashboard
│   ├── application/            # Application wizard
│   │   └── [id]/preview/       # Preview page
│   ├── docs/                   # Document upload
│   ├── admin/
│   │   ├── review/             # Admin review queue
│   │   │   └── [id]/           # Review detail
│   │   └── publish/[id]/       # Publish interface
│   └── api/                    # API routes
│       ├── application/        # CRUD for applications
│       ├── docs/               # Document management
│       ├── comments/           # Review comments
│       ├── admin/              # Admin operations
│       └── lookup/             # Presets and lookups
├── components/                 # React components
│   └── DashboardLayout.tsx    # Layout wrapper
├── lib/                       # Utilities
│   ├── businessCalc.ts        # Business metrics calculator
│   ├── validations.ts         # Zod schemas
│   ├── utils.ts               # Helper functions
│   └── supabase/              # Supabase clients
├── types/                     # TypeScript types
│   └── index.ts
├── database/                  # Database files
│   ├── schema.sql             # Full schema with RLS
│   └── seed.sql               # Sample data
└── README.md                  # This file
```

## Database Schema

### Core Tables
- `profiles`: User roles (admin, business)
- `business_applications`: Application data
- `business_docs`: Uploaded documents
- `review_comments`: Admin feedback

### MVP1 Integration Tables
- `asset`: Business listings (published)
- `asset_meta`: Additional metadata
- `offering`: Investment terms

See `database/schema.sql` for complete schema with RLS policies.

## Usage Guide

### As a Business User

1. **Sign Up/Sign In** at `/auth/sign-in`
2. **Create Application** at `/application`
   - Step 1: Company profile
   - Step 2: Business details (type, location, stage)
   - Step 3: Unit economics (pre-filled based on type)
   - Step 4: Funding terms (equity or revenue share)
   - Step 5: Compliance attestations
   - Step 6: Review and submit
3. **Upload Documents** at `/docs`
   - Upload required due diligence documents
4. **Track Status** at `/dashboard`
   - Monitor application progress
   - Respond to admin feedback

### As an Admin

1. **Sign In** with admin account
2. **Review Queue** at `/admin/review`
   - Filter by status
   - View all applications
3. **Review Application** at `/admin/review/[id]`
   - View full application details
   - Review financials and documents
   - Add comments
   - Approve, reject, or request changes
4. **Publish** at `/admin/publish/[id]`
   - Review asset mapping
   - Publish to MVP1 marketplace
   - Creates ASSET + OFFERING records

## API Endpoints

### Applications
- `GET /api/application` - List user's applications
- `POST /api/application` - Create/update application
- `GET /api/application/[id]` - Get single application
- `PATCH /api/application/[id]` - Update application

### Documents
- `GET /api/docs?application_id=X` - List documents
- `POST /api/docs` - Upload document

### Admin
- `GET /api/admin/review` - List all applications (admin)
- `POST /api/admin/review/[id]/decision` - Approve/reject
- `POST /api/admin/publish/[id]` - Publish to MVP1

### Lookups
- `GET /api/lookup/presets?type=restaurant` - Get unit economics presets

## Business Calculator

The calculator computes annual metrics based on unit economics:

### Restaurant
- Revenue = seats × turns_per_day × days_open_week × 52 × avg_ticket
- COGS = revenue × cogs_pct
- Labor = revenue × labor_pct
- EBITDA = revenue - COGS - labor - rent - other_opex

### Retail/Convenience
- Revenue = daily_customers × aov × days_per_year
- COGS = revenue × (1 - margin_pct)
- Labor = revenue × labor_pct
- EBITDA = revenue - COGS - labor - fixed_opex

### Metrics
- EBITDA Margin = EBITDA / revenue
- Cash Outlay = capex + working_capital
- Payback Period = cash_outlay / EBITDA
- Simple MOIC = EBITDA / cash_outlay

## Integration with MVP1

When an application is published:

1. Creates an `asset` record:
   - code: BUS-YYYY-XXX
   - name: company_name
   - asset_type: 'business'
   - status: 'raising'

2. Creates `asset_meta` records:
   - unit_econ (full JSON)
   - funding_terms
   - business_type
   - stage

3. Creates an `offering` record:
   - Links to asset
   - Sets target_raise, min/max invest
   - Opens/closes dates
   - status: 'open'

4. Updates application:
   - status → 'published'
   - asset_id → [new asset ID]

The MVP1 app can then query these tables to display offerings in the marketplace.

## Security

- **RLS Policies**: Row-level security on all tables
- **Role-based Access**: Admin vs. Business users
- **Auth Required**: All routes check authentication
- **Supabase Auth**: Industry-standard OAuth2/JWT

## Development

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables

## Testing

### Manual Testing Checklist

**Business Flow:**
- [ ] Sign up as business user
- [ ] Complete application wizard
- [ ] Upload documents
- [ ] Submit application
- [ ] Receive admin feedback
- [ ] Edit and resubmit

**Admin Flow:**
- [ ] Sign in as admin
- [ ] View review queue
- [ ] Review application details
- [ ] Add comments
- [ ] Approve application
- [ ] Publish to marketplace

## Troubleshooting

### "Unauthorized" errors
- Check that user is logged in
- Verify profile row exists with correct role
- Check RLS policies in Supabase

### Documents not uploading
- Verify Supabase Storage bucket exists
- Check bucket permissions/RLS
- Ensure valid URL format

### Application not saving
- Check browser console for validation errors
- Verify all required fields are filled
- Check Supabase connection

## Future Enhancements

- [ ] File upload directly to Supabase Storage (no URL paste)
- [ ] Email notifications for status changes
- [ ] Webhook integration with MVP1
- [ ] Advanced analytics dashboard
- [ ] Bulk approve/reject
- [ ] Application templates
- [ ] KYC/AML verification integration
- [ ] Automated financial analysis
- [ ] Investor matching suggestions

## Support

For questions or issues:
- Check the database logs in Supabase
- Review browser console for errors
- Verify environment variables are set
- Check that Supabase project is running

## License

Proprietary - hooinvest

---

Built with ❤️ for hooinvest MVP2




