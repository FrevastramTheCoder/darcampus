'use client';

import { useState, useCallback } from 'react';
import { Loader2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import ConfirmationDialog from './ConfirmationDialog';

interface Video {
  id: string;
  title: string;
  userName: string;
  status: string;
  createdAt: string;
  phone?: string;
}

interface VideosTableProps {
  videos: Video[];
  onRefresh: () => void;
}

export default function VideosTable({ videos, onRefresh }: VideosTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleVerify = useCallback(async (id: string) => {
    setVerifyingId(id);
    setError('');
    try {
      await adminApi.updateVideoStatus(id, 'VERIFIED');
      onRefresh();
    } catch {
      setError('Failed to verify video');
    } finally {
      setVerifyingId(null);
    }
  }, [onRefresh]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminApi.deleteVideo(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch {
      setError('Failed to delete video');
    } finally {
      setDeleting(false);
    }
  }, [deleteId, onRefresh]);

  if (videos.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-400">No videos found</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">&times;</button>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Videos list">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Uploaded By</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">WhatsApp</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate" title={video.title}>
                    {video.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{video.userName || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      video.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                      video.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {video.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {video.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {(video.status === 'PENDING') && (
                        <button
                          onClick={() => handleVerify(video.id)}
                          disabled={verifyingId === video.id}
                          aria-label="Verify video"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {verifyingId === video.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          Verify
                        </button>
                      )}
                      {video.status === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-600 font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                      <button
                        onClick={() => setDeleteId(video.id)}
                        aria-label="Delete video"
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <ConfirmationDialog
          title="Delete Video"
          message="Are you sure you want to delete this video? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
