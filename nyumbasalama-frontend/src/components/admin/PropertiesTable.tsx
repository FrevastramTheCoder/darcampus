'use client';

import { useState, useCallback } from 'react';
import { Trash2, Loader2, AlertCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import ConfirmationDialog from './ConfirmationDialog';

interface Property {
  id: string;
  title: string;
  agentName: string;
  price: number;
  status: string;
  createdAt: string;
}

interface PropertiesTableProps {
  properties: Property[];
  onRefresh: () => void;
}

const STATUS_OPTIONS = ['AVAILABLE', 'RENTED', 'ON_HOLD'] as const;

export default function PropertiesTable({ properties, onRefresh }: PropertiesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    setUpdatingId(id);
    setError('');
    try {
      await adminApi.updatePropertyStatus(id, status);
      onRefresh();
    } catch {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }, [onRefresh]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminApi.deleteProperty(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch {
      setError('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  }, [deleteId, onRefresh]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-400">No properties found</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">&times;</button>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Properties list">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Agent</th>
                <th className="px-6 py-3 font-medium">Price (TSh)</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate" title={property.title}>
                    {property.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{property.agentName || 'Unknown'}</td>
                  <td className="px-6 py-4 text-gray-600">{property.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select
                        value={property.status}
                        onChange={(e) => handleStatusChange(property.id, e.target.value)}
                        disabled={updatingId === property.id}
                        aria-label={`Status for ${property.title}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border appearance-none cursor-pointer pr-8 outline-none ${
                          property.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-200' :
                          property.status === 'RENTED' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {updatingId === property.id && (
                        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setDeleteId(property.id)}
                      aria-label="Delete property"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <ConfirmationDialog
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
