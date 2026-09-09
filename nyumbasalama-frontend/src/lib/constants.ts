export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000';

export const APP_NAME = 'NyumbaSalama';
export const APP_DESCRIPTION = 'Student housing platform - Dar es Salaam, Tanzania';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export const USER_ROLES = {
  STUDENT: 'student',
  PROPERTY_OWNER: 'property_owner',
  ADMIN: 'admin',
} as const;

export const PROPERTY_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RENTED: 'RENTED',
  PENDING: 'PENDING',
} as const;

export const VIDEO_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

export const REVIEW_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

// ============================================
// PRICE RANGES - ADDED
// ============================================
export const PRICE_RANGES = [
  { label: '50,000 - 150,000', value: '50K-150K', min: 50000, max: 150000 },
  { label: '150,000 - 300,000', value: '150K-300K', min: 150000, max: 300000 },
  { label: '300,000+', value: '300K+', min: 300000, max: 1000000 },
] as const;

// ============================================
// UNIVERSITIES - ADDED
// ============================================
export const UNIVERSITIES = [
  { label: 'UDSM', value: 'UDSM' },
  { label: 'ARU', value: 'ARU' },
  { label: 'MUHAS', value: 'MUHAS' },
  { label: 'DIT', value: 'DIT' },
  { label: 'CBE', value: 'CBE' },
  { label: 'IFM', value: 'IFM' },
  { label: 'DUCE', value: 'DUCE' },
  { label: 'TIA', value: 'TIA' },
  { label: 'NIT', value: 'NIT' },
  { label: 'OUT', value: 'OUT' },
  { label: 'SJUIT', value: 'SJUIT' },
  { label: 'KIU', value: 'KIU' },
  { label: 'MNMA', value: 'MNMA' },
  { label: 'UoB', value: 'UoB' },
] as const;

export const PROPERTY_TYPES = [
  'Single Room',
  'Shared Room',
  'Hostel',
  'Studio',
  'Apartment',
  'Full House',
] as const;

// ============================================
// CHATBOT SUGGESTIONS - ADDED
// ============================================
export const CHATBOT_SUGGESTIONS = [
  'Show me rooms near UDSM',
  'Girls hostel near MUHAS',
  'Cheap room under 150,000',
  'Room with WiFi near DIT',
  'Safe accommodation near IFM',
  'Single room near ARU',
  'Room with private bathroom',
  'Verified rooms near CBE',
  'Studio near DUCE',
  'Shared room budget options',
];

// ============================================
// MOCK DATA FOR TESTING
// ============================================
