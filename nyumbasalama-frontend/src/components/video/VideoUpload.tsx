'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Video, Home, Loader2 } from 'lucide-react';

interface VideoUploadProps {
  onUpload: (file: File, propertyId: string, title: string, description: string) => Promise<void>;
  properties: any[];
  uploading: boolean;
}

export default function VideoUpload({ onUpload, properties, uploading }: VideoUploadProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file (MP4, MOV, WebM)');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      alert('File is too large. Maximum allowed size is 100MB');
      return;
    }
    setVideoFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };
  const handleClick = () => inputRef.current?.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f); };
  const removeVideo = () => { if (preview) URL.revokeObjectURL(preview); setVideoFile(null); setPreview(''); setTitle(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !selectedProperty) {
      alert('Please select a video and property');
      return;
    }
    
    console.log('📤 Uploading video:', { 
      title, 
      property_id: selectedProperty, 
      file: videoFile.name,
      size: videoFile.size
    });
    
    await onUpload(videoFile, selectedProperty, title, description);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        onClick={!videoFile ? handleClick : undefined}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDragActive ? 'border-orange-400 bg-orange-50 cursor-copy' : videoFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer'}`}
      >
        <input ref={inputRef} type="file" accept="video/*" onChange={handleInputChange} className="hidden" />
        {videoFile ? (
          <div className="relative">
            <video src={preview} controls className="w-full max-h-64 rounded-xl object-contain bg-black" />
            <button type="button" onClick={(e) => { e.stopPropagation(); removeVideo(); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><X className="w-4 h-4" /></button>
            <p className="mt-3 text-green-600 font-medium text-sm">{videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center"><Upload className="w-8 h-8 text-orange-500" /></div>
            <div className="text-gray-700 font-medium">Drag your video here or <span className="text-orange-600">click to upload</span></div>
            <p className="text-gray-400 text-xs">MP4, MOV, WebM (max 100MB)</p>
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><Video className="w-4 h-4 text-orange-500" />Video Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter video title..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" maxLength={100} />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><Home className="w-4 h-4 text-orange-500" />Select Property</label>
        <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
          <option value="">Select a property...</option>
          {properties.map((p: any) => (
            <option key={p.id} value={p.id}>{p.title} - TSh {p.price?.toLocaleString()}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><Video className="w-4 h-4 text-orange-500" />Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your video... (amenities, price, features etc.)" rows={4} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none" maxLength={500} />
        <p className="text-right text-xs text-gray-400 mt-1">{description.length}/500</p>
      </div>

      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={!videoFile || !selectedProperty || uploading} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-all disabled:opacity-50 shadow-lg shadow-orange-200">
        {uploading ? <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="inline w-4 h-4 mr-2" />Upload Video</>}
      </motion.button>
    </form>
  );
}