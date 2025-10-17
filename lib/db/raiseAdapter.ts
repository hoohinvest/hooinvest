/**
 * SheetsDB Adapter for Investment Pool (Raise) Domain
 * 
 * Provides database operations for raises, investments, allocations
 * Uses "poor-man's transaction" with conditional updates
 */

import { 
  Raise, 
  Investment, 
  Allocation, 
  BusinessPayout, 
  AuditLog,
  RaiseStatus,
  InvestmentStatus,
  PayoutStatus,
  InstrumentType,
  AllocationDetails,
  InstrumentTerms
} from '@/types/raise';

// SheetsDB API client (reusing existing setup)
const SHEETDB_API_URL = process.env.NEXT_PUBLIC_SHEETDB_PUBLIC_API_URL!;
const SHEETDB_API_KEY = process.env.SHEETDB_API_KEY; // For write operations

if (!SHEETDB_API_URL) {
  throw new Error('NEXT_PUBLIC_SHEETDB_PUBLIC_API_URL environment variable is required');
}

// Sheet table names
const TABLES = {
  RAISES: 'raises',
  INVESTMENTS: 'investments', 
  ALLOCATIONS: 'allocations',
  PAYOUTS: 'payouts',
  AUDIT_LOGS: 'audit_logs'
} as const;

interface SheetsDBRow {
  [key: string]: string | number | boolean | null;
}

class RaiseAdapter {
  private async fetchSheet(table: string, params?: Record<string, any>): Promise<SheetsDBRow[]> {
    const url = new URL(`${SHEETDB_API_URL}/${table}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`SheetsDB fetch failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  private async insertRow(table: string, data: Record<string, any>): Promise<void> {
    if (!SHEETDB_API_KEY) {
      throw new Error('SHEETDB_API_KEY required for write operations');
    }

    const response = await fetch(`${SHEETDB_API_URL}/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHEETDB_API_KEY}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`SheetsDB insert failed: ${response.statusText}`);
    }
  }

  private async updateRow(table: string, id: string, data: Record<string, any>): Promise<void> {
    if (!SHEETDB_API_KEY) {
      throw new Error('SHEETDB_API_KEY required for write operations');
    }

    const response = await fetch(`${SHEETDB_API_URL}/${table}/id/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHEETDB_API_KEY}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`SheetsDB update failed: ${response.statusText}`);
    }
  }

