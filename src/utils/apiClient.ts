/**
 * Unified API Client for Web, Cloud Run, and Android Capacitor APK
 * Handles internet routing, custom backend URLs, direct Gemini API keys, model fallback,
 * response normalization, and connection testing.
 */

import { TripItinerary, DayItinerary, DaySection, ItineraryActivity } from '../types';
import { getAccuratePhotoUrl } from './photoResolver';

// Cloud Run Production Deployment URL
export const DEFAULT_LIVE_BACKEND_URL =
  'https://ais-pre-ksmgrlwnpssfwayvwbouhj-768408360696.asia-southeast1.run.app';

const STORAGE_KEYS = {
  BACKEND_URL: 'lumi_custom_backend_url',
  GEMINI_KEY: 'lumi_direct_gemini_api_key',
  CONNECTION_MODE: 'lumi_connection_mode',
};

// Supported Gemini models ordered by performance & capability
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
];

/**
 * Checks if the current execution context is an Android APK (Capacitor)
 */
export function isMobileApp(): boolean {
  if (typeof window === 'undefined') return false;
  const isCapacitor =
    window.location.protocol === 'capacitor:' ||
    (window as any).Capacitor !== undefined ||
    (window.location.hostname === 'localhost' && !window.location.port) ||
    window.location.origin.includes('localhost');
  return Boolean(isCapacitor);
}

/**
 * Gets the active backend API base URL
 */
export function getBackendBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  const customUrl = localStorage.getItem(STORAGE_KEYS.BACKEND_URL);
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl.trim().replace(/\/+$/, '');
  }

  // If inside Android APK (Capacitor) or localhost with no Express dev server
  if (isMobileApp()) {
    return DEFAULT_LIVE_BACKEND_URL;
  }

  // Running on web server (Cloud Run or dev server)
  return '';
}

/**
 * Sets or clears the custom backend URL
 */
export function setBackendBaseUrl(url: string | null): void {
  if (typeof window === 'undefined') return;
  if (!url || !url.trim()) {
    localStorage.removeItem(STORAGE_KEYS.BACKEND_URL);
  } else {
    localStorage.setItem(STORAGE_KEYS.BACKEND_URL, url.trim().replace(/\/+$/, ''));
  }
}

/**
 * Gets direct Gemini API key if provided by user
 */
export function getDirectGeminiApiKey(): string {
  if (typeof window === 'undefined') return '';
  const raw = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

/**
 * Sets direct Gemini API key
 */
export function setDirectGeminiApiKey(key: string | null): void {
  if (typeof window === 'undefined') return;
  if (!key || !key.trim()) {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
  } else {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim().replace(/^["']|["']$/g, ''));
  }
}

export interface HealthCheckResult {
  ok: boolean;
  url: string;
  latencyMs: number;
  message: string;
  source?: 'direct_gemini' | 'cloud_backend' | 'offline';
}

/**
 * Test connectivity to the backend or direct Gemini API
 */
export async function testConnection(): Promise<HealthCheckResult> {
  const directKey = getDirectGeminiApiKey();
  if (directKey) {
    for (const modelName of GEMINI_MODELS) {
      const startTime = performance.now();
      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${directKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Hello' }] }],
            }),
          }
        );
        const latencyMs = Math.round(performance.now() - startTime);
        if (resp.ok) {
          return {
            ok: true,
            url: `Google Gemini API (${modelName})`,
            latencyMs,
            message: `Connected directly to Google Gemini (${modelName}, ${latencyMs}ms)`,
            source: 'direct_gemini',
          };
        } else {
          const errData = await resp.json().catch(() => ({}));
          console.warn(`[Gemini Ping] ${modelName} returned status ${resp.status}:`, errData);
          if (resp.status === 400 || resp.status === 403) {
            // Bad key
            return {
              ok: false,
              url: `Google Gemini API (${modelName})`,
              latencyMs,
              message: errData?.error?.message || 'Invalid Gemini API Key. Please verify key.',
              source: 'direct_gemini',
            };
          }
        }
      } catch (e: any) {
        console.warn(`[Gemini Ping] ${modelName} fetch failed:`, e);
      }
    }
  }

  const baseUrl = getBackendBaseUrl();
  const targetUrl = `${baseUrl}/api/health`;
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(targetUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - startTime);
    if (resp.ok) {
      return {
        ok: true,
        url: baseUrl || 'Cloud AI Server',
        latencyMs,
        message: `Online & Connected to Cloud AI (${latencyMs}ms)`,
        source: 'cloud_backend',
      };
    } else {
      return {
        ok: false,
        url: targetUrl,
        latencyMs,
        message: `Cloud server returned HTTP ${resp.status}`,
        source: 'cloud_backend',
      };
    }
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return {
      ok: false,
      url: targetUrl,
      latencyMs: 0,
      message: isTimeout
        ? 'Connection timed out (Check internet connection)'
        : 'Cannot reach cloud server. Offline intelligent synthesis active.',
      source: 'offline',
    };
  }
}

