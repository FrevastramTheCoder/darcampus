'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import PropertiesTable from '@/components/admin/PropertiesTable';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getProperties();
      setProperties(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading properties...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
        <p className="text-gray-500 text-sm mt-1">Update status and manage all properties</p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
          <button onClick={fetchProperties} className="ml-2 underline">Retry</button>
        </div>
      )}

      <PropertiesTable properties={properties} onRefresh={fetchProperties} />
    </div>
  );
}
