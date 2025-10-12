# HooInvest Public Website - Testing Guide

## Quick Start

The development server should already be running on **http://localhost:3001**

If not, start it with:
```bash
cd /Users/jhoo/Documents/app1/hooinvest-mvp2
npm run dev
```

## Testing Checklist

### 1. Homepage Testing (/)

**URL:** http://localhost:3001

- [ ] Page loads with dark theme
- [ ] Hero shows: "Invest in Real Businesses. Own Real Results."
- [ ] Two CTAs visible: "I'm a Business" and "I'm an Investor"
- [ ] ValueProof section shows ROI comparison (4-5%, 7-10%, 8-12%)
- [ ] Disclaimer text present below comparison
- [ ] "How It Works" section shows steps for both audiences
- [ ] Final CTA section with trust badges
- [ ] Footer with links renders correctly
- [ ] Header navigation sticky on scroll
- [ ] Mobile responsive (resize browser)

**Test Actions:**
1. Click "I'm a Business – Raise Capital" → Should redirect to `/business`
2. Click "I'm an Investor – Explore Deals" → Should redirect to `/investors`
3. Test keyboard navigation (Tab through all focusable elements)
4. Check contrast in dev tools (should pass WCAG AA)

---

### 2. Business Page Testing (/business)

**URL:** http://localhost:3001/business

- [ ] Page loads with "Raise Capital on Your Terms" headline
- [ ] Benefits grid shows 6 tiles
- [ ] Form is visible and properly styled
- [ ] All form sections render: Contact Info, Raise Details, Business Profile, Compliance

**Form Testing:**

#### Test 1: Validation Errors
1. Click "Submit Application" without filling anything
2. Verify error messages appear for all required fields
3. Errors should be in red text below each field

#### Test 2: Conditional Validation
1. Fill out basic info (name, email, company)
2. Select "Equity" as offering type
3. Verify "% Equity Offered" label updates
4. Leave it empty and submit → should show error
5. Try with "Interest (Debt)" → label should change to "Interest Rate (%)"
6. Try with "Royalty" → label should change to "Royalty % Offered"

#### Test 3: Successful Submission
Fill out the form completely:
- **Full Name:** Test Business Owner
- **Business Email:** business@test.com
- **Phone:** (555) 123-4567
- **Company:** Test Restaurant LLC
- **Website:** https://testrestaurant.com
- **Capital Seeking:** 250000
- **Min Investment:** 5000
- **Max Investors:** 50
- **Offering Type:** Equity
- **% Equity Offered:** 10
- **Use of Funds:** "Expand kitchen, hire staff, marketing campaign"
- **Target Close Date:** (any future date)
- **Business Type:** Restaurant
- **Years in Operation:** 3
- **Location:** San Francisco, CA
- **Key Metrics:** "Annual revenue $500K, 15% net margin"
- **Docs Link:** https://dropbox.com/docs
- **Investor Audience:** Open to All
- **Check:** I confirm information is accurate
- **Check (optional):** Marketing consent

**Expected Result:**
1. Form submits (shows loading spinner)
2. Success message appears: "Application Received!"
3. Green checkmark and thank you text visible

**Verify in Google Sheets:**
1. Open the Google Sheet connected to SheetsDB
2. Find new row with:
   - `RecordType` = "BUSINESS"
   - `SubmittedAt` = current timestamp
   - `SourcePath` = "/business"
   - `Business_FullName` = "Test Business Owner"
   - `Business_Email` = "business@test.com"
   - `Business_Company` = "Test Restaurant LLC"
   - All other business fields populated
   - Investor fields = empty
   - `Status` = "NEW"

---

### 3. Investors Page Testing (/investors)

**URL:** http://localhost:3001/investors

- [ ] Page loads with "Invest Beyond Stocks" headline
- [ ] Benefits grid shows 6 tiles
- [ ] Form is visible and properly styled
- [ ] All form sections render: Contact Info, Investment Profile, Preferences

**Form Testing:**

#### Test 1: Validation Errors
1. Click "Express Interest to Invest" without filling anything
2. Verify error messages for required fields
3. Try submitting without checking business types → should show error

#### Test 2: Multi-Select Business Types
1. Click multiple checkboxes (e.g., Real Estate, Food & Bev, Tech)
2. Verify multiple can be selected
3. Error should clear when at least one is selected

#### Test 3: Successful Submission
Fill out the form completely:
- **Full Name:** Test Investor
- **Email:** investor@test.com
- **Phone:** (555) 987-6543
- **City, State:** New York, NY
- **Investment Amount:** 50000
- **Expected Return Target:** 12
- **Risk Tolerance:** Moderate
- **Business Types:** Check "Real Estate", "Food & Bev", "Retail"
- **Investment Horizon:** 3-5 yrs
- **Check:** I understand this is an expression of interest
- **Check (optional):** Email me curated offerings

**Expected Result:**
1. Form submits (shows loading spinner)
2. Success message appears: "Interest Received!"
3. Green checkmark and thank you text visible

