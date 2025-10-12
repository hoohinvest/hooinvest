# Public Leads API - Implementation Summary

## Overview

Created a **new dedicated API endpoint** (`/api/public-leads`) for handling Business and Investor lead submissions from the public website CTAs. This is completely separate from the existing `/api/lead` endpoint and reuses the same SheetsDB infrastructure.

## ✅ What Was Created

### New Files

1. **`/app/api/public-leads/route.ts`** - Main API route handler
   - POST endpoint for Business and Investor leads
   - Validates data, enriches with metadata, submits to Google Sheets
   - Rate limiting, honeypot protection, IP hashing

2. **`/lib/validationPublicLeads.ts`** - Zod validation schemas
   - `businessPublicLeadSchema` - Validates business lead data
   - `investorPublicLeadSchema` - Validates investor lead data
   - `publicLeadPayloadSchema` - Top-level payload wrapper

3. **`/lib/sheetsdbPublic.ts`** - SheetsDB client wrapper
   - `insertPublicLead()` - Inserts row to Google Sheets
   - `createBusinessLeadRow()` - Creates unified row for business
   - `createInvestorLeadRow()` - Creates unified row for investor

4. **`/lib/rateLimitTiny.ts`** - In-memory rate limiter
   - 10 requests per minute per IP
   - Auto-cleanup of expired entries
   - Simple Map-based storage

### Modified Files

1. **`/components/forms/LeadFormBusiness.tsx`**
   - Changed API endpoint from `/api/lead` to `/api/public-leads`

2. **`/components/forms/LeadFormInvestor.tsx`**
   - Changed API endpoint from `/api/lead` to `/api/public-leads`

## 🔒 Guardrails Met

✅ **No existing APIs modified** - `/api/lead` route remains untouched
✅ **No env var changes** - Reuses `NEXT_PUBLIC_SHEETDB_API_URL`
✅ **No database changes** - No schema modifications
✅ **No backend logic changes** - Existing routes unaffected
✅ **Separate endpoint** - New `/api/public-leads` route isolated

## 📊 Google Sheets Schema

### Common Metadata Columns (All Submissions)

| Column | Description | Example |
|--------|-------------|---------|
| `RecordType` | Type of lead | "BUSINESS" or "INVESTOR" |
| `SubmittedAt` | Submission timestamp (ISO) | "2025-10-10T14:30:00Z" |
| `SourcePath` | Page where form was submitted | "/business" or "/investors" |
| `UTM_Source` | UTM source parameter | "facebook" |
| `UTM_Medium` | UTM medium parameter | "cpc" |
| `UTM_Campaign` | UTM campaign parameter | "q4_business" |
| `UserAgent` | Browser user agent | "Mozilla/5.0..." |
| `IP_Hash` | Hashed IP (SHA-256, 16 chars) | "a1b2c3d4e5f6g7h8" |
| `Status` | Lead status | "NEW" |

### Business-Specific Columns (Prefixed `Business_`)

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `Business_FullName` | string | Yes | Contact full name |
| `Business_Email` | string | Yes | Business email |
| `Business_Phone` | string | No | Phone number |
| `Business_Company` | string | Yes | Company/DBA name |
| `Business_Website` | string | No | Website URL |
| `Business_CapitalSeeking` | number | Yes | Amount seeking to raise |
| `Business_MinInvestment` | number | Yes | Minimum investment amount |
| `Business_MaxInvestors` | number | Yes | Maximum number of investors |
| `Business_OfferingType` | enum | Yes | "Equity", "Interest", or "Royalty" |
| `Business_OfferPercentOrRate` | number | Yes | % or rate offered |
| `Business_UseOfFunds` | string | Yes | How funds will be used |
| `Business_TargetCloseDate` | string | No | Target closing date |
| `Business_Type` | string | Yes | Business type category |
| `Business_Years` | number | Yes | Years in operation |
| `Business_Location` | string | Yes | City, State |
| `Business_KeyMetrics` | string | No | Revenue, margins, etc. |
| `Business_DocsLink` | string | No | Supporting docs URL |
| `Business_Audience` | enum | Yes | "Accredited Only" or "Open to All" |
| `Business_ConsentConfirm` | string | Yes | "Yes" or "No" |

