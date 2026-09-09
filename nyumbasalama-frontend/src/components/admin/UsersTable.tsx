'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { adminApi } from '@/lib/api';

export default function UsersTable({ users, onRefresh }: { users: any[], onRefresh: () => void }) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    
    if (!confirm(`Change user role to ${newRole}?`)) return;
    
    setLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await adminApi.updateUserRole(userId, newRole);
      onRefresh();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const toggleUploadPermission = async (userId: string, canUpload: boolean) => {
    const action = canUpload ? 'remove upload permission' : 'allow upload';
    
    if (!confirm(`Are you sure you want to ${action} for this user?`)) return;
    
    setLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await adminApi.updateUserPermission(userId, canUpload);
      onRefresh();
    } catch (error) {
      console.error('Error updating permission:', error);
      alert('Failed to update permission');
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const toggleBan = async (userId: string, isBanned: boolean) => {
    const action = isBanned ? 'unban' : 'ban';
    
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    setLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await adminApi.toggleBan(userId, isBanned);
      onRefresh();
    } catch (error) {
      console.error('Error updating ban status:', error);
      alert('Failed to update ban status');
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.can_upload 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.can_upload ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.is_banned 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {user.is_banned ? '🚫 Banned' : '✅ Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {/* Role Toggle */}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        disabled={loading[user.id]}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        {loading[user.id] ? '...' : 'Make Admin'}
                      </button>
                    )}
                    
                    {/* Upload Permission */}
                    <button
                      onClick={() => toggleUploadPermission(user.id, !user.can_upload)}
                      disabled={loading[user.id]}
                      className={`px-3 py-1 rounded-lg text-xs transition disabled:opacity-50 ${
                        user.can_upload
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {loading[user.id] ? '...' : user.can_upload ? '🔒 Remove' : '🔓 Allow'}
                    </button>
                    
                    {/* Ban/Unban */}
                    <button
                      onClick={() => toggleBan(user.id, !user.is_banned)}
                      disabled={loading[user.id]}
                      className={`px-3 py-1 rounded-lg text-xs transition disabled:opacity-50 ${
                        user.is_banned
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {loading[user.id] ? '...' : user.is_banned ? '🔓 Unban' : '🚫 Ban'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
