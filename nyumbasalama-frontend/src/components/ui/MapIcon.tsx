'use client';

interface MapIconProps {
  latitude: number;
  longitude: number;
  label?: string;
  className?: string;
}

export default function MapIcon({ latitude, longitude, label = 'View on Map', className = '' }: MapIconProps) {
  if (!latitude || !longitude) return null;

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {label}
    </a>
  );
}