**Verify in Google Sheets:**
1. Open the Google Sheet
2. Find new row with:
   - `RecordType` = "INVESTOR"
   - `SubmittedAt` = current timestamp
   - `SourcePath` = "/investors"
   - `Investor_FullName` = "Test Investor"
   - `Investor_Email` = "investor@test.com"
   - `Investor_Amount` = 50000
   - `Investor_RiskTolerance` = "Moderate"
   - `Investor_Types` = "Real Estate, Food & Bev, Retail"
   - Business fields = empty
   - `Status` = "NEW"

---

### 4. Accessibility Testing

#### Keyboard Navigation
1. Use only Tab, Shift+Tab, Enter, Space keys
2. Verify all interactive elements are focusable
3. Focus indicator should be visible (ring outline)
4. Forms should submit with Enter key

#### Screen Reader Testing (Optional)
If you have VoiceOver (Mac) or NVSR (Windows):
1. Enable screen reader
2. Navigate through forms
3. Verify labels are read correctly
4. Verify error messages are announced

#### Contrast Testing
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run Accessibility audit
4. Verify contrast ratios pass WCAG AA

---

### 5. Mobile Responsive Testing

#### Desktop → Mobile
1. Resize browser width from 1920px down to 375px
2. Verify layout adapts smoothly
3. Check breakpoints at: 1024px (tablet), 768px (mobile), 375px (small mobile)

**Expected Behavior:**
- CTAs stack vertically on mobile
- Grid layouts collapse to single column
- Navigation items may hide on mobile
- Forms remain usable and inputs are tap-friendly

#### Device Testing
Test on actual devices if available:
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)

---

### 6. Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

All features should work identically.

---

### 7. Rate Limiting Testing

**Test Rate Limit (5 submissions per minute):**
1. Submit a form successfully
2. Immediately submit again 4 more times
3. On 6th submission within 1 minute, should get error: "Too many submissions. Please try again later."
4. Wait 1 minute
5. Should be able to submit again

---

### 8. Error Handling Testing

#### Network Error Simulation
1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Try submitting a form
4. Should show error message (not crash)

#### Invalid Data
1. Enter invalid email: "notanemail"
2. Should show validation error
3. Enter negative numbers in amount fields
4. Should show validation error

---

### 9. UTM Parameter Tracking

**Test UTM Capture:**
1. Visit: http://localhost:3001/business?utm_source=facebook&utm_medium=cpc&utm_campaign=q4_business
2. Fill out and submit the business form
3. Check Google Sheet
4. Verify row contains:
   - `UTM_Source` = "facebook"
   - `UTM_Medium` = "cpc"
   - `UTM_Campaign` = "q4_business"

---

### 10. SEO Verification

#### Meta Tags
1. View page source (Ctrl+U or Cmd+U)
2. Verify `<title>` tag is present and descriptive
3. Verify `<meta name="description">` is present
4. Verify OpenGraph tags on homepage

#### Structured Data
1. On homepage, view source
2. Find `<script type="application/ld+json">`
3. Verify Organization schema is present
4. Copy JSON and validate at https://validator.schema.org/

---

## Common Issues & Troubleshooting

### Form Not Submitting
1. Check browser console for errors
2. Verify SheetsDB API is accessible: `https://sheetdb.io/api/v1/czm7s7mm0opth`
3. Check Network tab to see API response

### Validation Not Working
1. Verify all required fields have values
2. Check specific validation rules (email format, positive numbers, etc.)
3. Conditional fields (offer percent) require offering type to be selected first

### Google Sheet Not Updating
1. Verify SheetsDB API endpoint is correct
2. Check if sheet has correct permissions
3. Verify no CORS errors in browser console
4. Check server logs for errors

### Styling Issues
1. Verify Tailwind CSS is loaded (inspect element, check classes)
2. Clear browser cache and hard reload (Cmd+Shift+R / Ctrl+Shift+R)
3. Check globals.css for custom styles

---

## Performance Checklist

- [ ] Homepage loads in < 2 seconds
- [ ] Forms are interactive immediately (no hydration delay)
- [ ] No console errors or warnings
- [ ] Images load properly (if any added)
- [ ] Smooth scrolling and animations

---

## Sign-Off Criteria

Before considering testing complete, verify:

✅ Both forms submit successfully and data appears in Google Sheet
✅ RecordType column allows easy filtering of Business vs Investor
✅ All required validation works correctly
✅ Success messages display after submission
✅ Mobile responsive layout works on small screens
✅ Keyboard navigation works throughout
✅ No console errors in browser
✅ Rate limiting prevents abuse
✅ UTM parameters are captured

---

## Next Steps After Testing

1. **Production Deployment**
   - Update NEXT_PUBLIC_SHEETDB_API_URL if needed
   - Deploy to Vercel/Netlify
   - Test on production domain

2. **Monitor Google Sheet**
   - Set up notifications for new submissions
   - Create filters for Business vs Investor leads
   - Assign leads to sales team

3. **Analytics Setup**
   - Add Google Analytics tracking code
   - Set up conversion goals for form submissions
   - Track CTA click-through rates

4. **Marketing Launch**
   - Share /business link with business owners
   - Share /investors link with investors
   - Run paid campaigns with UTM parameters

---

**Testing Started:** _________  
**Testing Completed:** _________  
**Tester Name:** _________  
**Sign-Off:** _________


