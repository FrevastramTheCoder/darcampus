'use client';
import { useState, useEffect } from 'react';
import { propertyApi } from '@/lib/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');

  useEffect(() => {
    propertyApi.getAll()
      .then((res: any) => {
        console.log('Properties response:', res);
        
        // Handle different response formats safely
        let data = res?.data || res;
        
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (data?.properties && Array.isArray(data.properties)) {
          setProperties(data.properties);
        } else if (data?.data && Array.isArray(data.data)) {
          setProperties(data.data);
        } else {
          console.warn('Unexpected data format:', data);
          setProperties([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching properties:', err);
        setProperties([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24 text-center">
        <p className="text-gray-500">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">Find rooms near universities</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === 'map' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No properties found.</p>
          <p className="text-sm mt-2">Add properties to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <div 
              key={property.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {property.title || 'Untitled'}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {property.description || 'No description available'}
                </p>
                <p className="text-sm font-bold text-orange-500 mt-3">
                  {property.price ? `TSh ${property.price.toLocaleString()}` : 'Price N/A'}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {property.location || 'Unknown location'}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                    {property.university || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}