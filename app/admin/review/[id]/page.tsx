'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { BusinessApplication, BusinessDoc, ReviewComment } from '@/types';
import { calculateBusinessMetrics } from '@/lib/businessCalc';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';

export default function AdminReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<BusinessApplication | null>(null);
  const [docs, setDocs] = useState<BusinessDoc[]>([]);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [appRes, docsRes, commentsRes] = await Promise.all([
        fetch(`/api/application/${params.id}`),
        fetch(`/api/docs?application_id=${params.id}`),
        fetch(`/api/comments?application_id=${params.id}`),
      ]);

      const [appData, docsData, commentsData] = await Promise.all([
        appRes.json(),
        docsRes.json(),
        commentsRes.json(),
      ]);

      setApplication(appData);
      setDocs(Array.isArray(docsData) ? docsData : []);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: 'approve' | 'reject' | 'needs_changes') => {
    if (submitting) return;

    const note = newComment.trim();
    if (!note && decision !== 'approve') {
      alert('Please provide a note for this decision');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/review/${params.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note }),
      });

      if (response.ok) {
        alert(`Application ${decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'sent back for changes'}`);
        router.push('/admin/review');
      }
    } catch (error) {
      console.error('Error submitting decision:', error);
      alert('Error submitting decision');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: params.id,
          body: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchData();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Review: {application.company_name}</h1>
          <Link href="/admin/review" className="btn-secondary">
            ← Back to Queue
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Info */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Company Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Company Name</div>
                  <div className="font-medium">{application.company_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Business Type</div>
                  <div className="font-medium capitalize">{application.business_type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="font-medium">
                    {application.city}, {application.state}
                  </div>
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
                      Visit →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Metrics */}
            {metrics && (
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Financial Projections</h2>
                <div className="grid md:grid-cols-2 gap-4">
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

            {/* Real Estate Summary */}
            {application.business_type === 'real_estate' && application.unit_econ?.real_estate && (
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Real Estate Summary</h2>
                
                {/* Property & Operations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Property & Operations</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Property Type</div>
                      <div className="font-medium capitalize">
                        {application.unit_econ.real_estate.property_type.replace('_', ' ')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Property Class</div>
                      <div className="font-medium">Class {application.unit_econ.real_estate.property_class}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Units/Doors</div>
                      <div className="font-medium">{application.unit_econ.real_estate.units_doors}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total SF</div>
                      <div className="font-medium">{application.unit_econ.real_estate.sf_total?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Current Occupancy</div>
                      <div className="font-medium">{application.unit_econ.real_estate.current_occupancy_pct}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Year Built</div>
                      <div className="font-medium">{application.unit_econ.real_estate.year_built}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="font-medium">
                        {application.unit_econ.real_estate.address_line1}<br />
                        {application.unit_econ.real_estate.city}, {application.unit_econ.real_estate.state} {application.unit_econ.real_estate.zip}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Gross Potential Rent (Annual)</div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(application.unit_econ.real_estate.gross_potential_rent_annual)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capital Stack */}
                {application.funding_terms?.real_estate && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Capital Stack</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">LTV</div>
                        <div className="font-medium">{application.funding_terms.real_estate.ltv_pct}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Equity Required</div>
                        <div className="font-medium text-blue-600">
                          {formatCurrency(application.funding_terms.real_estate.equity_required)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Preferred Return</div>
                        <div className="font-medium">{application.funding_terms.real_estate.preferred_return_pct}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">GP/LP Split</div>
                        <div className="font-medium">{application.funding_terms.real_estate.gp_lp_split}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Hold Period</div>
                        <div className="font-medium">{application.funding_terms.real_estate.hold_period_months} months</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Exit Strategy</div>
                        <div className="font-medium capitalize">
                          {application.funding_terms.real_estate.exit_strategy.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Valuation */}
                {application.funding_terms?.real_estate && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Valuation</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">ARV/Stabilized Value</div>
                        <div className="font-medium text-green-600">
                          {formatCurrency(application.funding_terms.real_estate.arv_or_stabilized_value)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Target Cap Rate Exit</div>
                        <div className="font-medium">{application.funding_terms.real_estate.target_cap_rate_exit_pct}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Projected IRR</div>
                        <div className="font-medium text-purple-600">
                          {application.funding_terms.real_estate.projected_irr_pct}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Projected Equity Multiple</div>
                        <div className="font-medium text-orange-600">
                          {application.funding_terms.real_estate.projected_equity_multiple}x
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">NOI (Annual)</div>
                        <div className="font-medium text-blue-600">
                          {formatCurrency(application.unit_econ.real_estate.noi_annual)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Cap Rate</div>
                        <div className="font-medium">
                          {application.funding_terms.real_estate.arv_or_stabilized_value > 0 
                            ? `${((application.unit_econ.real_estate.noi_annual / application.funding_terms.real_estate.arv_or_stabilized_value) * 100).toFixed(2)}%`
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sources & Uses */}
                {application.funding_terms?.real_estate?.sources_uses && application.funding_terms.real_estate.sources_uses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Sources & Uses</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {application.funding_terms.real_estate.sources_uses.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">
                                {formatCurrency(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {application.funding_terms?.real_estate?.timeline_milestones && application.funding_terms.real_estate.timeline_milestones.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Milestone</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Target Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {application.funding_terms.real_estate.timeline_milestones.map((milestone, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{milestone.milestone}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                {formatDate(milestone.target_date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Funding Terms */}
            {fundingTerms && (
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Funding Terms</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Target Raise</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(fundingTerms.target_raise)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Min/Max Investment</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(fundingTerms.min_invest)} - {formatCurrency(fundingTerms.max_invest)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Structure</div>
                    <div className="text-xl font-bold capitalize">
                      {fundingTerms.structure.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                {fundingTerms.structure === 'revenue_share' && (
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="text-sm text-gray-600">Revenue Share</div>
                    <div className="text-lg font-bold">
                      {formatPercent(fundingTerms.rev_share_pct)} of monthly revenue
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Documents */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Documents ({docs.length})</h2>
              {docs.length === 0 ? (
                <p className="text-gray-600">No documents uploaded</p>
              ) : (
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium capitalize">
                          {doc.doc_type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(doc.uploaded_at)}
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Comments & Actions */}
          <div className="space-y-6">
            {/* Decision Actions */}
            <div className="card bg-gray-50">
              <h2 className="text-xl font-bold mb-4">Review Decision</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleDecision('approve')}
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  ✓ Approve
                </button>

                <button
                  onClick={() => handleDecision('needs_changes')}
                  disabled={submitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  ⚠ Request Changes
                </button>

                <button
                  onClick={() => handleDecision('reject')}
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  ✗ Reject
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Add Note/Feedback</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="input w-full min-h-[100px]"
                  placeholder="Provide feedback for the applicant..."
                />
              </div>
            </div>

            {/* Comments Thread */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
              
              {comments.length === 0 ? (
                <p className="text-gray-600 text-sm">No comments yet</p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-primary pl-3 py-2">
                      <div className="text-sm font-medium text-gray-600">
                        {comment.author_email || 'Admin'}
                      </div>
                      <div className="mt-1">{comment.body}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="btn-secondary w-full mt-4"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

