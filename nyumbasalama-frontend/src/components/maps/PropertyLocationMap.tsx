'use client';

import PropertyMap from './PropertyMap';
import { MapProperty } from '@/types';

interface PropertyLocationMapProps {
  property: MapProperty;
}

export default function PropertyLocationMap({ property }: PropertyLocationMapProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">Property location</h3>
        <p className="mt-1 text-xs text-slate-500">OpenStreetMap location from the listing coordinates.</p>
      </div>
      <PropertyMap
        properties={[{
          id: property.id,
          name: property.title,
          lat: property.latitude,
          lng: property.longitude,
          price: property.price,
          location: property.location,
        }]}
        heightClassName="h-[400px] rounded-none border-0"
      />
    </div>
  );
}
