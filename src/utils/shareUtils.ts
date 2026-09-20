import { TripItinerary } from '../types';

/**
 * Utility functions for sharing itineraries via URL, WhatsApp, Web Share API,
 * and exporting to PDF / offline documents.
 */

/**
 * Strips excessively large data URLs or redundant fields to keep shareable URL compact
 */
export function sanitizeTripForShare(trip: TripItinerary): Partial<TripItinerary> {
  const sanitizeUrl = (url?: string) => {
    if (!url) return '';
    // If it's a huge base64 data URL (> 200 chars), drop it to keep URL compact
    if (url.startsWith('data:') && url.length > 200) {
      return '';
    }
    return url;
  };

  return {
    id: trip.id,
    destination: trip.destination,
    dates: trip.dates,
    from: trip.from,
    tripStartTime: trip.tripStartTime,
    tripEndTime: trip.tripEndTime,
    travellers: trip.travellers,
    status: trip.status,
    imageUrl: sanitizeUrl(trip.imageUrl),
    weather: trip.weather,
    budgetSummary: trip.budgetSummary,
    hotels: trip.hotels?.map((h) => ({
      name: h.name,
      rating: h.rating,
      pricePerNight: h.pricePerNight,
      vibe: h.vibe,
      imageUrl: sanitizeUrl(h.imageUrl),
    })),
    restaurants: trip.restaurants?.map((r) => ({
      name: r.name,
      cuisine: r.cuisine,
      specialty: r.specialty,
      priceRange: r.priceRange,
      dietaryBadge: r.dietaryBadge,
    })),
    nearbyAttractions: trip.nearbyAttractions,
    localTips: trip.localTips,
    travelAdvice: trip.travelAdvice,
    dayItineraries: trip.dayItineraries?.map((day) => ({
      dayNumber: day.dayNumber,
      sections: day.sections?.map((sec) => ({
        period: sec.period,
        activities: sec.activities?.map((act) => ({
          id: act.id,
          title: act.title,
          time: act.time,
          duration: act.duration,
          startTime: act.startTime,
          endTime: act.endTime,
          costBadgeText: act.costBadgeText,
          costBadgeClass: act.costBadgeClass,
          description: act.description,
          imageUrl: sanitizeUrl(act.imageUrl),
          tags: act.tags,
          localTip: act.localTip,
          openingHours: act.openingHours,
          ticketPrice: act.ticketPrice,
          nearbyPlaces: act.nearbyPlaces,
          recommendedRestaurant: act.recommendedRestaurant,
          transitInfo: act.transitInfo,
        })),
      })),
    })),
  };
}

/**
 * Encodes a TripItinerary into a URL-safe Base64 string
 */
export function encodeTripToShareParam(trip: TripItinerary): string {
  try {
    const compact = sanitizeTripForShare(trip);
    const jsonStr = JSON.stringify(compact);
    // UTF-8 safe base64 encoding
    const utf8Bytes = encodeURIComponent(jsonStr).replace(
      /%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(parseInt(p1, 16))
    );
    const base64 = btoa(utf8Bytes);
    // Replace URL-unsafe chars
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('[ShareUtils] Failed to encode trip to share param:', err);
    return '';
  }
}

/**
 * Decodes a share param string back into a TripItinerary
 */
export function decodeTripFromShareParam(param: string): TripItinerary | null {
  try {
    if (!param) return null;
    // Restore base64 standard chars
    let base64 = param.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decodedUtf8 = atob(base64);
    const jsonStr = decodeURIComponent(
      Array.from(decodedUtf8)
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.destination && Array.isArray(parsed.dayItineraries)) {
      return parsed as TripItinerary;
    }
    return null;
  } catch (err) {
    console.warn('[ShareUtils] Could not parse shared trip from URL param:', err);
    return null;
  }
}

/**
 * Generates the full shareable URL for this trip
 */
