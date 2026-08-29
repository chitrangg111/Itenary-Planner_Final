/**
 * Unified API Client for Web, Cloud Run, and Android Capacitor APK
 * Handles internet routing, custom backend URLs, direct Gemini API keys, and connection testing.
 */

import { TripItinerary } from '../types';
import { getAccuratePhotoUrl } from './photoResolver';

// Cloud Run Production Deployment URL
export const DEFAULT_LIVE_BACKEND_URL =
  'https://ais-pre-ksmgrlwnpssfwayvwbouhj-768408360696.asia-southeast1.run.app';

const STORAGE_KEYS = {
  BACKEND_URL: 'lumi_custom_backend_url',
  GEMINI_KEY: 'lumi_direct_gemini_api_key',
  CONNECTION_MODE: 'lumi_connection_mode', // 'cloud' | 'direct_gemini' | 'custom'
};

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
  return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
}

/**
 * Sets direct Gemini API key
 */
export function setDirectGeminiApiKey(key: string | null): void {
  if (typeof window === 'undefined') return;
  if (!key || !key.trim()) {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
  } else {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
  }
}

export interface HealthCheckResult {
  ok: boolean;
  url: string;
  latencyMs: number;
  message: string;
}

/**
 * Test connectivity to the backend or direct Gemini API
 */
export async function testConnection(): Promise<HealthCheckResult> {
  const directKey = getDirectGeminiApiKey();
  if (directKey) {
    const startTime = performance.now();
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${directKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'ping' }] }],
          }),
        }
      );
      const latencyMs = Math.round(performance.now() - startTime);
      if (resp.ok) {
        return {
          ok: true,
          url: 'Direct Google Gemini API',
          latencyMs,
          message: `Connected directly to Google Gemini (${latencyMs}ms)`,
        };
      } else {
        const errorJson = await resp.json().catch(() => ({}));
        return {
          ok: false,
          url: 'Direct Google Gemini API',
          latencyMs,
          message: errorJson?.error?.message || `Gemini API returned status ${resp.status}`,
        };
      }
    } catch (e: any) {
      return {
        ok: false,
        url: 'Direct Google Gemini API',
        latencyMs: 0,
        message: e?.message || 'Network request to Google Gemini failed',
      };
    }
  }

  const baseUrl = getBackendBaseUrl();
  const targetUrl = `${baseUrl}/api/health`;
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const resp = await fetch(targetUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - startTime);
    if (resp.ok) {
      const data = await resp.json().catch(() => ({}));
      return {
        ok: true,
        url: baseUrl || 'Current Origin',
        latencyMs,
        message: `Online & Connected to Cloud AI (${latencyMs}ms)`,
      };
    } else {
      return {
        ok: false,
        url: targetUrl,
        latencyMs,
        message: `Server returned HTTP ${resp.status}`,
      };
    }
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return {
      ok: false,
      url: targetUrl,
      latencyMs: 0,
      message: isTimeout
        ? 'Connection timed out (Check mobile internet)'
        : 'Cannot reach server. Will use intelligent offline synthesis.',
    };
  }
}

/**
 * Generate trip using Cloud Backend API or direct Gemini
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

  // If user provided their own direct Gemini Key, call Google directly
  if (directKey) {
    try {
      return await generateWithDirectGemini(params, directKey);
    } catch (e) {
      console.warn('Direct Gemini API failed, attempting cloud backend fallback:', e);
    }
  }

  // Call Cloud Run / Local Express Backend
  const baseUrl = getBackendBaseUrl();
  const endpoint = `${baseUrl}/api/generate-trip`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
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
    if (data && Array.isArray(data.dayItineraries) && data.dayItineraries.length > 0) {
      return data as TripItinerary;
    }
    return null;
  } catch (error) {
    console.warn(`[API Client] Trip generation via ${endpoint} failed:`, error);
    return null;
  }
}

/**
 * Send chat message using Cloud Backend or direct Gemini
 */
export async function apiSendChat(
  message: string,
  destination?: string
): Promise<{ reply: string; previewCard?: any } | null> {
  const directKey = getDirectGeminiApiKey();

  if (directKey) {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${directKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `User asks: "${message}". Destination is: "${destination || 'India/World'}". Provide concise, helpful travel advice with local public transport guidance.` }] }],
          }),
        }
      );
      if (resp.ok) {
        const json = await resp.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { reply: text };
      }
    } catch (e) {
      console.warn('Direct Gemini chat failed:', e);
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
 * Direct client-side Gemini generation for direct API key usage
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
  const prompt = `Craft a realistic, authentic ${params.days}-day travel itinerary for ${params.destination} departing from ${params.from} for ${params.travellers} with budget of ₹${params.budgetINR}.
Trip Start Time: ${params.tripStartTime || '06:30 AM'}
Trip End Time: ${params.tripEndTime || '09:45 PM'}
Include structured budget summary in INR, 2 hotels, 2 restaurants, 4 nearby attractions, and day-by-day morning, afternoon, and evening activities with times, descriptions, cost badges, and public transit guidance. Return raw JSON matching standard TripItinerary format.`;

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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

  if (!resp.ok) {
    throw new Error(`Direct Gemini API failed with status ${resp.status}`);
  }

  const json = await resp.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(rawText || '{}');

  if (!parsed.imageUrl || parsed.imageUrl.includes('placeholder')) {
    parsed.imageUrl = getAccuratePhotoUrl(params.destination, 'destination');
  }

  return parsed as TripItinerary;
}
