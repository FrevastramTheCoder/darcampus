'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { adminApi, videoApi } from '@/lib/api';

interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  property_id: number;
  price?: number;
  location?: string;
  university?: string;
  status?: string;
  created_at?: string;
  user_name?: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getVideos();
      console.log('Videos response:', res);
      
      let videoData = [];
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          videoData = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          videoData = res.data.data;
        } else if (res.data.videos && Array.isArray(res.data.videos)) {
          videoData = res.data.videos;
        } else {
          videoData = [];
        }
      }
      setVideos(videoData);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setDeletingId(id);
    try {
      // Try admin API first, fallback to video API
      const res = await fetch(`https://nyumba-salama-backend-61zd.onrender.com/admin/videos/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert('✅ Video deleted successfully!');
        fetchVideos();
      } else {
        // Try video API
        await videoApi.delete(id.toString());
        alert('✅ Video deleted successfully!');
        fetchVideos();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete video. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleVerify = async (id: number, status: string) => {
    try {
       await adminApi.updateVideoStatus(id.toString(), status);
      alert(`✅ Video ${status} successfully!`);
      fetchVideos();
    } catch (error) {
      alert('❌ Failed to update video status');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading videos...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Videos</h1>
        <p className="text-gray-500 text-sm mt-1">Verify and manage all uploaded videos</p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
          <button onClick={fetchVideos} className="ml-2 underline font-semibold">Retry</button>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No videos uploaded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, index) => (
                  <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{video.title || 'Untitled'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{video.description || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {video.price ? `TSh ${video.price.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        video.status === 'VERIFIED' 
                          ? 'bg-green-100 text-green-700' 
                          : video.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {video.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(video.url?.startsWith('http') ? video.url : `https://nyumba-salama-backend-61zd.onrender.com${video.url}`, '_blank')}
                          className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="View Video"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleVerify(video.id, 'VERIFIED')}
                          className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"
                          title="Verify"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleVerify(video.id, 'REJECTED')}
                          className="p-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          disabled={deletingId === video.id}
                          className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === video.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
