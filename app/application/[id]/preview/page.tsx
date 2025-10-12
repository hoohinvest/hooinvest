'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { BusinessApplication } from '@/types';
import { calculateBusinessMetrics } from '@/lib/businessCalc';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';

export default function PreviewPage() {
  const params = useParams();
  const [application, setApplication] = useState<BusinessApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/application/${params.id}`);
      const data = await response.json();
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Application not found</div>
      </DashboardLayout>
    );
  }

  const metrics = application.unit_econ
    ? calculateBusinessMetrics(application.business_type, application.unit_econ)
    : null;

  const fundingTerms = application.funding_terms as any;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Application Preview</h1>
          <Link href="/dashboard" className="btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Status Banner */}
        <div className="card mb-6 bg-gradient-to-r from-primary to-green-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{application.company_name}</h2>
              <p className="mt-1 opacity-90">
                {application.city}, {application.state}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Status</div>
              <div className="text-xl font-bold uppercase">
                {application.status.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4">Business Overview</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Business Type</div>
              <div className="font-medium capitalize">{application.business_type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Stage</div>
              <div className="font-medium capitalize">{application.stage}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Contact Email</div>
              <div className="font-medium">{application.contact_email}</div>
            </div>
            {application.website && (
              <div>
                <div className="text-sm text-gray-600">Website</div>
                <a
                  href={application.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Visit Site →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Financial Metrics */}
        {metrics && (
          <div className="card mb-6">
            <h3 className="text-xl font-bold mb-4">Financial Projections</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="text-sm text-green-700">Annual Revenue</div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(metrics.revenue)}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="text-sm text-blue-700">Annual EBITDA</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(metrics.ebitda)}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-4">
                <div className="text-sm text-purple-700">EBITDA Margin</div>
                <div className="text-2xl font-bold text-purple-900">
                  {formatPercent(metrics.ebitda_margin)}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-4">
                <div className="text-sm text-orange-700">Payback Period</div>
                <div className="text-2xl font-bold text-orange-900">
                  {metrics.payback_years.toFixed(1)} years
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Funding Terms */}
        {fundingTerms && (
          <div className="card mb-6">
            <h3 className="text-xl font-bold mb-4">Investment Opportunity</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600">Target Raise</div>
                <div className="text-xl font-bold">
                  {formatCurrency(fundingTerms.target_raise)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Min Investment</div>
                <div className="text-xl font-bold">
                  {formatCurrency(fundingTerms.min_invest)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Max Investment</div>
                <div className="text-xl font-bold">
                  {formatCurrency(fundingTerms.max_invest)}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600 mb-1">Structure</div>
              <div className="font-medium">
                {fundingTerms.structure === 'equity' ? (
                  <>
                    <span className="font-bold">{fundingTerms.equity_pct}%</span> equity at{' '}
                    <span className="font-bold">{formatCurrency(fundingTerms.valuation)}</span> valuation
                  </>
                ) : (
                  <>
                    <span className="font-bold">{formatPercent(fundingTerms.rev_share_pct)}</span> of monthly revenue
                  </>
                )}
              </div>
            </div>

            {fundingTerms.opens_at && fundingTerms.closes_at && (
              <div className="mt-4 flex gap-4">
                <div>
                  <div className="text-sm text-gray-600">Opens</div>
                  <div className="font-medium">{formatDate(fundingTerms.opens_at)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Closes</div>
                  <div className="font-medium">{formatDate(fundingTerms.closes_at)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Marketplace Preview */}
        <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
          <h3 className="text-xl font-bold mb-2">Marketplace Card Preview</h3>
          <p className="text-sm text-gray-600 mb-4">
            This is how your offering will appear in the MVP1 marketplace
          </p>

          {/* Card Preview (similar to MVP1 style) */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {application.business_type}
                </div>
                <h4 className="text-xl font-bold">{application.company_name}</h4>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                OPEN
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              📍 {application.city}, {application.state}
            </div>

            {metrics && (
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-600">Revenue</div>
                  <div className="font-bold">{formatCurrency(metrics.revenue)}</div>
                </div>
                <div>
                  <div className="text-gray-600">EBITDA Margin</div>
                  <div className="font-bold">{formatPercent(metrics.ebitda_margin)}</div>
                </div>
              </div>
            )}

            <div className="border-t pt-4 mb-4">
              <div className="text-lg font-bold text-primary">
                {fundingTerms && formatCurrency(fundingTerms.target_raise)}
              </div>
              <div className="text-sm text-gray-600">Target Raise</div>
            </div>

            <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Invest Now
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




