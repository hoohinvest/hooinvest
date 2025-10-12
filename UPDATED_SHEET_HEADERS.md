# Updated Google Sheets Headers

## NEW Columns Added (2025-10-12)

We've added **"How did you hear about us?"** tracking to both Business and Investor forms.

### New Columns to Add to Your Google Sheet

Add these **4 new columns** to your existing sheet (after the last column):

1. **Business_HearAbout** - Source channel for business leads
2. **Business_HearAboutOther** - Free text when "Other" is selected (business)
3. **Investor_HearAbout** - Source channel for investor leads
4. **Investor_HearAboutOther** - Free text when "Other" is selected (investor)

### How to Update Your Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID
2. Add these 4 column headers to the RIGHT of the last existing column
3. That's it! New submissions will populate these fields automatically.

### Complete Header List (Updated)

Copy this entire row into your Google Sheet's first row (replaces the old header):

```
RecordType	SubmittedAt	SourcePath	UTM_Source	UTM_Medium	UTM_Campaign	UserAgent	IP_Hash	Status	Business_FullName	Business_Email	Business_Phone	Business_Company	Business_Website	Business_CapitalSeeking	Business_MinInvestment	Business_MaxInvestors	Business_OfferingType	Business_OfferPercentOrRate	Business_UseOfFunds	Business_TargetCloseDate	Business_Type	Business_Years	Business_Location	Business_KeyMetrics	Business_DocsLink	Business_Audience	Business_ConsentConfirm	Business_HearAbout	Business_HearAboutOther	Investor_FullName	Investor_Email	Investor_Phone	Investor_Location	Investor_Amount	Investor_ReturnTargetPct	Investor_RiskTolerance	Investor_Types	Investor_Horizon	Investor_EmailOptIn	Investor_ConsentAcknowledge	Investor_HearAbout	Investor_HearAboutOther
```

### Possible Values for HearAbout Fields

- Instagram
- TikTok
- YouTube
- LinkedIn
- Twitter/X
- Facebook
- Google Search
- Friend / Family
- Coworker / Professional Referral
- Event / Conference
- Press / Media
- Other (will have text in the "HearAboutOther" field)

### Why This Helps

This complements the UTM tracking by capturing **user-declared** source attribution:
- UTM tracks the technical referrer (URL parameters)
- "How did you hear about us?" tracks the user's perception of where they found you
- Together, they give you complete attribution data for marketing ROI

---

**Updated:** October 12, 2025  
**Applies to:** https://sheetdb.io/api/v1/2us7uzil3y277

