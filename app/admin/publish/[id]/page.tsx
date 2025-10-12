'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { BusinessApplication } from '@/types';
import { calculateBusinessMetrics } from '@/lib/businessCalc';
import { formatCurrency, formatPercent, generateAssetCode } from '@/lib/utils';

export default function AdminPublishPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<BusinessApplication | null>(null);
  const [assetCode, setAssetCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchApplication();
    setAssetCode(generateAssetCode('business'));
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

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this offering to the MVP1 marketplace?')) {
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch(`/api/admin/publish/${params.id}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Successfully published! Asset Code: ${result.asset_code}`);
        router.push('/admin/review');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error publishing:', error);
      alert('Error publishing offering');
    } finally {
      setPublishing(false);
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

  if (application.status !== 'approved') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Cannot Publish</h2>
            <p className="text-gray-600 mb-6">
              Only approved applications can be published. Current status: <strong>{application.status}</strong>
            </p>
            <Link href="/admin/review" className="btn-primary">
              Back to Review Queue
            </Link>
          </div>
        </div>
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
          <h1 className="text-3xl font-bold">Publish to Marketplace</h1>
          <Link href="/admin/review" className="btn-secondary">
            ← Cancel
          </Link>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">✅</div>
            <div>
              <h2 className="text-xl font-bold text-green-900 mb-2">Ready to Publish</h2>
              <p className="text-green-800">
                This application has been approved and is ready to be published to the MVP1 marketplace.
                Review the asset mapping below and confirm publication.
              </p>
            </div>
          </div>
        </div>

        {/* Asset Mapping Preview */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Asset Mapping</h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Asset Code</div>
                <div className="font-bold text-primary text-lg">{assetCode}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Asset Type</div>
                <div className="font-medium">Business</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Asset Name</div>
                <div className="font-medium">{application.company_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-medium">Raising</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Asset Meta</h3>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                <pre>
                  {JSON.stringify(
                    {
                      unit_econ: application.unit_econ,
                      funding_terms: application.funding_terms,
                      business_type: application.business_type,
                      stage: application.stage,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Offering Details */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Offering Details</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Round Type</div>
              <div className="font-medium capitalize">
                {fundingTerms?.structure.replace('_', ' ')}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Target Raise</div>
              <div className="font-medium">
                {formatCurrency(fundingTerms?.target_raise || 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Investment Range</div>
              <div className="font-medium">
                {formatCurrency(fundingTerms?.min_invest || 0)} -{' '}
                {formatCurrency(fundingTerms?.max_invest || 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Jurisdiction</div>
              <div className="font-medium">{application.state}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Opens At</div>
              <div className="font-medium">
                {fundingTerms?.opens_at
                  ? new Date(fundingTerms.opens_at).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Closes At</div>
              <div className="font-medium">
                {fundingTerms?.closes_at
                  ? new Date(fundingTerms.closes_at).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        {metrics && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4">Financial Summary</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="text-sm text-green-700">Annual Revenue</div>
                <div className="text-xl font-bold text-green-900">
                  {formatCurrency(metrics.revenue)}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="text-sm text-blue-700">Annual EBITDA</div>
                <div className="text-xl font-bold text-blue-900">
                  {formatCurrency(metrics.ebitda)}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-4">
                <div className="text-sm text-purple-700">EBITDA Margin</div>
                <div className="text-xl font-bold text-purple-900">
                  {formatPercent(metrics.ebitda_margin)}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-4">
                <div className="text-sm text-orange-700">Payback Years</div>
                <div className="text-xl font-bold text-orange-900">
                  {metrics.payback_years.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Publish Actions */}
        <div className="card bg-purple-50 border-2 border-purple-200">
          <h2 className="text-xl font-bold mb-4">Publish to MVP1</h2>
          <p className="text-gray-700 mb-6">
            Publishing will create an ASSET and OFFERING record in the MVP1 database. The offering will be
            immediately visible to investors in the marketplace.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="btn-primary flex-1 py-4 text-lg"
            >
              {publishing ? 'Publishing...' : '🚀 Publish Now'}
            </button>
            <Link href="/admin/review" className="btn-secondary flex-1 py-4 text-lg text-center">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




