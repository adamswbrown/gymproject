'use client';

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getDocuments, uploadDocument, deleteDocument } from '@/lib/api';
import type { DocumentResponse } from '@/lib/api';

export default function MemberDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const document = await uploadDocument(file);
      setDocuments([document, ...documents]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setError(null);
      await deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Documents" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Documents" />
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <ActionButton
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </ActionButton>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 p-4"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-accent-primary)',
            color: 'var(--color-accent-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          No documents. Upload your first document using the button above.
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-6"
              style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {doc.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    {doc.type} - {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2"
                    style={{
                      backgroundColor: 'var(--color-accent-primary)',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Download
                  </a>
                  <ActionButton variant="secondary" onClick={() => handleDelete(doc.id)}>
                    Delete
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