/**
 * Generate trip using Direct Gemini API or Cloud Backend API
 */
export async function apiGenerateTrip(params: {
  from: string;
  destination: string;
  departure: string;
  days: number;
  budgetINR: string;
  travellers: string;
  tripStartTime?: string;
  tripEndTime?: string;
}): Promise<TripItinerary | null> {
  const directKey = getDirectGeminiApiKey();

  // 1. If user provided direct Gemini Key, call Google Gemini directly
  if (directKey) {
    try {
      console.log('[API Client] Attempting Direct Gemini trip generation...');
      const result = await generateWithDirectGemini(params, directKey);
      if (result && Array.isArray(result.dayItineraries) && result.dayItineraries.length > 0) {
        console.log('[API Client] Direct Gemini trip generation successful!');
        return result;
      }
    } catch (e) {
      console.warn('[API Client] Direct Gemini generation failed, trying Cloud Backend:', e);
    }
  }

  // 2. Call Cloud Run / Local Express Backend
  const baseUrl = getBackendBaseUrl();
  const endpoint = `${baseUrl}/api/generate-trip`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 40000);

  try {
    console.log(`[API Client] Requesting trip from backend: ${endpoint}`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const normalized = normalizeGeminiTripResponse(data, params);
    if (normalized && Array.isArray(normalized.dayItineraries) && normalized.dayItineraries.length > 0) {
      console.log('[API Client] Backend trip generation successful!');
      return normalized;
    }
    return null;
  } catch (error) {
    console.warn(`[API Client] Trip generation via ${endpoint} failed:`, error);
    return null;
  }
}

/**
 * Send chat message using Direct Gemini or Cloud Backend
 */
