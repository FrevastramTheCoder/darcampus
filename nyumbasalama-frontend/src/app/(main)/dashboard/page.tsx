'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Clock, Video, Settings, MapPin, Star, Trash2, Edit3,
  User, Mail, Phone, LogOut, Plus, Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { userApi, favoritesApi, videoApi, resolveVideoUrl } from '@/lib/api';
import { useRouter } from 'next/navigation';

type Tab = 'favorites' | 'history' | 'videos' | 'settings';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('favorites');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const tabs: { key: Tab; label: string; icon: typeof Heart }[] = [
    { key: 'favorites', label: 'Favorites', icon: Heart },
    { key: 'history', label: 'History', icon: Clock },
    { key: 'videos', label: 'My Videos', icon: Video },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [favRes, dashRes] = await Promise.all([
          favoritesApi.getAll(),
          userApi.getDashboard(),
        ]);

        const favData = favRes.data?.data || favRes.data || [];
        setFavorites(Array.isArray(favData) ? favData : []);

        if (dashRes.data?.user) {
          const u = dashRes.data.user;
          setUserName(u.name);
          setUserRole(u.role);
          setUserEmail(u.email || '');
          setUserPhone(u.phone || '');
        }

        try {
          const vidRes = await videoApi.getUserVideos();
          const vidData = vidRes.data?.data || vidRes.data || [];
          setVideos(Array.isArray(vidData) ? vidData : []);
        } catch { setVideos([]); }
      } catch {
        // failed silently
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleUpdateProfile = async () => {
    try {
      await userApi.updateProfile({ name: userName, phone: userPhone });
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const roleLabel = userRole === 'PROPERTY_OWNER' ? 'Property Owner' : 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-orange-100">
            {userName?.charAt?.(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{userName || 'User'}</h1>
            <p className="text-gray-500 text-sm">{roleLabel}</p>
          </div>
        </div>
        <Link href="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-medium text-sm hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg shadow-orange-200">
          <Plus className="w-4 h-4" /> Upload New Video
        </Link>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${activeTab === tab.key ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'favorites' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav: any) => {
                const p = fav.property || fav;
                return (
                  <Link key={fav.id} href={`/property/${p.id}`} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={p.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="96px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{p.title}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1"><MapPin className="w-3 h-3" /><span>{p.location}</span></div>
                        <div className="flex items-center gap-1 text-yellow-500 mt-1"><Star className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-medium">{p.rating}</span></div>
                        <p className="text-orange-600 font-bold text-sm mt-1">TSh {p.price?.toLocaleString()}<span className="text-gray-400 text-xs font-normal">/month</span></p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No saved houses yet</p>
              <Link href="/" className="mt-2 inline-block text-orange-600 font-medium text-sm hover:underline">Browse houses</Link>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Viewing history will appear here</p>
          </div>
        </motion.div>
      )}

      {activeTab === 'videos' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((v: any) => (
                <div key={v.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="relative aspect-video bg-gray-900">
                    <video
                      src={resolveVideoUrl(v.url)}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[12px] border-t-[8px] border-b-[8px] border-l-white border-t-transparent border-b-transparent ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{v.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">TSh {v.price?.toLocaleString()} | {v.location}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200"><Edit3 className="w-3 h-3" />Edit</button>
                      <button onClick={async () => { try { await videoApi.delete(v.id); setVideos((prev) => prev.filter((x) => x.id !== v.id)); } catch {} }} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"><Trash2 className="w-3 h-3" />Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No videos uploaded yet</p>
              <Link href="/upload" className="mt-2 inline-flex items-center gap-1.5 text-orange-600 font-medium text-sm hover:underline"><Plus className="w-4 h-4" />Upload your first video</Link>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="max-w-lg space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div><label className="flex items-center gap-2 text-sm text-gray-500 mb-1.5"><User className="w-4 h-4" />Full Name</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" /></div>
                <div><label className="flex items-center gap-2 text-sm text-gray-500 mb-1.5"><Mail className="w-4 h-4" />Email</label><input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" /></div>
                <div><label className="flex items-center gap-2 text-sm text-gray-500 mb-1.5"><Phone className="w-4 h-4" />Phone Number</label><input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" /></div>
                <button onClick={handleUpdateProfile} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors">Save Changes</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-500 mb-1.5">New Password</label><input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" /></div>
                <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Change Password</button>
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm">
              <LogOut className="w-4 h-4" />Logout
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
