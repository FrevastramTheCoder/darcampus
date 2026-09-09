'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Filter, Search, MapPin, Image as ImageIcon, Loader2, 
  MessageCircle, Phone, ExternalLink, Trash2, Upload, Plus 
} from 'lucide-react';
import { API_BASE_URL, resolveVideoUrl } from '@/lib/api';

interface ImageItem {
  id: number;
  title: string;
  price: number;
  location: string;
  university: string;
  phone: string;
  image_url: string;
}

export default function HomePage() {
  const router = useRouter();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const filters = [
    'All', 'UDSM', 'ARU', 'MUHAS', 'DIT', 'CBE', 'DUCE', 'IFM',
    '50K-150K', '150K-300K', '300K+'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'admin' || user.role === 'ADMIN');
      } catch {
        setIsAdmin(false);
      }
    }
    
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/images/`);
      const data = await response.json();
      
      const imageItems = (data.images || []).map((img: any) => ({
        id: img.id,
        title: img.title,
        price: img.price || 0,
        location: img.location || 'Unknown location',
        university: img.university || '',
        phone: img.phone || '',
        image_url: img.image_url || img.url || '',
      }));
      
      setItems(imageItems);
    } catch (error) {
      console.error('Error:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) return alert('Admin only');
    if (!confirm('Delete this image?')) return;
    
    setDeletingId(id);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/images/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        alert('✅ Deleted!');
        fetchImages();
      } else {
        alert('❌ Failed');
      }
    } catch (error) {
      alert('❌ Error');
    } finally {
      setDeletingId(null);
    }
  };

  const openLocation = (location: string) => {
    if (!location) return alert('Location not available');
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const openWhatsApp = (phone: string, title: string) => {
    if (!phone) return alert('No phone number');
    const url = `https://wa.me/${phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(`Hi, interested in "${title}"`)}`;
    window.open(url, '_blank');
  };

  const getFilteredItems = () => {
    let filtered = [...items];

    if (activeFilter !== 'All') {
      if (activeFilter === '50K-150K') {
        filtered = filtered.filter(item => item.price >= 50000 && item.price <= 150000);
      } else if (activeFilter === '150K-300K') {
        filtered = filtered.filter(item => item.price >= 150000 && item.price <= 300000);
      } else if (activeFilter === '300K+') {
        filtered = filtered.filter(item => item.price >= 300000);
      } else {
        filtered = filtered.filter(item => 
          item.university && item.university.toLowerCase().includes(activeFilter.toLowerCase())
        );
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.location && item.location.toLowerCase().includes(query)) ||
        (item.university && item.university.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Your Perfect Home</h1>
          <p className="text-md md:text-lg mb-6 opacity-90">Discover houses and rooms near your university</p>
          
          <div className="max-w-xl mx-auto flex gap-2 bg-white rounded-lg p-2">
            <input
              type="text"
              placeholder="Search by location, university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-gray-800 rounded-lg focus:outline-none"
            />
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Search className="w-4 h-4 inline" />
            </button>
          </div>

          {/* ✅ BUTTONS - Upload & Images (Admin Only) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {/* View Gallery Button - Visible to everyone */}
            <button
              onClick={() => router.push('/images')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-sm font-medium backdrop-blur-sm"
            >
              <ImageIcon className="w-4 h-4" />
              View Gallery
            </button>
            
            {/* Upload Button - Admin Only */}
            {isLoggedIn && isAdmin && (
              <button
                onClick={() => router.push('/upload/image')}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm font-medium shadow-lg shadow-green-500/30"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
            )}
            
            {/* Image Count */}
            <span className="text-sm text-white/80 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {filteredItems.length} images
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition relative group">
                <div className="aspect-square bg-gray-200 relative">
                  {item.image_url ? (
                    <img
                       src={resolveVideoUrl(item.image_url)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ''; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {item.price > 0 && (
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      TSh {item.price.toLocaleString()}
                    </div>
                  )}

                  {/* Delete Button - Admin Only */}
                  {isLoggedIn && isAdmin && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                      {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{item.title}</h3>
                  
                  <button
                    onClick={() => openLocation(item.location)}
                    className="text-gray-500 text-sm mt-1 flex items-center gap-1 hover:text-blue-500 transition group w-full text-left"
                  >
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="hover:underline">{item.location}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </button>

                  {item.university && <p className="text-xs text-blue-500 mt-1">📚 {item.university}</p>}

                  <button
                    onClick={() => openWhatsApp(item.phone, item.title)}
                    className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  {item.phone && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {item.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No images found</p>
            {isLoggedIn && isAdmin && (
              <button
                onClick={() => router.push('/upload/image')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Upload First Image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