export async function apiSendChat(
  message: string,
  destination?: string
): Promise<{ reply: string; previewCard?: any } | null> {
  const directKey = getDirectGeminiApiKey();

  if (directKey) {
    for (const modelName of GEMINI_MODELS) {
      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${directKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `User query: "${message}". Current travel destination: "${destination || 'India/World'}".
You are Lumi, an expert AI travel concierge tailored for budget-conscious Indian travelers.
Always provide practical point-to-point public transport options (e.g. buses, metro, local trains, auto rickshaws, ferries) with estimated fares and times.
Format nicely with bullet points.`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        if (resp.ok) {
          const json = await resp.json();
          const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return { reply: text };
        }
      } catch (e) {
        console.warn(`[Direct Gemini Chat] Model ${modelName} failed:`, e);
      }
    }
  }

  const baseUrl = getBackendBaseUrl();
  const endpoint = `${baseUrl}/api/chat`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply) {
        return data;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[API Client] Chat via ${endpoint} failed:`, err);
    return null;
  }
}

/**
 * Direct client-side Gemini generation for direct API key usage with multiple model fallbacks
 */
async function generateWithDirectGemini(
  params: {
    from: string;
    destination: string;
    departure: string;
    days: number;
    budgetINR: string;
    travellers: string;
    tripStartTime?: string;
    tripEndTime?: string;
  },
  apiKey: string
): Promise<TripItinerary> {
  const daysCount = Math.min(Math.max(Number(params.days) || 3, 1), 10);
  const targetDest = params.destination || 'Kyoto, Japan';

  const prompt = `You are Lumi, an expert travel planner. Create an authentic, highly detailed ${daysCount}-day travel itinerary for ${targetDest} departing from ${params.from || 'Indian City'} for ${params.travellers || '2 Travellers'} with a budget of ₹${params.budgetINR || '50,000'}.
Trip Departure Time: ${params.tripStartTime || '06:30 AM (Day 1 Departure)'}
Trip Return Time: ${params.tripEndTime || '09:45 PM (Day ' + daysCount + ' Return)'}

CRITICAL: Return ONLY valid JSON (no markdown explanation). The JSON object MUST strictly adhere to this format:
{
  "destination": "${targetDest}",
  "dates": "${params.departure} • ${daysCount} Days",
  "tripStartTime": "${params.tripStartTime || '06:30 AM (Day 1 Departure)'}",
  "tripEndTime": "${params.tripEndTime || '09:45 PM (Day ' + daysCount + ' Return)'}",
  "travellers": "${params.travellers || '2 Travellers'}",
  "weather": { "temp": "24°C", "condition": "Sunny & Pleasant" },
  "budgetSummary": {
    "hotelsCost": "₹18,000",
    "foodCost": "₹12,000",
    "activitiesCost": "₹8,500",
    "transportCost": "₹6,500",
    "totalEstimatedCost": "₹45,000"
  },
  "hotels": [
    { "name": "Hotel Name", "rating": "4.6", "pricePerNight": "₹3,200", "vibe": "Heritage Stay" },
    { "name": "Budget Homestay / Zostel", "rating": "4.4", "pricePerNight": "₹1,400", "vibe": "Backpacker & Cozy" }
  ],
  "restaurants": [
    { "name": "Local Restaurant 1", "cuisine": "Authentic Cuisine", "specialty": "Signature Dish", "priceRange": "₹400 for two" },
    { "name": "Pure Veg / Dining Spot", "cuisine": "Indian & Local", "specialty": "Thali & Snacks", "priceRange": "₹300 for two" }
  ],
  "nearbyAttractions": ["Attraction 1", "Attraction 2", "Attraction 3", "Attraction 4"],
  "localTips": [
    "Timing: Start early between 7:30 AM - 9:00 AM to avoid crowds.",
    "Transit Pass: Use local bus/metro passes to save up to 40% on transit.",
    "Food: Try popular stalls with high local footfall for the freshest meals.",
    "Payments: Keep cash handy for small vendors, UPI/cards accepted elsewhere."
  ],
  "travelAdvice": {
    "bestTime": "October to March",
    "clothing": "Comfortable cottons, walking shoes, sun hat",
    "moneySaving": "Use shared public transport or day passes",
    "safetyOrEtiquette": "Respect cultural shrines and carry water"
  },
  "dayItineraries": [
    {
      "dayNumber": 1,
      "sections": [
        {
          "period": "Morning",
          "activities": [
            {
              "id": "act-1-1",
              "title": "Morning Exploration & Landmark",
              "time": "08:30 AM - 11:30 AM",
              "duration": "3 hrs",
              "startTime": "08:30 AM",
              "endTime": "11:30 AM",
              "costBadgeText": "₹200 Entry",
              "costBadgeClass": "bg-emerald-100 text-emerald-800",
              "description": "Explore the iconic landmark with stunning architecture and views.",
              "localTip": "Visit early to beat the afternoon heat and photography crowds.",
              "nearbyPlaces": ["Nearby Spot A", "Nearby Spot B", "Crafts Lane"],
              "recommendedRestaurant": { "name": "Morning Cafe", "cuisine": "Breakfast & Coffee", "estimatedCost": "₹250" },
              "transitInfo": {
                "recommendedMethod": "Metro / Local Bus #101",
                "applicablePublicTransport": ["Metro Line 1", "City Bus", "Auto Rickshaw"],
                "routeGuidance": "Take Metro Line 1 to Central Station and walk 5 mins."
              },
              "tags": [{ "icon": "explore", "text": "Must-Visit", "colorClass": "bg-blue-100 text-blue-800" }]
            }
          ]
        },
        {
          "period": "Afternoon",
          "activities": [
            {
              "id": "act-1-2",
              "title": "Cultural Market & Heritage Walk",
              "time": "01:00 PM - 04:00 PM",
              "duration": "3 hrs",
              "startTime": "01:00 PM",
              "endTime": "04:00 PM",
              "costBadgeText": "Free",
              "costBadgeClass": "bg-emerald-100 text-emerald-800",
              "description": "Stroll through traditional artisan streets and sample authentic delicacies.",
              "localTip": "Politely negotiate when purchasing handicraft souvenirs.",
              "nearbyPlaces": ["Old Bazaar", "Heritage Gate", "Tea Corner"],
              "recommendedRestaurant": { "name": "Heritage Thali House", "cuisine": "Traditional Lunch", "estimatedCost": "₹400" },
              "transitInfo": {
                "recommendedMethod": "Shared Auto or Short Walk",
                "applicablePublicTransport": ["Shared Auto", "E-Rickshaw", "City Bus"],
                "routeGuidance": "Take a 10-min shared auto from the main landmark."
              },
              "tags": [{ "icon": "storefront", "text": "Shopping & Food", "colorClass": "bg-amber-100 text-amber-800" }]
            }
          ]
        },
        {
          "period": "Evening",
          "activities": [
            {
              "id": "act-1-3",
              "title": "Sunset Viewpoint & Night Promenade",
              "time": "05:30 PM - 08:30 PM",
              "duration": "3 hrs",
              "startTime": "05:30 PM",
              "endTime": "08:30 PM",
              "costBadgeText": "Free",
              "costBadgeClass": "bg-emerald-100 text-emerald-800",
              "description": "Watch the sunset over scenic vistas followed by relaxed dining.",
              "localTip": "Arrive 30 minutes before sunset for the prime viewing spot.",
              "nearbyPlaces": ["Promenade", "Night Food Street", "Fountain Square"],
              "recommendedRestaurant": { "name": "Rooftop Bistro", "cuisine": "Dinner & Mocktails", "estimatedCost": "₹550" },
              "transitInfo": {
                "recommendedMethod": "City Bus or Taxi",
                "applicablePublicTransport": ["City Bus #42", "Taxi / Auto"],
                "routeGuidance": "Board Bus #42 or take a scenic 15-min walk."
              },
              "tags": [{ "icon": "wb_twilight", "text": "Scenic Sunset", "colorClass": "bg-purple-100 text-purple-800" }]
            }
          ]
        }
      ]
    }
  ]
}
Produce ${daysCount} complete days in "dayItineraries" for ${targetDest}.`;

  let lastError: any = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Direct Gemini] Trying model ${modelName}...`);

      // 1. Try with responseMimeType: 'application/json'
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = parseJsonSafely(rawText);
          if (parsed) {
            const normalized = normalizeGeminiTripResponse(parsed, params);
            if (normalized.dayItineraries && normalized.dayItineraries.length > 0) {
              return normalized;
            }
          }
        }
      } else {
        const errorJson = await response.json().catch(() => ({}));
        console.warn(`[Direct Gemini] Model ${modelName} returned status ${response.status}:`, errorJson);
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Direct Gemini] Model ${modelName} exception:`, err);
    }
  }

  throw lastError || new Error('All direct Gemini models failed to generate itinerary');
}

/**
 * Safely parse JSON from raw LLM text (handling code blocks, comments, and partial wrapping)
 */
function parseJsonSafely(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') return null;

  // 1. Strip Markdown code blocks
  let cleanText = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/\s*```$/i, '')
    .trim();

  // 2. Direct parse attempt
  try {
    return JSON.parse(cleanText);
  } catch (_) {}

  // 3. Extract bracketed JSON object
  const startIdx = cleanText.indexOf('{');
  const endIdx = cleanText.lastIndexOf('}');
  if (startIdx !== -1 && endIdx > startIdx) {
    try {
      const extracted = cleanText.substring(startIdx, endIdx + 1);
      return JSON.parse(extracted);
    } catch (_) {}
  }

  return null;
}

