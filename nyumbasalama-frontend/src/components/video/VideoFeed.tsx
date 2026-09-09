'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import VideoCard from './VideoCard';
import { Video } from '@/types';
import { ChevronUp, ChevronDown, Trash2, Loader2 } from 'lucide-react';

interface VideoFeedProps {
  videos: Video[];
  onLikeVideo: (id: string) => void;
  onDeleteVideo?: (id: string) => void;
  deletingId?: string | null;
}

export default function VideoFeed({ 
  videos, 
  onLikeVideo, 
  onDeleteVideo,      // ✅ ADDED
  deletingId          // ✅ ADDED
}: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < videos.length) {
        setActiveIndex(index);
        const el = containerRef.current;
        if (el) {
          el.scrollTo({ top: index * el.clientHeight, behavior: 'smooth' });
        }
      }
    },
    [videos.length]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 50) goNext();
      else if (e.deltaY < -50) goPrev();
    },
    [goNext, goPrev]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 50) goNext();
      else if (delta < -50) goPrev();
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  // ✅ DELETE HANDLER
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteVideo) {
      onDeleteVideo(id);
    }
  };

  return (
    <div className="relative h-[85vh] max-w-md mx-auto">
      <div
        ref={containerRef}
        className="h-full overflow-hidden snap-y snap-mandatory scrollbar-hide"
      >
        {videos.map((video, index) => (
          <div key={video.id} className="snap-center h-full flex items-center justify-center relative">
            {/* ✅ DELETE BUTTON - Top Right */}
            {onDeleteVideo && (
              <button
                onClick={(e) => handleDelete(video.id, e)}
                disabled={deletingId === video.id}
                className="absolute top-4 right-4 z-20 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg disabled:opacity-50"
                title="Delete Video"
              >
                {deletingId === video.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            )}
            
            <VideoCard
              video={video}
              isActive={index === activeIndex}
              onLike={onLikeVideo}
            />
          </div>
        ))}
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          disabled={activeIndex === videos.length - 1}
          className="p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
