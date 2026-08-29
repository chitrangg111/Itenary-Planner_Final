/**
 * Client-side persistence utility for Lumi AI Travel Planner
 * Safely persists trips, itineraries, expenses, chats, and user preferences in localStorage
 */

export const STORAGE_KEYS = {
  RECENT_TRIPS: 'lumi_recent_trips',
  TRIP_MAP: 'lumi_trip_itineraries_map',
  CURRENT_TRIP: 'lumi_current_trip',
  DAY_ITINERARIES: 'lumi_day_itineraries',
  EXPENSES: 'lumi_expenses',
  CHAT_MESSAGES: 'lumi_chat_messages',
  DREAM_DESTINATIONS: 'lumi_dream_destinations',
  PREFERENCES: 'lumi_preferences',
  ACTIVE_TAB: 'lumi_active_tab',
} as const;

export function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : defaultValue;
  } catch (error) {
    console.warn(`[Lumi Storage] Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[Lumi Storage] Error saving key "${key}" to localStorage:`, error);
  }
}

export function removeStoredItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Lumi Storage] Error removing key "${key}" from localStorage:`, error);
  }
}

export function clearAllLumiStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('[Lumi Storage] Error clearing Lumi storage:', error);
  }
}