### Investor-Specific Columns (Prefixed `Investor_`)

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `Investor_FullName` | string | Yes | Full name |
| `Investor_Email` | string | Yes | Email address |
| `Investor_Phone` | string | No | Phone number |
| `Investor_Location` | string | No | City, State |
| `Investor_Amount` | number | Yes | Investment amount |
| `Investor_ReturnTargetPct` | number | No | Expected return % |
| `Investor_RiskTolerance` | enum | Yes | "Conservative", "Moderate", "Aggressive" |
| `Investor_Types` | string | No | Comma-separated business types |
| `Investor_Horizon` | enum | No | "<1 yr", "1-3 yrs", "3-5 yrs", "5+ yrs" |
| `Investor_EmailOptIn` | string | No | "Yes" or "No" |
| `Investor_ConsentAcknowledge` | string | Yes | "Yes" or "No" |

**Note:** When a Business lead is submitted, all `Investor_*` columns are empty. When an Investor lead is submitted, all `Business_*` columns are empty. This allows easy filtering by `RecordType`.

## 🔧 API Endpoint

### POST `/api/public-leads`

**Request Body:**
```json
{
  "type": "BUSINESS" | "INVESTOR",
  "data": {
    // ... form fields
  }
}
```

**Success Response (201):**
```json
{
  "ok": true,
  "message": "Lead submitted successfully"
}
```

**Validation Error Response (400):**
```json
{
  "ok": false,
  "error": "Validation failed",
  "details": [
    {
      "path": ["fullName"],
      "message": "Full name is required"
    }
  ]
}
```

**Rate Limit Response (429):**
```json
{
  "ok": false,
  "error": "Too many requests. Please try again in a minute."
}
```

**Server Error Response (500):**
```json
{
  "ok": false,
  "error": "Internal server error"
}
```

## 🛡️ Security Features

### 1. Rate Limiting
- **Limit:** 10 requests per minute per IP
- **Window:** 60 seconds rolling window
- **Storage:** In-memory Map (suitable for single instance)
- **Behavior:** Returns 429 when exceeded

### 2. IP Privacy
- **Hashing:** SHA-256 hash of IP address
- **Truncation:** Only first 16 characters stored
- **No Raw IPs:** Raw IP addresses never logged or stored

### 3. Honeypot Protection
- **Field:** `hp_field` (optional in form data)
- **Behavior:** If filled, silently returns 200 but doesn't save
- **Purpose:** Catch bots that auto-fill all fields

### 4. Input Validation
- **Zod schemas:** Strict type checking and validation
- **Email validation:** RFC-compliant email format
- **URL validation:** Valid URLs for website/docs links
- **Numeric coercion:** Safely converts string numbers

## 🌐 Environment Variables

### Existing (Reused)
```bash
NEXT_PUBLIC_SHEETDB_API_URL=https://sheetdb.io/api/v1/czm7s7mm0opth
```

### Optional New Variable
```bash
SHEETSDB_PUBLIC_TABLE=public_leads  # Optional: specific sheet/tab name
```

**Note:** If `SHEETSDB_PUBLIC_TABLE` is not set, leads go to the default table. No changes to existing env vars were made.

## 📝 Usage Examples

### Business Lead Submission

```typescript
const response = await fetch('/api/public-leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'BUSINESS',
    data: {
      fullName: 'John Doe',
      email: 'john@example.com',
      company: 'Example Corp',
      capitalSeeking: 500000,
      minInvestment: 10000,
      maxInvestors: 50,
      offeringType: 'Equity',
      offerPercentOrRate: 10,
      useOfFunds: 'Expand operations and hire staff',
      businessType: 'Restaurant',
      years: 3,
      location: 'San Francisco, CA',
      audience: 'Open to All',
      consentConfirm: true,
    },
  }),
});
```

