
'use client';

import dynamic from 'next/dynamic';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, ExternalLink, Map, MessageCircle, Minimize2, Navigation, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { MapPoint, MapRoute } from '@/components/maps/PropertyMap';

const PropertyMap = dynamic(() => import('@/components/maps/PropertyMap'), { ssr: false });

interface Listing {
  property_id: string | number;
  title: string;
  price: number;
  location: string;
  room_type?: string | null;
  amenities?: string[];
  straight_line_distance_km?: number | null;
  road_distance_km?: number | null;
  duration_minutes?: number | null;
  route_status?: string;
  coordinates?: { lat: number; lng: number } | null;
  why?: string[];
  score?: number;
  image_url?: string | null;
  contact?: string | null;
  availability_status?: string | null;
  verification_status?: string | null;
  rating?: number | null;
}

interface ChatPayload {
  results?: Listing[];
  map?: { markers?: MapPoint[]; routes?: MapRoute[] } | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  payload?: ChatPayload;
}

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Habari! Karibu NyumbaSalama AI. Naweza kukusaidia kupata vyumba karibu na vyuo vya Dar es Salaam. Jaribu: "IFM iko wapi?" au "Nipe vyumba chini ya 150k karibu na UDSM."',
};

function formatPrice(value: number) {
  return `TZS ${Number(value || 0).toLocaleString()}/month`;
}

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [mapMessageId, setMapMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nyumbasalama_conversation_id');
      if (saved) setSessionId(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!isMinimized) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading, isMinimized]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading || sendingRef.current) return;

    const userMessage: Message = { id: `${Date.now()}-user`, role: 'user', content: text };
    setMessages((current) => [...current, userMessage]);
    setMessage('');
    setLoading(true);
    sendingRef.current = true;

    try {
      // ✅ Direct fetch to /chat endpoint
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const nextSessionId = data.session_id || sessionId;
      if (nextSessionId) {
        setSessionId(nextSessionId);
        try {
          localStorage.setItem('nyumbasalama_conversation_id', nextSessionId);
        } catch {
          /* ignore */
        }
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data.response || data.reply || data.message || 'Samahani, sijapata jibu kwa sasa.',
        payload: { results: [], map: null }, // Kwa sasa hakuna recommendations
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch (error: unknown) {
      console.error('Chatbot error:', error);
      const axiosError = error as { code?: string; response?: { data?: { message?: string } }; message?: string };
      const serverMessage = axiosError?.response?.data?.message;
      const offline = axiosError?.code === 'ERR_NETWORK' || axiosError?.message?.includes('Network');
      const fallback = offline
        ? '⚠️ Siwezi kuwasiliana na server kwa sasa. Hakikisha backend inaendelea kwenye http://localhost:8000.'
        : (serverMessage || '⚠️ Kuna tatizo. Tafadhali jaribu tena.');
      setMessages((current) => [...current, {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: fallback,
      }]);
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  };

  const openRoute = (listing: Listing, payload?: ChatPayload) => {
    const origin = payload?.map?.markers?.find((marker) => marker.kind === 'university' || marker.kind === 'origin');
    if (!origin || !listing.coordinates) return;
    const route = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin.lat},${origin.lng};${listing.coordinates.lat},${listing.coordinates.lng}`;
    window.open(route, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        aria-label="Open NyumbaSalama AI"
        className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-orange-400 shadow-2xl shadow-slate-900/30 transition hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <Bot className="h-7 w-7" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] flex w-[min(420px,calc(100vw-1rem))] items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-2xl sm:bottom-6 sm:right-6">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-orange-400" />
          <div><p className="text-sm font-semibold">NyumbaSalama AI</p><p className="text-xs text-slate-400">Chat minimized</p></div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setIsMinimized(false)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800">Open</button>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot" className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800"><X className="h-4 w-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <section className="fixed bottom-2 right-2 z-[9999] flex h-[min(720px,calc(100svh-1rem))] w-[min(500px,calc(100vw-1rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25 sm:bottom-6 sm:right-6" aria-label="NyumbaSalama AI chatbot">
      <header className="flex items-center justify-between bg-slate-950 px-4 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400"><Bot className="h-6 w-6" /></div>
          <div><p className="text-sm font-semibold">NyumbaSalama AI</p><p className="flex items-center gap-1 text-xs text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online</p></div>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => setIsMinimized(true)} aria-label="Minimize chatbot" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><Minimize2 className="h-4 w-4" /></button>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-4">
        <div className="space-y-4">
          {messages.map((item) => {
            const listings = item.payload?.results || [];
            const map = item.payload?.map;
            const points = map?.markers?.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng)) || [];
            const origin = points.find((point) => point.kind === 'university' || point.kind === 'origin');
            const properties = points.filter((point) => point.kind === 'accommodation');
            const showMap = mapMessageId === item.id;
            return (
              <div key={item.id} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[94%] ${item.role === 'user' ? 'rounded-2xl rounded-br-md bg-orange-500 px-4 py-3 text-white' : 'w-full rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-6">{item.content}</p>
                  {item.role === 'assistant' && listings.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {listings.slice(0, 5).map((listing, index) => (
                        <article key={listing.property_id || `${listing.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div><p className="text-sm font-semibold text-slate-900">{index + 1}. {listing.title}</p><p className="mt-1 text-xs text-slate-500">{listing.location}</p></div>
                            <span className="whitespace-nowrap text-xs font-semibold text-orange-700">{formatPrice(listing.price)}</span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                            <span>Direct: {listing.straight_line_distance_km != null ? `${listing.straight_line_distance_km.toFixed(2)} km` : 'not available'}</span>
                            <span>Road: {listing.road_distance_km != null ? `${listing.road_distance_km.toFixed(2)} km` : 'not available'}</span>
                            <span>Time: {listing.duration_minutes != null ? `${Math.round(listing.duration_minutes)} min` : 'not available'}</span>
                            <span>Score: {listing.score != null ? listing.score.toFixed(2) : 'n/a'}</span>
                            <span>Availability: {listing.availability_status || 'unknown'}</span>
                            <span>Verified: {listing.verification_status || 'not recorded'}</span>
                          </div>
                          {listing.amenities?.length ? <p className="mt-2 text-xs text-slate-600">{listing.amenities.join(' | ')}</p> : <p className="mt-2 text-xs text-slate-400">Amenities not provided by listing</p>}
                          {listing.why?.length ? <p className="mt-2 text-xs leading-5 text-slate-500">Why: {listing.why.join('; ')}</p> : null}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button type="button" onClick={() => router.push(`/property/${listing.property_id}`)} className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-2 text-xs font-medium text-white hover:bg-slate-800"><ExternalLink className="h-3.5 w-3.5" /> Details</button>
                            {listing.coordinates && <button type="button" onClick={() => setMapMessageId(item.id)} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-white"><Map className="h-3.5 w-3.5" /> Map</button>}
                            {origin && listing.coordinates && <button type="button" onClick={() => openRoute(listing, item.payload)} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-white"><Navigation className="h-3.5 w-3.5" /> Route</button>}
                            {listing.contact && <a href={`tel:${listing.contact}`} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"><MessageCircle className="h-3.5 w-3.5" /> Contact</a>}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                  {item.role === 'assistant' && showMap && properties.length > 0 && (
                    <div className="mt-3"><PropertyMap properties={properties} origin={origin} routes={map?.routes || []} heightClassName="h-[230px]" /></div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">NyumbaSalama AI inaandika...</div></div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 bg-white p-3">
        <input value={message} onChange={(event) => setMessage(event.target.value)} disabled={loading} placeholder="Andika ujumbe..." aria-label="Message" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
        <button type="submit" disabled={loading || !message.trim()} aria-label="Send message" className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /></button>
      </form>
    </section>
  );
}