export function getShareableTripUrl(trip: TripItinerary): string {
  if (typeof window === 'undefined') return '';
  const param = encodeTripToShareParam(trip);
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}#trip=${param}`;
}

/**
 * Checks current browser URL for shared trip hash or search query
 */
export function checkUrlForSharedTrip(): TripItinerary | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Check Hash: #trip=... or #share=...
    const hash = window.location.hash;
    if (hash) {
      const match = hash.match(/[#&](?:trip|share)=([^&]+)/);
      if (match && match[1]) {
        const trip = decodeTripFromShareParam(match[1]);
        if (trip) return trip;
      }
    }

    // 2. Check Query Param: ?trip=... or ?share=...
    const search = window.location.search;
    if (search) {
      const params = new URLSearchParams(search);
      const tripParam = params.get('trip') || params.get('share');
      if (tripParam) {
        const trip = decodeTripFromShareParam(tripParam);
        if (trip) return trip;
      }
    }
  } catch (e) {
    console.warn('[ShareUtils] Failed to inspect URL for shared trip:', e);
  }
  return null;
}

/**
 * Generates an elegant, WhatsApp / messaging-friendly plain text itinerary summary
 */
export function generateItineraryText(trip: TripItinerary, shareUrl?: string): string {
  const dest = trip.destination || 'Destination';
  const dates = trip.dates || 'Upcoming Trip';
  const travellers = trip.travellers || 'Travelers';
  const start = trip.tripStartTime || '06:30 AM (Day 1)';
  const end = trip.tripEndTime || '09:45 PM';
  const totalCost = trip.budgetSummary?.totalEstimatedCost || '';

  const lines: string[] = [];
  lines.push(`🌍 *${dest.toUpperCase()} TRAVEL ITINERARY*`);
  lines.push(`📅 *Dates:* ${dates}`);
  if (trip.from) lines.push(`✈️ *Departure Route:* From ${trip.from}`);
  lines.push(`👥 *Group:* ${travellers}${totalCost ? ` • Estimated Budget: ${totalCost}` : ''}`);
  lines.push(`⏰ *Schedule:* ${start} ➔ ${end}`);
  lines.push('');

  if (trip.budgetSummary) {
    lines.push(`💰 *BUDGET ESTIMATE:*`);
    lines.push(`• Stay: ${trip.budgetSummary.hotelsCost} | Food: ${trip.budgetSummary.foodCost}`);
    lines.push(`• Activities: ${trip.budgetSummary.activitiesCost} | Transit: ${trip.budgetSummary.transportCost}`);
    lines.push('');
  }

  if (trip.hotels && trip.hotels.length > 0) {
    lines.push(`🏨 *RECOMMENDED STAYS:*`);
    trip.hotels.slice(0, 3).forEach((h) => {
      lines.push(`• *${h.name}* (${h.rating}★, ${h.pricePerNight}) - ${h.vibe}`);
    });
    lines.push('');
  }

  if (trip.dayItineraries && trip.dayItineraries.length > 0) {
    lines.push(`🗓️ *DAY-BY-DAY ITINERARY:*`);
    trip.dayItineraries.forEach((day) => {
      lines.push(`\n*Day ${day.dayNumber}:*`);
      day.sections.forEach((sec) => {
        sec.activities.forEach((act) => {
          const transit = act.transitInfo?.recommendedMethod ? ` [Transit: ${act.transitInfo.recommendedMethod}]` : '';
          lines.push(`  • [${sec.period} ${act.time}] *${act.title}* (${act.costBadgeText})${transit}`);
          if (act.description) {
            lines.push(`    _${act.description.slice(0, 100)}${act.description.length > 100 ? '...' : ''}_`);
          }
        });
      });
    });
    lines.push('');
  }

  if (trip.localTips && trip.localTips.length > 0) {
    lines.push(`💡 *LOCAL TIPS:*`);
    trip.localTips.slice(0, 3).forEach((tip) => lines.push(`• ${tip}`));
    lines.push('');
  }

  const urlToInclude = shareUrl || (typeof window !== 'undefined' ? getShareableTripUrl(trip) : '');
  if (urlToInclude) {
    lines.push(`📲 *View Full Interactive Plan:* ${urlToInclude}`);
  }
  lines.push(`_Planned with Lumi AI Travel Planner_ ✨`);

  return lines.join('\n');
}

