
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Loader2, Trash2 } from 'lucide-react';

export default function VideosPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All'); // ✅ ADDED
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const filters = ['All', 'UDSM', 'ARU', 'MUHAS', 'DIT', 'CBE', 'DUCE', 'IFM', '50K-150K', '150K-300K', '300K+'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.log('📤 Fetching videos...');
      const response = await fetch('http://localhost:8000/videos/');
      const data = await response.json();
      console.log('📥 Response:', data);
      
      if (data && data.videos) {
        setVideos(data.videos);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to delete videos');
      router.push('/login');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setDeletingId(id);
    try {
      console.log('🗑️ Deleting video:', id);
      
      const response = await fetch(`http://localhost:8000/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert('✅ Video deleted successfully!');
        fetchVideos();
      } else {
        const data = await response.json();
        alert('❌ Failed to delete video: ' + (data.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Error deleting video');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => { 
    fetchVideos(); 
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Housing Videos</h1>
          <p className="text-sm text-gray-500 mt-1">Watch house and room tour videos</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium">
          <Filter className="w-3.5 h-3.5" />
          {videos.length} videos
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === f
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-2 text-gray-500">Loading videos...</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchVideos}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const videoUrl = video.url?.startsWith('http') 
              ? video.url 
              : `http://localhost:8000${video.url}`;
              
            return (
              <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition relative">
                <div className="aspect-video bg-gray-900 relative">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                  
                  {isLoggedIn && (
                    <button
                      onClick={() => handleDelete(video.id)}
                      disabled={deletingId === video.id}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg disabled:opacity-50 z-10"
                      title="Delete Video"
                    >
                      {deletingId === video.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{video.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{video.description || 'No description'}</p>
                  {video.price && (
                    <p className="text-sm font-bold text-orange-500 mt-2">TSh {video.price.toLocaleString()}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">{video.views || 0} views</span>
                    <span className="text-xs text-gray-400">❤️ {video.likes || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No videos yet. Be the first to upload!</p>
          <a 
            href="/upload" 
            className="inline-block mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Upload Video
          </a>
        </div>
      )}
    </div>
  );
}
