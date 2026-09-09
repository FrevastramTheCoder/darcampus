'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import UsersTable from '@/components/admin/UsersTable';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  can_upload?: boolean;
  is_banned?: boolean;
  created_at?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getUsers();
      const data = response.data;
      setUsers(Array.isArray(data) ? data : data?.data || data?.users || []);
    } catch {
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-500">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-1 text-sm text-gray-500">Review accounts and upload permissions.</p>
      </div>
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button type="button" onClick={fetchUsers} className="ml-2 underline">Retry</button>
        </div>
      )}
      <UsersTable users={users} onRefresh={fetchUsers} />
    </div>
  );
}
