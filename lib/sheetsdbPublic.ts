/**
 * SheetsDB Public Client for CTA Lead Submissions
 * 
 * Reuses existing environment variables:
 * - NEXT_PUBLIC_SHEETDB_API_URL (or falls back to hardcoded endpoint)
 * - SHEETSDB_PUBLIC_TABLE (optional - for separate tab/sheet)
 */

// Public leads SheetsDB API endpoint
const SHEETDB_API_URL = process.env.NEXT_PUBLIC_SHEETDB_PUBLIC_API_URL || 'https://sheetdb.io/api/v1/2us7uzil3y277';
const SHEETDB_PUBLIC_TABLE = process.env.SHEETSDB_PUBLIC_TABLE; // Optional: specific table/sheet name

export interface PublicLeadRow {
  // Common metadata columns
  RecordType: 'BUSINESS' | 'INVESTOR';
  SubmittedAt: string;
  SourcePath: string;
  UTM_Source?: string;
  UTM_Medium?: string;
  UTM_Campaign?: string;
  UserAgent?: string;
  IP_Hash: string;
  Status: string;

  // Business columns (prefixed)
  Business_FullName?: string;
  Business_Email?: string;
  Business_Phone?: string;
  Business_Company?: string;
  Business_Website?: string;
  Business_CapitalSeeking?: number | string;
  Business_MinInvestment?: number | string;
  Business_MaxInvestors?: number | string;
  Business_OfferingType?: string;
  Business_OfferPercentOrRate?: number | string;
  Business_UseOfFunds?: string;
  Business_TargetCloseDate?: string;
  Business_Type?: string;
  Business_Years?: number | string;
  Business_Location?: string;
  Business_KeyMetrics?: string;
  Business_DocsLink?: string;
  Business_Audience?: string;
  Business_ConsentConfirm?: string;

  // Investor columns (prefixed)
  Investor_FullName?: string;
  Investor_Email?: string;
  Investor_Phone?: string;
  Investor_Location?: string;
  Investor_Amount?: number | string;
  Investor_ReturnTargetPct?: number | string;
  Investor_RiskTolerance?: string;
  Investor_Types?: string;
  Investor_Horizon?: string;
  Investor_EmailOptIn?: string;
  Investor_ConsentAcknowledge?: string;
}

/**
 * Insert a public lead row into Google Sheets via SheetsDB
 */
export async function insertPublicLead(row: PublicLeadRow): Promise<void> {
  try {
    // SheetsDB expects the data object directly
    const response = await fetch(SHEETDB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(row),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SheetsDB public lead submission failed:', response.status, errorText);
      throw new Error(`SheetsDB error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Public lead submitted to SheetsDB successfully');
    
  } catch (error) {
    console.error('❌ Failed to insert public lead to SheetsDB:', error);
    throw error;
  }
}

/**
 * Create a unified row object for Business lead
 */
export function createBusinessLeadRow(
  formData: any,
  metadata: {
    sourcePath: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    userAgent?: string;
    ipHash: string;
  }
): PublicLeadRow {
  return {
    // Common metadata
    RecordType: 'BUSINESS',
    SubmittedAt: new Date().toISOString(),
    SourcePath: metadata.sourcePath,
    UTM_Source: metadata.utmSource || '',
    UTM_Medium: metadata.utmMedium || '',
    UTM_Campaign: metadata.utmCampaign || '',
    UserAgent: metadata.userAgent || '',
    IP_Hash: metadata.ipHash,
    Status: 'NEW',

    // Business-specific fields
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
    Business_Years: formData.years || '',
    Business_Location: formData.location || '',
    Business_KeyMetrics: formData.keyMetrics || '',
    Business_DocsLink: formData.docsLink || '',
    Business_Audience: formData.audience || '',
    Business_ConsentConfirm: formData.consentConfirm ? 'Yes' : 'No',

    // Empty investor fields
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
    Investor_ConsentAcknowledge: '',
  };
}

/**
 * Create a unified row object for Investor lead
 */
export function createInvestorLeadRow(
  formData: any,
  metadata: {
    sourcePath: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    userAgent?: string;
    ipHash: string;
  }
): PublicLeadRow {
  return {
    // Common metadata
    RecordType: 'INVESTOR',
    SubmittedAt: new Date().toISOString(),
    SourcePath: metadata.sourcePath,
    UTM_Source: metadata.utmSource || '',
    UTM_Medium: metadata.utmMedium || '',
    UTM_Campaign: metadata.utmCampaign || '',
    UserAgent: metadata.userAgent || '',
    IP_Hash: metadata.ipHash,
    Status: 'NEW',

    // Investor-specific fields
    Investor_FullName: formData.fullName || '',
    Investor_Email: formData.email || '',
    Investor_Phone: formData.phone || '',
    Investor_Location: formData.location || '',
    Investor_Amount: formData.amount || '',
    Investor_ReturnTargetPct: formData.returnTargetPct || '',
    Investor_RiskTolerance: formData.riskTolerance || '',
    Investor_Types: Array.isArray(formData.types) ? formData.types.join(', ') : '',
    Investor_Horizon: formData.horizon || '',
    Investor_EmailOptIn: formData.emailOptIn ? 'Yes' : 'No',
    Investor_ConsentAcknowledge: formData.consentAcknowledge ? 'Yes' : 'No',

    // Empty business fields
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
    Business_ConsentConfirm: '',
  };
}

