'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from 'react';
import { Heart, Play, User, MapPin, Home, Video, Pause } from 'lucide-react';

interface VideoCardProps {
  video: any;
  onLike?: (id: string) => void;
  isActive?: boolean;
}

export default function VideoCard({ video, onLike }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likes || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    if (onLike) onLike(video.id);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // ✅ Safely format price
  const formatPrice = (price: number | string) => {
    if (!price || price === 0 || price === '0') return 'Price N/A';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice) || numPrice === 0) return 'Price N/A';
    return `TSh ${numPrice.toLocaleString()}`;
  };

  // ✅ Get correct video URL
  const getVideoUrl = () => {
    if (!video.url) return '';
    if (video.url.startsWith('http')) return video.url;
    return `https://nyumba-salama-backend-61zd.onrender.com${video.url}`;
  };

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Player */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={getVideoUrl()}
          className="w-full h-full object-contain"
          poster={video.thumbnail || ''}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Video load error:', video.url);
            console.log('Trying URL:', getVideoUrl());
          }}
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <p className="text-white font-bold text-sm">
            {formatPrice(video.price)}
          </p>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
          />
        </button>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
          {video.title || 'Untitled Video'}
        </h3>
        
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {video.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <span className="text-xs text-gray-600">
              {video.userName || 'Anonymous'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {video.location && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>{video.location}</span>
              </div>
            )}
            {video.university && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Home className="w-3 h-3" />
                <span>{video.university}</span>
              </div>
            )}
          </div>
        </div>

        {/* Views & Likes Stats */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {video.views || 0} views
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>❤️ {likesCount || 0}</span>
            {video.createdAt && (
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
