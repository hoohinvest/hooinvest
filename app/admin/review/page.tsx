'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { BusinessApplication, ApplicationStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminReviewPage() {
  const [applications, setApplications] = useState<BusinessApplication[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const url = filter === 'all' ? '/api/admin/review' : `/api/admin/review?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-blue-100 text-blue-700',
      in_review: 'bg-yellow-100 text-yellow-700',
      needs_changes: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      published: 'bg-purple-100 text-purple-700',
    };
    return colors[status] || colors.draft;
  };

  const filteredApps = applications;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Review Queue</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'submitted', 'in_review', 'needs_changes', 'approved', 'rejected', 'published'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as ApplicationStatus | 'all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
              {status !== 'all' &&
                ` (${applications.filter((a) => a.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter((a) => a.status === 'submitted').length}
            </div>
            <div className="text-sm text-gray-600">New Submissions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter((a) => a.status === 'in_review').length}
            </div>
            <div className="text-sm text-gray-600">In Review</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter((a) => a.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">
              {applications.filter((a) => a.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-bold mb-2">No Applications</h2>
            <p className="text-gray-600">No applications match the current filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{app.company_name}</h3>
                      <span className={`badge ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Type</div>
                        <div className="font-medium capitalize">{app.business_type}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Location</div>
                        <div className="font-medium">
                          {app.city}, {app.state}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Stage</div>
                        <div className="font-medium capitalize">{app.stage}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Submitted</div>
                        <div className="font-medium">{formatDate(app.updated_at)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/review/${app.id}`}
                      className="btn-primary whitespace-nowrap"
                    >
                      Review →
                    </Link>
                    {app.status === 'approved' && (
                      <Link
                        href={`/admin/publish/${app.id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Publish
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