  private parseRaise(row: SheetsDBRow): Raise {
    return {
      id: row.id as string,
      businessId: row.businessId as string,
      title: row.title as string,
      description: row.description as string | undefined,
      goalCents: Number(row.goalCents),
      minContributionCents: Number(row.minContributionCents),
      maxContributionCents: row.maxContributionCents ? Number(row.maxContributionCents) : undefined,
      instrument: row.instrument as InstrumentType,
      instrumentTermsJson: JSON.parse(row.instrumentTermsJson as string) as InstrumentTerms,
      status: row.status as RaiseStatus,
      raisedCents: Number(row.raisedCents),
      expiresAt: new Date(row.expiresAt as string),
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string)
    };
  }

  private parseInvestment(row: SheetsDBRow): Investment {
    return {
      id: row.id as string,
      raiseId: row.raiseId as string,
      investorId: row.investorId as string,
      amountCents: Number(row.amountCents),
      status: row.status as InvestmentStatus,
      paymentProviderId: row.paymentProviderId as string,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string)
    };
  }

  private parseAllocation(row: SheetsDBRow): Allocation {
    return {
      id: row.id as string,
      raiseId: row.raiseId as string,
      investorId: row.investorId as string,
      allocationJson: JSON.parse(row.allocationJson as string) as AllocationDetails,
      certificateNumber: row.certificateNumber as string | undefined,
      createdAt: new Date(row.createdAt as string)
    };
  }

  private parseBusinessPayout(row: SheetsDBRow): BusinessPayout {
    return {
      id: row.id as string,
      raiseId: row.raiseId as string,
      amountCents: Number(row.amountCents),
      status: row.status as PayoutStatus,
      providerTransferId: row.providerTransferId as string | undefined,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string)
    };
  }

  // Raise operations
  async createRaise(raise: Omit<Raise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Raise> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const row = {
      id,
      businessId: raise.businessId,
      title: raise.title,
      description: raise.description || '',
      goalCents: raise.goalCents,
      minContributionCents: raise.minContributionCents,
      maxContributionCents: raise.maxContributionCents || null,
      instrument: raise.instrument,
      instrumentTermsJson: JSON.stringify(raise.instrumentTermsJson),
      status: raise.status,
      raisedCents: raise.raisedCents,
      expiresAt: raise.expiresAt.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    await this.insertRow(TABLES.RAISES, row);
    
    return {
      ...raise,
      id,
      createdAt: now,
      updatedAt: now
    };
  }

  async getRaiseById(id: string): Promise<Raise | null> {
    const rows = await this.fetchSheet(TABLES.RAISES, { id });
    return rows.length > 0 ? this.parseRaise(rows[0]) : null;
  }

  async listRaises(status?: RaiseStatus): Promise<Raise[]> {
    const params = status ? { status } : {};
    const rows = await this.fetchSheet(TABLES.RAISES, params);
    return rows.map(row => this.parseRaise(row));
  }

  async updateRaiseStatus(id: string, status: RaiseStatus): Promise<void> {
    await this.updateRow(TABLES.RAISES, id, {
      status,
      updatedAt: new Date().toISOString()
    });
  }

  async updateRaiseRaisedAmount(id: string, raisedCents: number): Promise<void> {
    await this.updateRow(TABLES.RAISES, id, {
      raisedCents,
      updatedAt: new Date().toISOString()
    });
  }

  // Investment operations
  async createInvestment(investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Investment> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const row = {
      id,
      raiseId: investment.raiseId,
      investorId: investment.investorId,
      amountCents: investment.amountCents,
      status: investment.status,
      paymentProviderId: investment.paymentProviderId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    await this.insertRow(TABLES.INVESTMENTS, row);
    
    return {
      ...investment,
      id,
      createdAt: now,
      updatedAt: now
    };
  }

  async getInvestmentsByRaise(raiseId: string): Promise<Investment[]> {
    const rows = await this.fetchSheet(TABLES.INVESTMENTS, { raiseId });
    return rows.map(row => this.parseInvestment(row));
  }

  async updateInvestmentStatus(id: string, status: InvestmentStatus): Promise<void> {
    await this.updateRow(TABLES.INVESTMENTS, id, {
      status,
      updatedAt: new Date().toISOString()
    });
  }

  // Allocation operations
  async createAllocation(allocation: Omit<Allocation, 'id' | 'createdAt'>): Promise<Allocation> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const row = {
      id,
      raiseId: allocation.raiseId,
      investorId: allocation.investorId,
      allocationJson: JSON.stringify(allocation.allocationJson),
      certificateNumber: allocation.certificateNumber || null,
      createdAt: now.toISOString()
    };

    await this.insertRow(TABLES.ALLOCATIONS, row);
    
    return {
      ...allocation,
      id,
      createdAt: now
    };
  }

  async getAllocationsByRaise(raiseId: string): Promise<Allocation[]> {
    const rows = await this.fetchSheet(TABLES.ALLOCATIONS, { raiseId });
    return rows.map(row => this.parseAllocation(row));
  }

  // Payout operations
  async createBusinessPayout(payout: Omit<BusinessPayout, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessPayout> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const row = {
      id,
      raiseId: payout.raiseId,
      amountCents: payout.amountCents,
      status: payout.status,
      providerTransferId: payout.providerTransferId || null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    await this.insertRow(TABLES.PAYOUTS, row);
    
    return {
      ...payout,
      id,
      createdAt: now,
      updatedAt: now
    };
  }

  async updatePayoutStatus(id: string, status: PayoutStatus, providerTransferId?: string): Promise<void> {
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (providerTransferId) {
      updateData.providerTransferId = providerTransferId;
    }

    await this.updateRow(TABLES.PAYOUTS, id, updateData);
  }

  // Audit logging
  async createAuditLog(type: string, payload: Record<string, any>): Promise<void> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const row = {
      id,
      type,
      payloadJson: JSON.stringify(payload),
      createdAt: now.toISOString()
    };

    await this.insertRow(TABLES.AUDIT_LOGS, row);
  }

  // Atomic operations (poor-man's transaction)
  async updateTotalsAtomic(raiseId: string, newRaisedCents: number, status?: RaiseStatus): Promise<void> {
    // In a real implementation, this would use database transactions
    // For SheetsDB, we'll update sequentially and hope for the best
    await this.updateRaiseRaisedAmount(raiseId, newRaisedCents);
    
    if (status) {
      await this.updateRaiseStatus(raiseId, status);
    }
  }

  // Helper: Get total raised amount for a raise
  async getTotalRaised(raiseId: string): Promise<number> {
    const investments = await this.getInvestmentsByRaise(raiseId);
    return investments
      .filter(inv => inv.status === InvestmentStatus.CAPTURED)
      .reduce((total, inv) => total + inv.amountCents, 0);
  }
}

export const raiseAdapter = new RaiseAdapter();
