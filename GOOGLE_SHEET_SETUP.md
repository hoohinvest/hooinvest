# Google Sheet Setup for Public Leads

## 🚨 Important: Sheet Must Have Headers!

Your Google Sheet at `https://sheetdb.io/api/v1/YOUR_SHEET_ID` needs column headers in the **first row** before the API can insert data.

## 📋 Required Column Headers

Copy and paste these headers into **Row 1** of your Google Sheet (in this exact order):

```
RecordType	SubmittedAt	SourcePath	UTM_Source	UTM_Medium	UTM_Campaign	UserAgent	IP_Hash	Status	Business_FullName	Business_Email	Business_Phone	Business_Company	Business_Website	Business_CapitalSeeking	Business_MinInvestment	Business_MaxInvestors	Business_OfferingType	Business_OfferPercentOrRate	Business_UseOfFunds	Business_TargetCloseDate	Business_Type	Business_Years	Business_Location	Business_KeyMetrics	Business_DocsLink	Business_Audience	Business_ConsentConfirm	Investor_FullName	Investor_Email	Investor_Phone	Investor_Location	Investor_Amount	Investor_ReturnTargetPct	Investor_RiskTolerance	Investor_Types	Investor_Horizon	Investor_EmailOptIn	Investor_ConsentAcknowledge
```

## 📝 Step-by-Step Setup

1. **Open your Google Sheet** connected to SheetsDB ID: `2us7uzil3y277`

2. **In Row 1, add these headers** (tab-separated):
   - Copy the headers above
   - Paste into cell A1
   - They should spread across columns A through AM (39 columns total)

3. **Verify Headers:**
   - Column A: `RecordType`
   - Column B: `SubmittedAt`
   - Column C: `SourcePath`
   - Column D: `UTM_Source`
   - ... and so on through Column AM: `Investor_ConsentAcknowledge`

4. **Optional: Format the headers**
   - Bold text
   - Background color (light gray)
   - Freeze the first row (View → Freeze → 1 row)

## 📊 Column Breakdown

### Common Metadata (Columns A-I)
1. RecordType
2. SubmittedAt
3. SourcePath
4. UTM_Source
5. UTM_Medium
6. UTM_Campaign
7. UserAgent
8. IP_Hash
9. Status

### Business Fields (Columns J-AA)
10. Business_FullName
11. Business_Email
12. Business_Phone
13. Business_Company
14. Business_Website
15. Business_CapitalSeeking
16. Business_MinInvestment
17. Business_MaxInvestors
18. Business_OfferingType
19. Business_OfferPercentOrRate
20. Business_UseOfFunds
21. Business_TargetCloseDate
22. Business_Type
23. Business_Years
24. Business_Location
25. Business_KeyMetrics
26. Business_DocsLink
27. Business_Audience
28. Business_ConsentConfirm

### Investor Fields (Columns AB-AM)
29. Investor_FullName
30. Investor_Email
31. Investor_Phone
32. Investor_Location
33. Investor_Amount
34. Investor_ReturnTargetPct
35. Investor_RiskTolerance
36. Investor_Types
37. Investor_Horizon
38. Investor_EmailOptIn
39. Investor_ConsentAcknowledge

## ✅ After Setup

Once headers are added:
1. Test the Business form at http://localhost:3001/business
2. Submit a test lead
3. Check Row 2 of your Google Sheet - it should have:
   - `RecordType` = "BUSINESS"
   - All Business_* fields filled
   - All Investor_* fields empty

4. Test the Investor form at http://localhost:3001/investors
5. Submit a test lead
6. Check next row - should have:
   - `RecordType` = "INVESTOR"
   - All Investor_* fields filled
   - All Business_* fields empty

## 🔍 Filtering & Sorting

Once you have data, you can:
- **Filter by RecordType** to see only Business or Investor leads
- **Filter by Status** to manage workflow (NEW, CONTACTED, QUALIFIED, etc.)
- **Filter by SourcePath** to see which page generated the lead
- **Sort by SubmittedAt** to see newest leads first

## 📧 Email Notifications (Optional)

Set up Google Sheets notifications:
1. Tools → Notification rules
2. "Notify me when... Any changes are made"
3. Get email alerts for new lead submissions

---

**Important:** The first row MUST have these exact column names for SheetsDB to work!