/**
 * Triggers native OS Share Sheet (Web Share API) where supported
 */
export async function shareTripNative(trip: TripItinerary): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const shareUrl = getShareableTripUrl(trip);
  const title = `Trip Itinerary: ${trip.destination}`;
  const text = `Check out our ${trip.destination} travel plan (${trip.dates})! Planned with Lumi AI.`;

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl, title, text })) {
    try {
      await navigator.share({ title, text, url: shareUrl });
      return { success: true, method: 'native' };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
    }
  }

  // Fallback to clipboard
  try {
    await copyTextToClipboard(shareUrl);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'clipboard' };
  }
}

/**
 * Copies text safely to clipboard with fallback
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('[ShareUtils] Clipboard writeText failed, falling back:', e);
    }
  }

  // Fallback using textarea element
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('[ShareUtils] Fallback copy failed:', err);
    return false;
  }
}

/**
 * Downloads a standalone printable HTML document for the itinerary
 */
export function downloadOfflineHtmlItinerary(trip: TripItinerary): void {
  if (typeof window === 'undefined') return;

  const htmlContent = generatePrintableHtmlString(trip);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const filename = `Lumi_Itinerary_${(trip.destination || 'Trip').replace(/[^a-zA-Z0-9]/g, '_')}.html`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 5000);
}

/**
 * Generates self-contained HTML for offline viewing & PDF printing
 */
