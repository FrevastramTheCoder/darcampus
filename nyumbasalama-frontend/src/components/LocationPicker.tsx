'use client';

import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
  setLocation: (value: string) => void;
}

const DAR_CENTER: [number, number] = [-6.82, 39.25];

function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  setLocation,
}: LocationPickerProps) {
  const selected = useMemo(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) ? ([lat, lng] as [number, number]) : null;
  }, [latitude, longitude]);

  const marker = useMemo(() => L.divIcon({
    className: 'nyumba-location-marker',
    html: '<span style="display:block;width:20px;height:20px;border:3px solid white;border-radius:50%;background:#ea580c;box-shadow:0 2px 8px rgba(15,23,42,.35)"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }), []);

  const selectLocation = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setLocation(`Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <MapContainer center={selected || DAR_CENTER} zoom={selected ? 15 : 12} className="h-64 w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={selectLocation} />
        {selected && <Marker position={selected} icon={marker} />}
      </MapContainer>
      <p className="bg-gray-50 px-3 py-2 text-xs text-gray-500">Click the map to store the listing coordinates.</p>
    </div>
  );
}
