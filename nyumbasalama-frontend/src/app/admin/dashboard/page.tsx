'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { Film, Building, Users, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalVideos: 0, totalProperties: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of the NyumbaSalama platform</p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
          <button onClick={fetchStats} className="ml-2 underline">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard icon={Film} label="Total Videos" value={stats.totalVideos} color="text-blue-500" />
        <StatsCard icon={Building} label="Total Properties" value={stats.totalProperties} color="text-orange-500" />
        <StatsCard icon={Users} label="Total Users" value={stats.totalUsers} color="text-green-500" />
      </div>
    </div>
  );
}
