-- hooinvest MVP2 Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'business')) DEFAULT 'business',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Applications
CREATE TABLE IF NOT EXISTS business_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  website TEXT,
  contact_email TEXT NOT NULL,
  ein_last4 TEXT,
  business_type TEXT CHECK (business_type IN ('restaurant', 'retail', 'convenience', 'other')),
  city TEXT,
  state TEXT,
  stage TEXT CHECK (stage IN ('planning', 'raising', 'buildout', 'operating')),
  unit_econ JSONB,
  funding_terms JSONB,
  compliance JSONB,
  status TEXT CHECK (status IN ('draft', 'submitted', 'in_review', 'needs_changes', 'approved', 'rejected', 'published')) DEFAULT 'draft',
  asset_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Documents
CREATE TABLE IF NOT EXISTS business_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES business_applications(id) ON DELETE CASCADE,
  doc_type TEXT CHECK (doc_type IN ('pitch_deck', 'pnl', 'lease', 'bank_stmt', 'permit')),
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review Comments
CREATE TABLE IF NOT EXISTS review_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES business_applications(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets (unified model matching MVP1)
CREATE TABLE IF NOT EXISTS asset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  asset_type TEXT CHECK (asset_type IN ('business', 'project')) DEFAULT 'business',
  status TEXT NOT NULL,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Metadata
CREATE TABLE IF NOT EXISTS asset_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offerings
CREATE TABLE IF NOT EXISTS offering (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  round_type TEXT,
  target_raise NUMERIC NOT NULL,
  min_invest NUMERIC NOT NULL,
  max_invest NUMERIC NOT NULL,
  opens_at TIMESTAMPTZ,
  closes_at TIMESTAMPTZ,
  jurisdiction TEXT,
  status TEXT CHECK (status IN ('draft', 'open', 'closed')) DEFAULT 'draft'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_business_applications_owner ON business_applications(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_business_applications_status ON business_applications(status);
CREATE INDEX IF NOT EXISTS idx_business_docs_application ON business_docs(application_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_application ON review_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_asset_code ON asset(code);
CREATE INDEX IF NOT EXISTS idx_asset_meta_asset ON asset_meta(asset_id);
CREATE INDEX IF NOT EXISTS idx_offering_asset ON offering(asset_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE offering ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for business_applications
CREATE POLICY "Business users can view own applications"
  ON business_applications FOR SELECT
  USING (
    auth.uid() = owner_user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Business users can create applications"
  ON business_applications FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Business users can update own draft/needs_changes applications"
  ON business_applications FOR UPDATE
  USING (
    (auth.uid() = owner_user_id AND status IN ('draft', 'needs_changes'))
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for business_docs
CREATE POLICY "Users can view docs for accessible applications"
  ON business_docs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_applications 
      WHERE id = business_docs.application_id 
      AND (owner_user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "Business users can upload docs for own applications"
  ON business_docs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_applications 
      WHERE id = business_docs.application_id 
      AND owner_user_id = auth.uid()
    )
  );

-- RLS Policies for review_comments
CREATE POLICY "Users can view comments for accessible applications"
  ON review_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_applications 
      WHERE id = review_comments.application_id 
      AND (owner_user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "Admin users can create comments"
  ON review_comments FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for asset, asset_meta, offering (public read for MVP1 integration)
CREATE POLICY "Anyone can view published assets"
  ON asset FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage assets"
  ON asset FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can view asset meta"
  ON asset_meta FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage asset meta"
  ON asset_meta FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can view offerings"
  ON offering FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage offerings"
  ON offering FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_business_applications_updated_at
  BEFORE UPDATE ON business_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_updated_at
  BEFORE UPDATE ON asset
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

