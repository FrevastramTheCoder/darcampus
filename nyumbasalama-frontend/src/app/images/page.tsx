
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Loader2, MapPin, Phone, MessageCircle, Trash2 } from 'lucide-react';
import { API_BASE_URL, resolveVideoUrl } from '@/lib/api';

export default function ImagesPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'admin' || user.role === 'ADMIN');
      } catch {}
    }
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/images/`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) return alert('Admin only');
    if (!confirm('Delete this image?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/images/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        alert('✅ Deleted!');
        fetchImages();
      } else {
        alert('❌ Failed');
      }
    } catch (error) {
      alert('❌ Error');
    }
  };

  const openWhatsApp = (phone: string, title: string) => {
    if (!phone) return alert('No phone number');
    const url = `https://wa.me/${phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(`Hi, interested in "${title}"`)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📸 Gallery</h1>
          {isAdmin && (
            <button
              onClick={() => router.push('/upload/image')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              + Upload
            </button>
          )}
          <span className="text-sm text-gray-500">{images.length} images</span>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No images yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {images.map((img: any) => (
              <div key={img.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="aspect-square bg-gray-200 relative">
                  {img.image_url ? (
                    <img
                       src={resolveVideoUrl(img.image_url)}
                      alt={img.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ''; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {img.price > 0 && (
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      TSh {img.price.toLocaleString()}
                    </div>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{img.title}</h3>
                  {img.location && <p className="text-gray-500 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{img.location}</p>}
                  {img.university && <p className="text-xs text-blue-500">📚 {img.university}</p>}
                  {img.phone && (
                    <button
                      onClick={() => openWhatsApp(img.phone, img.title)}
                      className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium"
                    >
                      <MessageCircle className="w-3 h-3" />
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