/**
 * Normalizes any LLM output structure into a bulletproof, complete TripItinerary
 */
function normalizeGeminiTripResponse(
  raw: any,
  params: {
    from: string;
    destination: string;
    departure: string;
    days: number;
    budgetINR: string;
    travellers: string;
    tripStartTime?: string;
    tripEndTime?: string;
  }
): TripItinerary {
  const destName = raw.destination || params.destination || 'Kyoto, Japan';
  const daysCount = Math.min(Math.max(Number(params.days) || 3, 1), 10);

  // Normalize day itineraries
  let rawDays = raw.dayItineraries || raw.days || raw.itinerary || raw.schedule || [];
  if (!Array.isArray(rawDays)) {
    rawDays = [];
  }

  const dayItineraries: DayItinerary[] = [];

  for (let i = 1; i <= daysCount; i++) {
    const rawDay = rawDays.find((d: any) => d.dayNumber === i || d.day === i) || rawDays[i - 1] || {};
    let sections: DaySection[] = [];

    if (Array.isArray(rawDay.sections) && rawDay.sections.length > 0) {
      sections = rawDay.sections.map((sec: any) => ({
        period: sec.period || 'Morning',
        activities: Array.isArray(sec.activities)
          ? sec.activities.map((act: any, aIdx: number) => normalizeActivity(act, aIdx, destName))
          : [],
      }));
    } else {
      // Check if activities are flat or in morning/afternoon/evening properties
      const morningActs = rawDay.morning || rawDay.morningActivities || [];
      const afternoonActs = rawDay.afternoon || rawDay.afternoonActivities || [];
      const eveningActs = rawDay.evening || rawDay.eveningActivities || [];
      const allActs = Array.isArray(rawDay.activities) ? rawDay.activities : [];

      if (morningActs.length > 0 || afternoonActs.length > 0 || eveningActs.length > 0) {
        if (morningActs.length > 0) {
          sections.push({
            period: 'Morning',
            activities: (Array.isArray(morningActs) ? morningActs : [morningActs]).map((a: any, idx: number) =>
              normalizeActivity(a, idx, destName)
            ),
          });
        }
        if (afternoonActs.length > 0) {
          sections.push({
            period: 'Afternoon',
            activities: (Array.isArray(afternoonActs) ? afternoonActs : [afternoonActs]).map((a: any, idx: number) =>
              normalizeActivity(a, idx, destName)
            ),
          });
        }
        if (eveningActs.length > 0) {
          sections.push({
            period: 'Evening',
            activities: (Array.isArray(eveningActs) ? eveningActs : [eveningActs]).map((a: any, idx: number) =>
              normalizeActivity(a, idx, destName)
            ),
          });
        }
      } else if (allActs.length > 0) {
        // Distribute flat activities across Morning, Afternoon, Evening
        sections = [
          {
            period: 'Morning',
            activities: allActs.slice(0, 1).map((a: any, idx: number) => normalizeActivity(a, idx, destName)),
          },
          {
            period: 'Afternoon',
            activities: allActs.slice(1, 2).map((a: any, idx: number) => normalizeActivity(a, idx, destName)),
          },
          {
            period: 'Evening',
            activities: allActs.slice(2).map((a: any, idx: number) => normalizeActivity(a, idx, destName)),
          },
        ].filter((s) => s.activities.length > 0);
      }
    }

    // If still empty sections, synthesize default day sections
    if (sections.length === 0) {
      sections = createDefaultDaySections(i, destName);
    }

    dayItineraries.push({
      dayNumber: i,
      sections,
    });
  }

  // Resolve Photos
  const mainPhoto = raw.imageUrl && !raw.imageUrl.includes('placeholder')
    ? raw.imageUrl
    : getAccuratePhotoUrl(destName, 'destination');

  // Normalize Hotels
  const hotels = Array.isArray(raw.hotels) && raw.hotels.length > 0
    ? raw.hotels.map((h: any) => ({
        name: h.name || `${destName} Heritage Hotel`,
        rating: String(h.rating || '4.5'),
        pricePerNight: h.pricePerNight || '₹3,200',
        vibe: h.vibe || 'Comfortable & Central',
        imageUrl: getAccuratePhotoUrl(`${h.name || ''} ${destName}`, 'hotel'),
      }))
    : [
        {
          name: `${destName} Grand Residency`,
          rating: '4.6',
          pricePerNight: '₹3,400',
          vibe: 'Central Location & Modern Amenities',
          imageUrl: getAccuratePhotoUrl(`${destName} hotel`, 'hotel'),
        },
        {
          name: `${destName} Cozy Homestay / Zostel`,
          rating: '4.4',
          pricePerNight: '₹1,500',
          vibe: 'Backpacker Friendly & Social',
          imageUrl: getAccuratePhotoUrl(`${destName} resort`, 'hotel'),
        },
      ];

  // Normalize Restaurants
  const restaurants = Array.isArray(raw.restaurants) && raw.restaurants.length > 0
    ? raw.restaurants.map((r: any) => ({
        name: r.name || `${destName} Authentic Diner`,
        cuisine: r.cuisine || 'Regional Specialties',
        specialty: r.specialty || 'Signature Thali & Delicacies',
        priceRange: r.priceRange || '₹400 for two',
      }))
    : [
        {
          name: `${destName} Heritage Kitchen`,
          cuisine: 'Authentic Local Flavors',
          specialty: 'Signature Regional Thali',
          priceRange: '₹450 for two',
        },
        {
          name: 'Green Leaf Pure Veg Diner',
          cuisine: 'North & South Indian, Pure Veg',
          specialty: 'Special Thali & Fresh Breads',
          priceRange: '₹300 for two',
        },
      ];

  return {
    id: raw.id || `trip-${Date.now()}`,
    destination: destName,
    dates: raw.dates || `${params.departure} • ${daysCount} Days`,
    tripStartTime: params.tripStartTime || raw.tripStartTime || '06:30 AM (Day 1 Departure)',
    tripEndTime: params.tripEndTime || raw.tripEndTime || `09:45 PM (Day ${daysCount} Return)`,
    travellers: raw.travellers || params.travellers || '2 Travellers',
    status: 'Ongoing',
    imageUrl: mainPhoto,
    weather: {
      temp: raw.weather?.temp || '24°C',
      condition: raw.weather?.condition || 'Sunny & Pleasant',
    },
    budgetSummary: {
      hotelsCost: raw.budgetSummary?.hotelsCost || '₹18,000',
      foodCost: raw.budgetSummary?.foodCost || '₹12,000',
      activitiesCost: raw.budgetSummary?.activitiesCost || '₹8,500',
      transportCost: raw.budgetSummary?.transportCost || '₹6,500',
      totalEstimatedCost: raw.budgetSummary?.totalEstimatedCost || `₹${params.budgetINR || '45,000'}`,
    },
    hotels,
    restaurants,
    nearbyAttractions: Array.isArray(raw.nearbyAttractions) && raw.nearbyAttractions.length > 0
      ? raw.nearbyAttractions
      : [`${destName} Old Market`, `${destName} Heritage Gate`, `${destName} Scenic Viewpoint`, `${destName} Lake/Riverfront`],
    localTips: Array.isArray(raw.localTips) && raw.localTips.length > 0
      ? raw.localTips
      : [
          'Timing: Start sightseeing between 7:30 AM - 9:00 AM to beat peak crowds.',
          'Transit Pass: Use local buses or shared autos to save up to 40% on travel.',
          'Food: Dine at eateries with high local footfall for the freshest regional food.',
          'Payments: Keep small cash handy for heritage stalls and street food.',
        ],
    travelAdvice: {
      bestTime: raw.travelAdvice?.bestTime || 'October to March (Pleasant sunshine and mild evenings)',
      clothing: raw.travelAdvice?.clothing || 'Comfortable cottons, walking shoes, and sun hat',
      moneySaving: raw.travelAdvice?.moneySaving || 'Use public day passes and book heritage tickets online',
      safetyOrEtiquette: raw.travelAdvice?.safetyOrEtiquette || 'Respect local shrines and carry a refillable water bottle',
    },
    dayItineraries,
  };
}

