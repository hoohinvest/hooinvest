/**
 * SheetsDB Client
 * Reuses the existing SheetsDB API endpoint for Google Sheets integration
 */

// Using the same API endpoint from the existing codebase (script.js)
const SHEETDB_API_URL = process.env.NEXT_PUBLIC_SHEETDB_API_URL || 'https://sheetdb.io/api/v1/czm7s7mm0opth';

export interface SheetsDBRow {
  [key: string]: string | number | boolean | null | undefined;
}

export async function insertRow(data: SheetsDBRow): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(SHEETDB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SheetsDB error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ SheetsDB submission successful');

    return { success: true, data: result };
  } catch (error) {
    console.error('❌ SheetsDB submission error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export function createLeadRow(
  type: 'BUSINESS' | 'INVESTOR',
  formData: any,
  metadata: {
    sourcePath: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    userAgent?: string;
    ipHash?: string;
  }
): SheetsDBRow {
  const baseRow: SheetsDBRow = {
    RecordType: type,
    SubmittedAt: new Date().toISOString(),
    SourcePath: metadata.sourcePath,
    UTM_Source: metadata.utmSource || '',
    UTM_Medium: metadata.utmMedium || '',
    UTM_Campaign: metadata.utmCampaign || '',
    UserAgent: metadata.userAgent || '',
    IP_Hash: metadata.ipHash || '',
    Status: 'NEW',
  };

  if (type === 'BUSINESS') {
    return {
      ...baseRow,
      Business_FullName: formData.fullName || '',
      Business_Email: formData.email || '',
      Business_Phone: formData.phone || '',
      Business_Company: formData.company || '',
      Business_Website: formData.website || '',
      Business_CapitalSeeking: formData.capitalSeeking || '',
      Business_MinInvestment: formData.minInvestment || '',
      Business_MaxInvestors: formData.maxInvestors || '',
      Business_OfferingType: formData.offeringType || '',
      Business_OfferPercentOrRate: formData.offerPercentOrRate || '',
      Business_UseOfFunds: formData.useOfFunds || '',
      Business_TargetCloseDate: formData.targetCloseDate || '',
      Business_Type: formData.businessType || '',
      Business_Years: formData.yearsInOperation || '',
      Business_Location: formData.location || '',
      Business_KeyMetrics: formData.keyMetrics || '',
      Business_DocsLink: formData.docsLink || '',
      Business_Audience: formData.audience || '',
      Business_MarketingConsent: formData.marketingConsent ? 'Yes' : 'No',
      Business_InfoAccurate: formData.infoAccurate ? 'Yes' : 'No',
      // Empty investor columns
      Investor_FullName: '',
      Investor_Email: '',
      Investor_Phone: '',
      Investor_Location: '',
      Investor_Amount: '',
      Investor_ReturnTargetPct: '',
      Investor_RiskTolerance: '',
      Investor_Types: '',
      Investor_Horizon: '',
      Investor_EmailOptIn: '',
      Investor_UnderstandsExpression: '',
    };
  } else {
    return {
      ...baseRow,
      Investor_FullName: formData.fullName || '',
      Investor_Email: formData.email || '',
      Investor_Phone: formData.phone || '',
      Investor_Location: formData.location || '',
      Investor_Amount: formData.investmentAmount || '',
      Investor_ReturnTargetPct: formData.returnTarget || '',
      Investor_RiskTolerance: formData.riskTolerance || '',
      Investor_Types: Array.isArray(formData.businessTypes) ? formData.businessTypes.join(', ') : formData.businessTypes || '',
      Investor_Horizon: formData.investmentHorizon || '',
      Investor_EmailOptIn: formData.emailOptIn ? 'Yes' : 'No',
      Investor_UnderstandsExpression: formData.understandsExpression ? 'Yes' : 'No',
      // Empty business columns
      Business_FullName: '',
      Business_Email: '',
      Business_Phone: '',
      Business_Company: '',
      Business_Website: '',
      Business_CapitalSeeking: '',
      Business_MinInvestment: '',
      Business_MaxInvestors: '',
      Business_OfferingType: '',
      Business_OfferPercentOrRate: '',
      Business_UseOfFunds: '',
      Business_TargetCloseDate: '',
      Business_Type: '',
      Business_Years: '',
      Business_Location: '',
      Business_KeyMetrics: '',
      Business_DocsLink: '',
      Business_Audience: '',
      Business_MarketingConsent: '',
      Business_InfoAccurate: '',
    };
  }
}


