'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { createBrowserClient } from '@/lib/supabase/client';
import { BusinessApplication, ApplicationStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<BusinessApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/application');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    return (
      <span className={`badge badge-${status.replace('_', '')}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getNextAction = (status: ApplicationStatus) => {
    switch (status) {
      case 'draft':
        return 'Complete and submit your application';
      case 'needs_changes':
        return 'Address reviewer feedback and resubmit';
      case 'submitted':
        return 'Awaiting admin review';
      case 'in_review':
        return 'Application is being reviewed';
      case 'approved':
        return 'Awaiting publication to marketplace';
      case 'published':
        return 'Live on marketplace';
      case 'rejected':
        return 'Application was not approved';
      default:
        return '';
    }
  };

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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Link href="/application" className="btn-primary">
            + New Application
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 className="empty-state-title">No Applications Yet</h2>
            <p className="empty-state-description">
              Get started by creating your first business application
            </p>
            <Link href="/application" className="btn-primary">
              Create Application
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="card-hover">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {app.company_name || 'Untitled Application'}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {app.business_type && (
                        <span className="capitalize">{app.business_type}</span>
                      )}
                      {app.city && app.state && (
                        <span> • {app.city}, {app.state}</span>
                      )}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="bg-accent/20 border border-accent/30 rounded p-4 mb-4">
                  <p className="text-sm font-medium text-accent">
                    Next Action: {getNextAction(app.status)}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {formatDate(app.created_at)}</p>
                    <p>Updated: {formatDate(app.updated_at)}</p>
                  </div>

                  <div className="flex gap-2">
                    {(app.status === 'draft' || app.status === 'needs_changes') && (
                      <Link
                        href={`/application?id=${app.id}`}
                        className="btn-primary"
                      >
                        Edit Application
                      </Link>
                    )}
                    
                    <Link
                      href={`/application/${app.id}/preview`}
                      className="btn-secondary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand">
              {applications.length}
            </div>
            <div className="text-muted-foreground mt-1">Total Applications</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent">
              {applications.filter(a => a.status === 'submitted' || a.status === 'in_review').length}
            </div>
            <div className="text-muted-foreground mt-1">In Review</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-success">
              {applications.filter(a => a.status === 'approved' || a.status === 'published').length}
            </div>
            <div className="text-muted-foreground mt-1">Approved</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand">
              {applications.filter(a => a.status === 'published').length}
            </div>
            <div className="text-muted-foreground mt-1">Published</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

