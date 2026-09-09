'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

export interface MapPoint {
  id?: string;
  kind?: string;
  name: string;
  lat: number;
  lng: number;
  price?: number;
  location?: string;
}

export interface MapRoute {
  property_id?: string;
  geometry?: {
    type?: string;
    coordinates?: Array<[number, number]>;
  } | null;
}

interface PropertyMapProps {
  properties?: MapPoint[];
  origin?: MapPoint;
  routes?: MapRoute[];
  heightClassName?: string;
}

const DAR_CENTER: LatLngExpression = [-6.82, 39.25];

function MapViewport({ points }: { points: MapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = points.map((point) => [point.lat, point.lng] as [number, number]);
    if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else {
      map.fitBounds(bounds as LatLngBoundsExpression, { padding: [24, 24] });
    }
  }, [map, points]);

  return null;
}

function markerIcon(kind?: string) {
  const color = kind === 'university' || kind === 'origin' ? '#1d4ed8' : '#ea580c';
  return L.divIcon({
    className: 'nyumba-map-marker',
    html: `<span style="display:block;width:18px;height:18px;border:3px solid white;border-radius:50%;background:${color};box-shadow:0 2px 8px rgba(15,23,42,.35)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function PropertyMap({
  properties = [],
  origin,
  routes = [],
  heightClassName = 'h-[360px]',
}: PropertyMapProps) {
  const points = [...(origin ? [origin] : []), ...properties].filter(
    (point) => Number.isFinite(point.lat) && Number.isFinite(point.lng),
  );

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${heightClassName}`}>
      <MapContainer center={DAR_CENTER} zoom={12} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport points={points} />
        {points.map((point, index) => (
          <Marker
            key={`${point.id || point.name}-${index}`}
            position={[point.lat, point.lng]}
            icon={markerIcon(point.kind)}
          >
            <Popup>
              <div className="min-w-[160px] text-sm">
                <strong className="block text-slate-900">{point.name}</strong>
                {point.location && <span className="block text-slate-500">{point.location}</span>}
                {point.price != null && <span className="block text-orange-700">TZS {point.price.toLocaleString()}/month</span>}
                {point.id && (
                  <Link href={`/property/${point.id}`} className="mt-2 inline-block text-blue-700 underline">
                    View details
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {routes.map((route, index) => {
          const coordinates = route.geometry?.coordinates || [];
          const positions = coordinates
            .filter((coordinate) => coordinate.length >= 2)
            .map(([lng, lat]) => [lat, lng] as [number, number]);
          return positions.length > 1 ? (
            <Polyline key={`${route.property_id || 'route'}-${index}`} positions={positions} color="#ea580c" weight={4} opacity={0.75} />
          ) : null;
        })}
      </MapContainer>
    </div>
  );
}