export function generatePrintableHtmlString(trip: TripItinerary): string {
  const dest = trip.destination || 'Destination';
  const dates = trip.dates || '';
  const travellers = trip.travellers || '2 Travellers';
  const from = trip.from ? `From ${trip.from}` : '';
  const start = trip.tripStartTime || '06:30 AM (Day 1)';
  const end = trip.tripEndTime || '09:45 PM';
  const budget = trip.budgetSummary;

  const daysHtml = (trip.dayItineraries || [])
    .map(
      (day) => `
      <div class="day-card">
        <div class="day-header">
          <h3>Day ${day.dayNumber}</h3>
        </div>
        <div class="day-body">
          ${day.sections
            .map(
              (sec) => `
            <div class="section-group">
              <div class="section-tag">${sec.period}</div>
              ${sec.activities
                .map(
                  (act) => `
                <div class="activity-row">
                  <div class="activity-time">${act.time}</div>
                  <div class="activity-content">
                    <div class="activity-title-row">
                      <span class="activity-title">${act.title}</span>
                      <span class="activity-badge">${act.costBadgeText}</span>
                    </div>
                    <p class="activity-desc">${act.description || ''}</p>
                    ${
                      act.transitInfo?.recommendedMethod
                        ? `<div class="transit-note"><strong>Transit:</strong> ${act.transitInfo.recommendedMethod} &bull; ${act.transitInfo.routeGuidance || ''}</div>`
                        : ''
                    }
                    ${
                      act.localTip
                        ? `<div class="tip-note"><strong>Tip:</strong> ${act.localTip}</div>`
                        : ''
                    }
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lumi Itinerary - ${dest}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a1b1f;
      background: #fdfdfd;
      line-height: 1.5;
      padding: 32px 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #003875, #0058bc);
      color: #ffffff;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 24px;
    }
    .header h1 { font-size: 28px; margin-bottom: 6px; font-weight: 800; }
    .header p { font-size: 14px; opacity: 0.95; }
    .meta-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
    .schedule-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #ffffff;
      border: 1px solid #e2e4ed;
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .schedule-item span { display: block; font-size: 11px; text-transform: uppercase; color: #717786; font-weight: 700; }
    .schedule-item strong { font-size: 14px; color: #003875; }
    .budget-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }
    .budget-card {
      background: #f4f6fb;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #e1e5f0;
      text-align: center;
    }
    .budget-card label { display: block; font-size: 11px; color: #575e71; font-weight: 600; text-transform: uppercase; }
    .budget-card val { display: block; font-size: 16px; font-weight: 800; color: #0058bc; margin-top: 2px; }
    .day-card {
      background: #ffffff;
      border: 1px solid #e2e4ed;
      border-radius: 14px;
      margin-bottom: 20px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .day-header {
      background: #0058bc;
      color: #ffffff;
      padding: 10px 18px;
      font-weight: 700;
      font-size: 16px;
    }
    .day-body { padding: 16px 20px; }
    .section-group { margin-bottom: 16px; }
    .section-tag {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 800;
      color: #0058bc;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      border-bottom: 1px solid #edf0f7;
      padding-bottom: 3px;
    }
    .activity-row {
      display: grid;
      grid-template-columns: 130px 1fr;
      gap: 12px;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px dashed #f0f2f7;
    }
    .activity-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .activity-time { font-size: 12px; font-weight: 700; color: #575e71; }
    .activity-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .activity-title { font-size: 14px; font-weight: 700; color: #1a1b1f; }
    .activity-badge { font-size: 11px; background: #e6f4ea; color: #137333; padding: 2px 8px; border-radius: 9999px; font-weight: 700; }
    .activity-desc { font-size: 12px; color: #414755; margin-bottom: 4px; }
    .transit-note { font-size: 11px; background: #f0f4ff; color: #004494; padding: 4px 8px; border-radius: 6px; margin-top: 4px; }
    .tip-note { font-size: 11px; background: #fff8e1; color: #7f6000; padding: 4px 8px; border-radius: 6px; margin-top: 4px; }
    .footer { text-align: center; font-size: 12px; color: #717786; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e4ed; }
    @media print {
      body { padding: 0; max-width: 100%; background: #ffffff; }
      .day-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${dest}</h1>
    <p>${dates} &bull; ${travellers} ${from ? `&bull; ${from}` : ''}</p>
    <div class="meta-badges">
      <span class="badge">Weather: ${trip.weather?.temp || '24°C'} ${trip.weather?.condition || 'Sunny'}</span>
      <span class="badge">Departure: ${start}</span>
      <span class="badge">Return: ${end}</span>
    </div>
  </div>

  <div class="schedule-bar">
    <div class="schedule-item">
      <span>Trip Departure Time</span>
      <strong>${start}</strong>
    </div>
    <div class="schedule-item">
      <span>Trip Return Time</span>
      <strong>${end}</strong>
    </div>
  </div>

  ${
    budget
      ? `
  <div class="budget-grid">
    <div class="budget-card">
      <label>Hotels</label>
      <val>${budget.hotelsCost}</val>
    </div>
    <div class="budget-card">
      <label>Dining</label>
      <val>${budget.foodCost}</val>
    </div>
    <div class="budget-card">
      <label>Activities</label>
      <val>${budget.activitiesCost}</val>
    </div>
    <div class="budget-card">
      <label>Transport</label>
      <val>${budget.transportCost}</val>
    </div>
    <div class="budget-card" style="background:#eaf1fb; border-color:#c8daf8;">
      <label style="color:#004085;">Total Est.</label>
      <val style="color:#003875;">${budget.totalEstimatedCost}</val>
    </div>
  </div>
  `
      : ''
  }

  <h2 style="font-size:18px; margin-bottom:14px; font-weight:800; color:#1a1b1f;">Itinerary Schedule</h2>
  ${daysHtml}

  <div class="footer">
    Planned with <strong>Lumi AI Travel Planner</strong> &bull; Generated on ${new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}
  </div>
</body>
</html>`;
}
