'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BusinessApplication, BusinessDoc, DocType } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DocsPage() {
  const [applications, setApplications] = useState<BusinessApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [docs, setDocs] = useState<BusinessDoc[]>([]);
  const [docType, setDocType] = useState<DocType>('pitch_deck');
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (selectedApp) {
      fetchDocs();
    }
  }, [selectedApp]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/application');
      const data = await response.json();
      setApplications(data);
      if (data.length > 0) {
        setSelectedApp(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchDocs = async () => {
    try {
      const response = await fetch(`/api/docs?application_id=${selectedApp}`);
      const data = await response.json();
      setDocs(data);
    } catch (error) {
      console.error('Error fetching docs:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl || !selectedApp) return;

    setUploading(true);
    try {
      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: selectedApp,
          doc_type: docType,
          url: fileUrl,
        }),
      });

      if (response.ok) {
        alert('Document uploaded successfully');
        setFileUrl('');
        fetchDocs();
      }
    } catch (error) {
      console.error('Error uploading doc:', error);
      alert('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const docTypeLabels: Record<DocType, string> = {
    pitch_deck: 'Pitch Deck',
    pnl: 'P&L Statement',
    lease: 'Lease Agreement',
    bank_stmt: 'Bank Statements',
    permit: 'Permits & Licenses',
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Due Diligence Documents</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Application</label>
                <select
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value)}
                  className="input w-full"
                  required
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.company_name || 'Untitled Application'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocType)}
                  className="input w-full"
                  required
                >
                  <option value="pitch_deck">Pitch Deck</option>
                  <option value="pnl">P&L Statement</option>
                  <option value="lease">Lease Agreement</option>
                  <option value="bank_stmt">Bank Statements</option>
                  <option value="permit">Permits & Licenses</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">File URL</label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="input w-full"
                  placeholder="https://storage.supabase.co/..."
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload your file to Supabase Storage and paste the URL here
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="btn-primary w-full"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-bold text-sm mb-2">📋 Required Documents</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Pitch Deck (PDF)</li>
                <li>• P&L Statement (last 12 months)</li>
                <li>• Lease Agreement</li>
                <li>• Bank Statements (3-6 months)</li>
                <li>• Business Permits & Licenses</li>
              </ul>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Uploaded Documents</h2>

            {docs.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <div className="text-4xl mb-2">📄</div>
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="border rounded p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold">{docTypeLabels[doc.doc_type]}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Uploaded: {formatDate(doc.uploaded_at)}
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




