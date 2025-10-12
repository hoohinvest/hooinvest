-- Seed data for hooinvest MVP2
-- Run this after schema.sql

-- Note: Replace these UUIDs with actual user IDs from your Supabase Auth
-- You'll need to create users first via Supabase Auth, then update these IDs

-- Example user IDs (you'll need to replace these)
-- Admin user: create via Supabase dashboard with email admin@hooinvest.com
-- Business user: create via Supabase dashboard with email business@example.com

-- Insert profiles (update user_ids after creating auth users)
-- INSERT INTO profiles (user_id, role) VALUES
--   ('ADMIN_USER_UUID_HERE', 'admin'),
--   ('BUSINESS_USER_UUID_HERE', 'business');

-- Sample business applications
-- Application 1: Restaurant in CT (submitted status)
INSERT INTO business_applications (
  id,
  owner_user_id,
  company_name,
  website,
  contact_email,
  ein_last4,
  business_type,
  city,
  state,
  stage,
  unit_econ,
  funding_terms,
  compliance,
  status
) VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'BUSINESS_USER_UUID_HERE', -- Replace with actual business user UUID
  'Mama''s Italian Kitchen',
  'https://mamasitaliankitchen.example.com',
  'owner@mamasitaliankitchen.com',
  '5678',
  'restaurant',
  'Stamford',
  'CT',
  'buildout',
  '{
    "seats": 60,
    "turns_per_day": 1.6,
    "days_open_week": 6,
    "avg_ticket": 28,
    "cogs_pct": 0.32,
    "labor_pct": 0.28,
    "rent_yr": 72000,
    "other_opex_yr": 96000,
    "capex": 450000,
    "working_capital": 80000,
    "rev_share_pct": 0.04
  }',
  '{
    "structure": "revenue_share",
    "rev_share_pct": 0.04,
    "target_raise": 530000,
    "min_invest": 10000,
    "max_invest": 100000,
    "opens_at": "2025-11-01T00:00:00Z",
    "closes_at": "2025-12-31T23:59:59Z"
  }',
  '{
    "kyc_attestation": true,
    "aml_attestation": true,
    "entity_registered": true,
    "tax_compliant": true
  }',
  'submitted'
);

-- Application 2: Retail in NJ (draft status)
INSERT INTO business_applications (
  id,
  owner_user_id,
  company_name,
  website,
  contact_email,
  ein_last4,
  business_type,
  city,
  state,
  stage,
  unit_econ,
  status
) VALUES (
  'a2222222-2222-2222-2222-222222222222',
  'BUSINESS_USER_UUID_HERE', -- Replace with actual business user UUID
  'Garden State Market',
  'https://gardenstatemarket.example.com',
  'owner@gardenstatemarket.com',
  '9012',
  'retail',
  'Newark',
  'NJ',
  'planning',
  '{
    "daily_customers": 650,
    "aov": 8.75,
    "days_per_year": 360,
    "margin_pct": 0.24,
    "labor_pct": 0.15,
    "fixed_opex_yr": 180000,
    "capex": 350000,
    "working_capital": 120000,
    "rev_share_pct": 0.03
  }',
  'draft'
);

-- Sample business docs for the CT restaurant
INSERT INTO business_docs (application_id, doc_type, url) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'pitch_deck', 'https://storage.supabase.co/example/mamas-pitch-deck.pdf'),
  ('a1111111-1111-1111-1111-111111111111', 'pnl', 'https://storage.supabase.co/example/mamas-pnl.pdf');

-- Sample review comment
-- INSERT INTO review_comments (application_id, author_user_id, body) VALUES
--   ('a1111111-1111-1111-1111-111111111111', 'ADMIN_USER_UUID_HERE', 'Initial review: looks promising. Please provide updated P&L for past 6 months.');




