export interface Property {
  id: string;
  title: string;
  type: 'Single Room' | 'Shared Room' | 'Studio' | 'Apartment' | 'Full House';
  price: number;
  location: string;
  area: string;
  university: string;
  images: string[];
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  description: string;
  status: 'Inapatikana' | 'Imekodishwa' | 'Inashikiliwa';
  agentId: string;
  agentName: string;
  agentPhone: string;
  agentAvatar?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  latitude?: number;
  longitude?: number;
  createdAt: string;
  priceRange: '50K-150K' | '150K-300K' | '300K+';
}

export interface MapProperty {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  location: string;
  images: string[];
  university?: string;
}

export interface Video {
  id: string;
  propertyId: string;
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: string;
  university: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  phone?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'property_owner';
  avatar?: string;
  favorites: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatbotResponse {
  response: string;
  matchedProperties: Array<{
    propertyId?: string;
    title?: string;
    type?: string;
    price?: number;
    location?: string;
    area?: string;
    university?: string;
    universityLabel?: string;
    description?: string;
    amenities?: string;
    rating?: number;
    reviewCount?: number;
    score?: number;
  }>;
  sources: Array<{
    id?: string;
    title?: string;
    score?: number;
  }>;
  confidence: number;
  responseTimeMs: number;
  model: string;
  aiMode: boolean;
}
