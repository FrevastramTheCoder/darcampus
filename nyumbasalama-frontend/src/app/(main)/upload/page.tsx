'use client';

import Link from 'next/link';
import { Image, ArrowRight } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Upload Image</h1>
        <p className="text-gray-500 text-center mb-8">Upload property images</p>

        <div className="max-w-md mx-auto">
          <Link href="/upload/image" className="block">
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition hover:border-orange-500 border-2 border-transparent">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Image</h2>
              <p className="text-gray-500 text-sm mb-4">Upload property images</p>
              <span className="inline-flex items-center gap-1 text-orange-500 font-medium">
                Go to Image Upload <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}