function normalizeActivity(act: any, idx: number, destName: string): ItineraryActivity {
  const title = act.title || `Explore ${destName} Sight ${idx + 1}`;
  return {
    id: act.id || `act-${Date.now()}-${idx}`,
    title,
    time: act.time || '09:00 AM - 12:00 PM',
    duration: act.duration || '3 hrs',
    startTime: act.startTime || '09:00 AM',
    endTime: act.endTime || '12:00 PM',
    costBadgeText: act.costBadgeText || 'Free',
    costBadgeClass: act.costBadgeClass || 'bg-emerald-100 text-emerald-800',
    description: act.description || `Visit and explore the famous landmarks and scenic sights of ${destName}.`,
    imageUrl: act.imageUrl && !act.imageUrl.includes('placeholder')
      ? act.imageUrl
      : getAccuratePhotoUrl(`${title} ${destName}`, 'activity'),
    localTip: act.localTip || 'Visit early in the morning for fewer crowds and great photo lighting.',
    openingHours: act.openingHours || '08:00 AM - 06:00 PM',
    ticketPrice: act.ticketPrice || 'Free Entry / Included',
    nearbyPlaces: Array.isArray(act.nearbyPlaces) && act.nearbyPlaces.length > 0
      ? act.nearbyPlaces
      : [`${destName} Bazaar`, 'Artisan Alley', 'Local Tea Stall'],
    recommendedRestaurant: act.recommendedRestaurant || {
      name: `${destName} Local Cafe`,
      cuisine: 'Snacks & Regional Meals',
      estimatedCost: '₹300',
    },
    transitInfo: act.transitInfo || {
      recommendedMethod: 'City Bus / Shared Auto',
      applicablePublicTransport: ['City Bus', 'Metro Line 1', 'Auto Rickshaw'],
      routeGuidance: `Take the local transit route directly to ${title}.`,
    },
    tags: Array.isArray(act.tags) && act.tags.length > 0
      ? act.tags
      : [{ icon: 'explore', text: 'Top Attraction', colorClass: 'bg-blue-100 text-blue-800' }],
  };
}