### Investor Lead Submission

```typescript
const response = await fetch('/api/public-leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'INVESTOR',
    data: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      amount: 50000,
      riskTolerance: 'Moderate',
      types: ['Real Estate', 'Food & Bev', 'Tech'],
      horizon: '3-5 yrs',
      emailOptIn: true,
      consentAcknowledge: true,
    },
  }),
});
```

## 🧪 Testing

### Manual Testing

1. **Business Form:**
   - Go to http://localhost:3001/business
   - Fill out the form
   - Submit
   - Check Google Sheet for new row with `RecordType=BUSINESS`

2. **Investor Form:**
   - Go to http://localhost:3001/investors
   - Fill out the form
   - Submit
   - Check Google Sheet for new row with `RecordType=INVESTOR`

### Verify Filtering

In Google Sheets, you should be able to:
- Filter by `RecordType` column to see only Business or Investor leads
- Filter by `SourcePath` to see which page generated the lead
- Filter by `Status` to manage lead workflow
- Filter by `SubmittedAt` for date ranges

### Rate Limit Testing

1. Submit a form 10 times quickly
2. 11th submission should fail with 429 error
3. Wait 60 seconds
4. Should be able to submit again

## 📁 File Structure

```
hooinvest-mvp2/
├── app/
│   └── api/
│       ├── lead/                    # OLD (untouched)
│       │   └── route.ts
│       └── public-leads/            # NEW
│           └── route.ts
├── components/
│   └── forms/
│       ├── LeadFormBusiness.tsx     # UPDATED (endpoint changed)
│       └── LeadFormInvestor.tsx     # UPDATED (endpoint changed)
├── lib/
│   ├── sheetsdb.ts                  # OLD (untouched)
│   ├── validation.ts                # OLD (untouched)
│   ├── sheetsdbPublic.ts            # NEW
│   ├── validationPublicLeads.ts     # NEW
│   └── rateLimitTiny.ts             # NEW
└── PUBLIC_LEADS_API.md              # NEW (this file)
```

## ✅ Acceptance Criteria

- [x] New `/api/public-leads` endpoint created
- [x] Business lead validation with Zod
- [x] Investor lead validation with Zod
- [x] Rate limiting (10/min per IP)
- [x] IP hashing for privacy
- [x] Honeypot protection
- [x] Metadata enrichment (UTM, source, user agent)
- [x] Unified column schema with prefixes
- [x] Frontend forms updated to use new endpoint
- [x] Old `/api/lead` endpoint untouched
- [x] No env var changes (reuses existing)
- [x] No database schema changes
- [x] Zero linting errors

## 🚀 Deployment Notes

### Production Checklist

1. **Environment Variables:** Verify `NEXT_PUBLIC_SHEETDB_API_URL` is set
2. **Google Sheet:** Ensure sheet has all column headers
3. **Rate Limiting:** Consider Redis for multi-instance deployments
4. **Monitoring:** Set up alerts for 429 and 500 responses

### Optional Enhancements

1. **reCAPTCHA:** Add v3/v2 integration for additional bot protection
2. **Email Notifications:** Send confirmation emails to submitters
3. **Webhook:** Notify team via Slack/email when new lead arrives
4. **Analytics:** Track form conversion rates
5. **A/B Testing:** Test different form layouts

## 🐛 Troubleshooting

### Forms not submitting?
- Check browser console for errors
- Verify `/api/public-leads` endpoint is accessible
- Check validation errors in response

### Data not appearing in Google Sheets?
- Verify `NEXT_PUBLIC_SHEETDB_API_URL` is correct
- Check server logs for SheetsDB errors
- Ensure Google Sheet has proper permissions

### Rate limit too strict?
- Adjust `MAX_REQUESTS` in `/lib/rateLimitTiny.ts`
- Consider different limits for dev vs. production

---

**Implementation Date:** October 10, 2025  
**Status:** ✅ Complete and Production Ready  
**API Endpoint:** `POST /api/public-leads`


