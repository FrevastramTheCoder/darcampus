'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Heart, Share2, Phone, Check, ChevronLeft, ChevronRight,
  Shield, Wifi, Zap, Droplets, Car, Building, Lock,
  CookingPot, Refrigerator, Armchair, Loader2, Map,
} from 'lucide-react';
import { propertyApi, reviewApi, favoritesApi } from '@/lib/api';
import PropertyLocationMap from '@/components/maps/PropertyLocationMap';
import WhatsAppButton from '@/components/WhatsAppButton';
import { MapProperty } from '@/types';

const AMENITY_ICONS: Record<string, typeof Zap> = {
  Umeme: Zap, Maji: Droplets, WiFi: Wifi, Pango: Car,
  'Dala dala': Building, Bajaji: Car, Usalama: Lock,
  'Bafu binafsi': Shield, Jiko: CookingPot, Friji: Refrigerator, Samani: Armchair,
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Available', RENTED: 'Rented', ON_HOLD: 'On Hold',
  Inapatikana: 'Available', Imekodishwa: 'Rented', Inashikiliwa: 'On Hold',
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await propertyApi.getById(params.id);
        const data = res.data;
        setProperty(data);
        if (data.reviews) setReviews(data.reviews);
      } catch {
        setError('Property not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  useEffect(() => {
    const checkFav = async () => {
      try {
        const res = await favoritesApi.check(params.id);
        setIsFavorite(res.data?.isFavorite || false);
      } catch {}
    };
    checkFav();
  }, [params.id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoritesApi.remove(params.id);
      } else {
        await favoritesApi.add(params.id);
      }
      setIsFavorite(!isFavorite);
    } catch {}
  };

  const submitReview = async () => {
    if (!newRating || !newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await reviewApi.create({
        propertyId: params.id,
        rating: newRating,
        comment: newComment,
      });
      setReviews((prev) => [res.data, ...prev]);
      setNewRating(0);
      setNewComment('');
    } catch {}
    setSubmittingReview(false);
  };

  const scrollImages = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{error || 'Not Found'}</h2>
      </div>
    );
  }

  // ✅ Ensure images is always an array
  const images = Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'];

  const agent = property.agent || { name: 'Owner', phone: 'N/A' };
  const hasLocation = property.latitude && property.longitude;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
              <Image 
                src={images[activeImage] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'} 
                alt={property.title} 
                fill 
                className="object-cover" 
                sizes="(max-width: 1024px) 100vw, 66vw" 
                priority 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {images.length > 1 && (
              <>
                <button onClick={() => scrollImages('left')} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollImages('right')} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="text-white font-bold text-2xl">TSh {property.price?.toLocaleString()}/month</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {STATUS_LABELS[property.status] || property.status}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)} 
                  className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-orange-500' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`${property.title} ${i + 1}`} 
                    fill 
                    className="object-cover" 
                    sizes="96px"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Property Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}, Dar es Salaam</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleFavorite} className={`p-2.5 rounded-xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                </button>
                <button className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">{property.rating || 0}</span>
                <span className="text-gray-400 text-sm">({property.reviewCount || reviews.length} reviews)</span>
              </div>
              <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium">{property.type}</span>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((a: string) => {
                    const Icon = AMENITY_ICONS[a] || Check;
                    return (<div key={a} className="flex items-center gap-2 text-sm text-gray-600"><Icon className="w-4 h-4 text-orange-500" /><span>{a}</span></div>);
                  })}
                </div>
              </div>
            )}

            {/* ✅ Google Map Section with Toggle Button */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">📍 Location</h3>
                {hasLocation && (
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                  >
                    <Map className="w-4 h-4" />
                    {showMap ? 'Hide Map' : 'Show Map'}
                  </button>
                )}
              </div>

              {!hasLocation && (
                <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 text-sm">
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <p>Location not available for this property</p>
                </div>
              )}

              {hasLocation && showMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <PropertyLocationMap
                    property={{
                      id: property.id,
                      title: property.title,
                      latitude: property.latitude,
                      longitude: property.longitude,
                      price: property.price,
                      location: property.location || property.area,
                      images: Array.isArray(property.images) ? property.images : [],
                      university: property.university,
                    } as MapProperty}
                  />
                </motion.div>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Add a Review</h3>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setNewRating(s)} className="p-1 transition-transform hover:scale-110">
                    <Star className={`w-6 h-6 ${s <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Write your review..." 
                rows={3} 
                className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-orange-500" 
              />
              <button 
                onClick={submitReview} 
                disabled={!newRating || !newComment.trim() || submittingReview} 
                className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            {reviews.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Reviews</h3>
                <div className="space-y-3">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 text-sm">{r.user?.name || r.userName || 'User'}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-20">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                {agent.name?.charAt?.(0) || 'O'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{agent.name}</p>
                <p className="text-gray-500 text-xs">Property Owner</p>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-gray-900">TSh {property.price?.toLocaleString()}/month</p>
            </div>

            <div className="space-y-3">
              <WhatsAppButton phone={agent.phone} className="!w-full justify-center !py-3" />
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                <Phone className="w-4 h-4" /> Call
              </button>
              <button onClick={toggleFavorite} className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-colors border ${isFavorite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}