/**
 * Content Variants for Marketing Copy
 * 
 * Context-aware synonyms and phrases to reduce repetitive wording
 * across public pages while preserving meaning and clarity.
 * 
 * Usage: Import and use in marketing components to vary copy.
 */

export const Variants = {
  equity: [
    "equity",
    "ownership stake",
    "equity stake",
    "minority stake",
    "ownership shares",
    "cap-table allocation"
  ],
  
  interest: [
    "interest (debt)",
    "fixed yield",
    "interest-bearing note",
    "coupon-based return",
    "annual percentage yield"
  ],
  
  royalty: [
    "royalty",
    "revenue share",
    "top-line royalty",
    "gross receipts share",
    "performance-based payout"
  ],
  
  genericTriad: [
    "Equity, Fixed Yield, and Revenue Share",
    "Ownership, Yield, and Royalties",
    "Equity stakes, interest returns, and revenue-sharing"
  ],
  
  businessAngle: [
    "Raise via ownership, fixed-yield notes, or revenue-sharing",
    "Choose equity, debt-style yield, or royalties to fit your model",
    "Flexible instruments: equity, interest-bearing notes, or revenue share"
  ],
  
  investorAngle: [
    "Invest across ownership, fixed-yield notes, and revenue-sharing",
    "Blend equity upside, yield, and royalties for diversification",
    "Access stakes, yield notes, and revenue-share opportunities"
  ]
};

/**
 * Helper to get a random variant from an array
 */
export function getVariant<T>(variants: T[]): T {
  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Helper to get a specific variant by index (for consistent rotation)
 */
export function getVariantAt<T>(variants: T[], index: number): T {
  return variants[index % variants.length];
}

