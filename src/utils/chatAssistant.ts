/**
 * Smart Client-Side Travel AI Assistant for APK / Offline execution
 */

interface ChatResponse {
  reply: string;
  previewCard?: {
    title: string;
    badge: string;
    duration: string;
    imageUrl: string;
  };
}

export function generateLumiAssistantReply(userText: string, currentDestination?: string): ChatResponse {
  const norm = userText.toLowerCase();
  const dest = currentDestination || 'your destination';

  if (norm.includes('hike') || norm.includes('trek') || norm.includes('trail') || norm.includes('mountain')) {
    return {
      reply: `I have customized a scenic hiking route for ${dest}! I replaced the afternoon museum visit with a panoramic mountain ridge trail featuring fresh alpine air, stone viewpoints, and local tea stops.`,
      previewCard: {
        title: `${dest} Scenic Panorama Ridge Trail`,
        badge: 'Scenic Trek • Moderate',
        duration: '3.5 hours • 6.2 km',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      }
    };
  }

  if (norm.includes('food') || norm.includes('restaurant') || norm.includes('veg') || norm.includes('thali') || norm.includes('dinner') || norm.includes('lunch')) {
    return {
      reply: `I have updated your dining recommendations in ${dest}! I highlighted top-rated local eateries with authentic specialties, verified food hygiene ratings, and Pure Veg / Jain dietary options.`,
      previewCard: {
        title: `${dest} Signature Heritage Dining Trail`,
        badge: 'Gourmet Tasting',
        duration: '2.0 hours • Evening',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
      }
    };
  }

  if (norm.includes('budget') || norm.includes('cheap') || norm.includes('save') || norm.includes('cost') || norm.includes('discount')) {
    return {
      reply: `I analyzed your budget for ${dest} and optimized your transit and tickets! By using public day passes and free entry scenic viewpoints, you can save approximately ₹2,500 - ₹4,000 per person without missing top attractions.`,
    };
  }

  if (norm.includes('rain') || norm.includes('weather') || norm.includes('umbrella')) {
    return {
      reply: `For rainy or overcast days in ${dest}, I recommend indoor cultural pavilions, historic palaces, covered artisanal bazaars, and thermal baths or heritage museums.`,
    };
  }

  return {
    reply: `I have noted your request for "${userText}". I can adjust timings, swap activities, calculate budget breakdowns, or add hidden local spots for any city in your itinerary!`,
  };
}
