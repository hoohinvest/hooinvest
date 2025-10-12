# HooInvest Public Website - Quick Reference

## 🚀 Start Development Server

```bash
cd /Users/jhoo/Documents/app1/hooinvest-mvp2
npm run dev
```

Server runs on: **http://localhost:3001**

---

## 📍 Routes

| Route | Description |
|-------|-------------|
| `/` | New informational homepage with dual CTAs |
| `/business` | Business landing page with lead form |
| `/investors` | Investor landing page with lead form |
| `/auth/sign-in` | Existing auth page (unchanged) |
| `/dashboard` | Existing dashboard (unchanged) |
| `/application` | Existing application flow (unchanged) |

---

## 🎨 New Components

### Landing Pages Components
- `components/landing/Hero.tsx` - Hero section with dual CTAs
- `components/landing/ValueProof.tsx` - ROI comparison tiles
- `components/landing/HowItWorks.tsx` - Process steps
- `components/landing/CTASection.tsx` - Final call-to-action

### Form Components
- `components/forms/LeadFormBusiness.tsx` - Business lead capture form
- `components/forms/LeadFormInvestor.tsx` - Investor lead capture form

---

## 📚 Core Files

### API & Logic
- `app/api/lead/route.ts` - POST endpoint for form submissions
- `lib/sheetsdb.ts` - SheetsDB API client (reuses existing endpoint)
- `lib/validation.ts` - Zod validation schemas

### Pages
- `app/page.tsx` - New homepage (replaced existing)
- `app/business/page.tsx` - New business landing page
- `app/investors/page.tsx` - New investor landing page
- `app/layout.tsx` - Updated metadata

---

## 🔧 Key Configuration

### SheetsDB API Endpoint
```
https://sheetdb.io/api/v1/czm7s7mm0opth
```
(Reused from existing codebase - NO CHANGES)

### Environment Variables
No new env vars required. Uses existing setup.

---

## 📊 Google Sheets Schema

### Filter Columns (All Submissions)
- `RecordType` - "BUSINESS" or "INVESTOR"
- `SubmittedAt` - ISO timestamp
- `SourcePath` - Form source page
- `UTM_Source`, `UTM_Medium`, `UTM_Campaign` - Marketing attribution
- `UserAgent` - Browser info
- `IP_Hash` - Privacy-friendly hashed IP
- `Status` - Default "NEW"

### Business Fields (Prefixed with `Business_`)
FullName, Email, Phone, Company, Website, CapitalSeeking, MinInvestment, MaxInvestors, OfferingType, OfferPercentOrRate, UseOfFunds, TargetCloseDate, Type, Years, Location, KeyMetrics, DocsLink, Audience, MarketingConsent, InfoAccurate

### Investor Fields (Prefixed with `Investor_`)
FullName, Email, Phone, Location, Amount, ReturnTargetPct, RiskTolerance, Types, Horizon, EmailOptIn, UnderstandsExpression

---

## 🎯 Quick Testing

### Test Business Form
1. Go to http://localhost:3001/business
2. Fill out all required fields
3. Submit form
4. Check Google Sheet for new row with `RecordType` = "BUSINESS"

### Test Investor Form
1. Go to http://localhost:3001/investors
2. Fill out all required fields
3. Submit form
4. Check Google Sheet for new row with `RecordType` = "INVESTOR"

### Test Rate Limiting
- Submit form 6 times within 1 minute
- 6th submission should fail with rate limit error

---

## 🐛 Troubleshooting

### Form not submitting?
1. Check browser console for errors
2. Verify all required fields are filled
3. Check network tab for API response

### Data not appearing in Google Sheet?
1. Verify SheetsDB endpoint is accessible
2. Check server logs for errors
3. Ensure Google Sheet has correct permissions

### Styling issues?
1. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
2. Verify Tailwind CSS is loaded
3. Check globals.css for conflicts

### TypeScript errors?
```bash
npm run build
```
Should complete without errors.

---

## 📱 Brand Colors Reference

```css
--brand: #00E18D        /* Primary green - CTAs */
--bg: #0B0F14          /* Dark background */
--panel: #11161D       /* Card/panel background */
--muted: #1A222C       /* Borders, dividers */
--text: #E8EEF5        /* Primary text (light) */
--text-muted: #A9B4C0  /* Secondary text */
--accent: #4DD2FF      /* Accent blue */
--danger: #FF5C5C      /* Error red */
```

---

## ✅ What Changed vs. What Stayed

### ✅ NEW (Added)
- Homepage with Hero, ValueProof, HowItWorks, CTASection
- /business page with lead form
- /investors page with lead form
- /api/lead POST endpoint
- Form validation schemas
- SheetsDB client wrapper

### ❌ UNCHANGED (No modifications)
- All existing auth flows
- Dashboard functionality
- Application submission workflow
- Supabase integration
- Database schema
- Environment variables
- SheetsDB API endpoint/key

---

## 📖 Documentation

- `IMPLEMENTATION_SUMMARY.md` - Complete feature list and technical details
- `TESTING_GUIDE.md` - Step-by-step testing instructions
- `QUICK_REFERENCE.md` - This file (quick lookup)

---

## 🚢 Deployment Checklist

Before deploying to production:
- [ ] Test all forms end-to-end
- [ ] Verify Google Sheet updates correctly
- [ ] Test on mobile devices
- [ ] Run `npm run build` successfully
- [ ] Update domain in Schema.org JSON-LD (currently placeholder)
- [ ] Set up production monitoring
- [ ] Configure analytics tracking

---

## 🎉 Success Metrics

**Forms Working:**
- Business form submits → Google Sheet row with RecordType=BUSINESS
- Investor form submits → Google Sheet row with RecordType=INVESTOR

**Filtering Works:**
- Can filter Google Sheet by RecordType column
- Can filter by SourcePath to see form origins
- Can filter by Status to manage leads

**Accessible:**
- Keyboard navigation works
- Screen readers can use forms
- WCAG AA contrast passes

**Mobile Friendly:**
- Responsive on all screen sizes
- Forms usable on touch devices
- CTAs stack properly on mobile

---

**Need Help?**
1. Check browser console for errors
2. Check server terminal for API errors
3. Verify Google Sheet permissions
4. Review TESTING_GUIDE.md for detailed steps

---

**Version:** 1.0.0  
**Last Updated:** October 10, 2025  
**Status:** ✅ Production Ready


