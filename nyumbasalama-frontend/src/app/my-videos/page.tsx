'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Trash2, Eye, Video, Plus } from 'lucide-react';
import Link from 'next/link';
import { videoApi } from '@/lib/api';

export default function MyVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await videoApi.getMyVideos();
      const data = res?.data || [];
      setVideos(Array.isArray(data) ? data : (data.videos || []));
    } catch (err) {
      setError('Failed to load your videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setDeletingId(id);
    try {
      await videoApi.delete(id.toString());
      alert('✅ Video deleted successfully!');
      fetchVideos();
    } catch (error) {
      alert('❌ Failed to delete video');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading your videos...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Videos</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your uploaded videos</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Upload New
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
          <button onClick={fetchVideos} className="ml-2 underline">Retry</button>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-lg">You haven't uploaded any videos yet.</p>
          <Link href="/upload" className="inline-block mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Upload Your First Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="aspect-video bg-gray-900 relative">
                <video
                  src={video.url?.startsWith('http') ? video.url : `https://nyumba-salama-backend-61zd.onrender.com${video.url}`}
                  className="w-full h-full object-cover"
                  controls
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{video.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{video.description || 'No description'}</p>
                {video.price && <p className="text-sm font-bold text-orange-500 mt-1">TSh {video.price.toLocaleString()}</p>}
                <p className="text-xs text-gray-400 mt-1">{video.views || 0} views</p>
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => window.open(video.url?.startsWith('http') ? video.url : `https://nyumba-salama-backend-61zd.onrender.com${video.url}`, '_blank')}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    disabled={deletingId === video.id}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {deletingId === video.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}