function createDefaultDaySections(dayNumber: number, destName: string): DaySection[] {
  return [
    {
      period: 'Morning',
      activities: [
        {
          id: `act-d${dayNumber}-1`,
          title: `${destName} Heritage Landmark & Architecture`,
          time: '08:30 AM - 11:30 AM',
          duration: '3 hrs',
          startTime: '08:30 AM',
          endTime: '11:30 AM',
          costBadgeText: '₹200 Entry',
          costBadgeClass: 'bg-emerald-100 text-emerald-800',
          description: `Begin the day visiting the celebrated historic landmark of ${destName} and admiring its iconic craftsmanship.`,
          imageUrl: getAccuratePhotoUrl(`${destName} landmark`, 'activity'),
          localTip: 'Arrive before 9:00 AM to beat long ticket queues.',
          openingHours: '08:00 AM - 06:00 PM',
          ticketPrice: '₹200',
          nearbyPlaces: ['Heritage Garden', 'Artisanal Bazaar', 'Tea Stall'],
          recommendedRestaurant: {
            name: `${destName} Breakfast Club`,
            cuisine: 'Morning Snacks & Tea',
            estimatedCost: '₹200',
          },
          transitInfo: {
            recommendedMethod: 'Local Bus / Metro',
            applicablePublicTransport: ['City Bus #101', 'Metro Line 1', 'Auto Rickshaw'],
            routeGuidance: 'Board City Bus #101 or take a direct auto rickshaw.',
          },
          tags: [{ icon: 'museum', text: 'Heritage Sight', colorClass: 'bg-amber-100 text-amber-800' }],
        },
      ],
    },
    {
      period: 'Afternoon',
      activities: [
        {
          id: `act-d${dayNumber}-2`,
          title: `Artisanal Market & Cultural Trail`,
          time: '01:00 PM - 04:00 PM',
          duration: '3 hrs',
          startTime: '01:00 PM',
          endTime: '04:00 PM',
          costBadgeText: 'Free',
          costBadgeClass: 'bg-emerald-100 text-emerald-800',
          description: `Experience the vibrant artisan lanes of ${destName}, sample local street sweets, and browse regional handicrafts.`,
          imageUrl: getAccuratePhotoUrl(`${destName} market`, 'activity'),
          localTip: 'Look for stalls with high local footfall for the freshest food.',
          openingHours: '10:00 AM - 08:30 PM',
          ticketPrice: 'Free Entry',
          nearbyPlaces: ['Spice Street', 'Old Clock Tower', 'Crafts Lane'],
          recommendedRestaurant: {
            name: 'Shree Local Thali House',
            cuisine: 'Authentic Veg Thali',
            estimatedCost: '₹350',
          },
          transitInfo: {
            recommendedMethod: 'Shared Auto / Walk',
            applicablePublicTransport: ['Shared Auto', 'E-Rickshaw'],
            routeGuidance: 'Take a short 10-minute shared auto from the morning landmark.',
          },
          tags: [{ icon: 'storefront', text: 'Culture & Food', colorClass: 'bg-blue-100 text-blue-800' }],
        },
      ],
    },
    {
      period: 'Evening',
      activities: [
        {
          id: `act-d${dayNumber}-3`,
          title: `Scenic Sunset Viewpoint & Promenade Walk`,
          time: '05:30 PM - 08:30 PM',
          duration: '3 hrs',
          startTime: '05:30 PM',
          endTime: '08:30 PM',
          costBadgeText: 'Free',
          costBadgeClass: 'bg-emerald-100 text-emerald-800',
          description: `Watch the breathtaking sunset over ${destName}, followed by an evening stroll along the illuminated promenade.`,
          imageUrl: getAccuratePhotoUrl(`${destName} sunset`, 'activity'),
          localTip: 'Reach the viewpoint 30 minutes before sunset for the best vantage point.',
          openingHours: 'Open 24 hours',
          ticketPrice: 'Free',
          nearbyPlaces: ['Promenade Walkway', 'Night Food Street', 'Musical Fountain'],
          recommendedRestaurant: {
            name: 'Sunset View Terrace',
            cuisine: 'Evening Snacks & Dinner',
            estimatedCost: '₹500',
          },
          transitInfo: {
            recommendedMethod: 'City Bus / Taxi',
            applicablePublicTransport: ['City Bus #42', 'Kaali-Peeli / Taxi'],
            routeGuidance: 'Take City Bus #42 directly to the scenic promenade entrance.',
          },
          tags: [{ icon: 'wb_twilight', text: 'Scenic Sunset', colorClass: 'bg-purple-100 text-purple-800' }],
        },
      ],
    },
  ];
}
