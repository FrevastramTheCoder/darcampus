import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    university: string;
    images: string[];
    rating: number;
    amenities: string[];
    status: string;
    agentName: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`}>
      <div className="card bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            TSh {property.price.toLocaleString()}
          </div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            {property.status || 'Available'}
          </div>
          
          {/* Favorite Button */}
          <button className="absolute top-3 right-14 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
            <Heart size={16} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{property.rating || '4.0'}</span>
              <span className="text-gray-400">/ 5.0</span>
            </div>
            <span className="text-gray-500 text-xs">
              {property.university || 'Near Campus'}
            </span>
          </div>
          
          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Agent */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {property.agentName || 'Property Owner'}
            </span>
            <span className="text-xs text-blue-600 font-medium">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
