import { TripItinerary, DayItinerary, ItineraryActivity, HotelRecommendation, RestaurantRecommendation } from '../types';
import { getAccuratePhotoUrl } from './photoResolver';

interface GenerationInput {
  from?: string;
  destination: string;
  departure?: string;
  days: number;
  budgetINR?: string;
  travellers?: string;
  tripStartTime?: string;
  tripEndTime?: string;
}

// Comprehensive destination knowledge base with authentic landmarks, authentic food spots, and local transit
const DESTINATION_INSIGHTS: Record<string, {
  state: string;
  country: string;
  weather: { temp: string; condition: string };
  avgHotelPerNight: number;
  popularPlaces: {
    title: string;
    description: string;
    time: string;
    duration: string;
    costBadgeText: string;
    costBadgeClass: string;
    tags: { icon: string; text: string; colorClass: string }[];
    localTip: string;
    openingHours: string;
    ticketPrice: string;
    dietaryType?: 'Pure Veg' | 'Jain Friendly' | 'Non-Veg';
    nearbyPlaces: string[];
    recommendedRestaurant: {
      name: string;
      cuisine: string;
      estimatedCost: string;
      dietaryType: string;
    };
    transit: {
      method: string;
      publicTransports: string[];
      fare: string;
    };
  }[];
  hotels: { name: string; rating: string; priceMultiplier: number; vibe: string; amenities: string[] }[];
  restaurants: { name: string; cuisine: string; specialty: string; price: string; badge: 'Pure Veg 🥦' | 'Jain Available 🪷' | 'Non-Veg 🍗' | 'Halal 🌙' }[];
}> = {
  sikar: {
    state: 'Rajasthan',
    country: 'India',
    weather: { temp: '26°C', condition: 'Sunny & Pleasant' },
    avgHotelPerNight: 2800,
    popularPlaces: [
      {
        title: 'Shri Khatu Shyam Ji Temple Darshan',
        description: 'Sacred pilgrimage to the divine shrine of Barbarika (Khatu Shyam Ji), renowned for immense spiritual devotion, floral chattris, and evening Aarti.',
        time: '06:30 AM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'Free Darshan',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'temple_hindu', text: 'Spiritual', colorClass: 'bg-amber-100 text-amber-800' },
          { icon: 'favorite', text: 'High Energy', colorClass: 'bg-rose-100 text-rose-800' }
        ],
        localTip: 'Join the early morning VIP / online booking queue to avoid rush on Ekadashi days.',
        openingHours: '05:00 AM - 12:30 PM, 04:00 PM - 09:30 PM',
        ticketPrice: 'Free General Entry / ₹250 Sugam Darshan Pass',
        dietaryType: 'Pure Veg',
        nearbyPlaces: ['Shyam Kund Holy Pond', 'Toran Dwar Entrance', 'Khatu Bazaar Sweet Alley'],
        recommendedRestaurant: {
          name: 'Radhe Radhe Bhojanalaya & Sweets',
          cuisine: 'Pure Ghee Marwari Thali & Rabri',
          estimatedCost: '₹350 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'E-Rickshaw / Auto from Ringas Junction',
          publicTransports: ['RSRTC Express Bus', 'Shyam Yatra E-Rickshaw', 'Local Cab'],
          fare: '₹50 - ₹120'
        }
      },
      {
        title: 'Shyam Kund Holy Water Dipping & Floral Offerings',
        description: 'Holy pond where the sacred head of Shyam Baba appeared. Devotees take holy snan and purchase fresh Nishan flags.',
        time: '11:00 AM • 1.5 hrs',
        duration: '1.5 hrs',
        costBadgeText: 'Free',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'water_drop', text: 'Sacred Dip', colorClass: 'bg-cyan-100 text-cyan-800' }
        ],
        localTip: 'Buy authentic Shyam Nishan flags from traditional shops near the Kund gate.',
        openingHours: '06:00 AM - 08:00 PM',
        ticketPrice: 'Free Entry',
        nearbyPlaces: ['Gauri Shankar Temple', 'Samadhi Sthal'],
        recommendedRestaurant: {
          name: 'Govindam Pure Veg Family Restaurant',
          cuisine: 'Rajasthani Dal Baati Churma & Lassi',
          estimatedCost: '₹400 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'Short Walking Distance from Mandir Complex',
          publicTransports: ['Foot Path', 'Pedestrian Walkway'],
          fare: 'Free'
        }
      },
      {
        title: 'Harshnath Temple & Mountain Vista Stroll',
        description: 'Ancient 10th-century Shiva temple ruins perched atop Harsh Mountain offering panoramic views of the Aravalli hills.',
        time: '04:30 PM • 2.5 hrs',
        duration: '2.5 hrs',
        costBadgeText: 'Free Scenic Spot',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'landscape', text: 'Hill View', colorClass: 'bg-green-100 text-green-800' },
          { icon: 'history_edu', text: '10th Century Ruins', colorClass: 'bg-purple-100 text-purple-800' }
        ],
        localTip: 'Carry a light windcheater; hilltop winds are refreshing during sunset.',
        openingHours: '06:00 AM - 06:30 PM',
        ticketPrice: 'Free Entry',
        nearbyPlaces: ['Aravalli Sunset Ridge', 'Bheru Ji Temple Harsh'],
        recommendedRestaurant: {
          name: 'Shree Krishna Dhaba & Rooftop',
          cuisine: 'Desi Ghee Paneer Butter & Tandoori Roti',
          estimatedCost: '₹300 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'Hired Taxi / Self Drive car up the ghat road',
          publicTransports: ['Private Taxi', 'Bike Rental'],
          fare: '₹400 - ₹700 return'
        }
      }
    ],
    hotels: [
      { name: 'Hotel Shyam Darbar Heritage', rating: '4.8 ★', priceMultiplier: 1.2, vibe: '100m from Khatu Mandir with Pure Veg Kitchen', amenities: ['Free Wi-Fi', 'Room Service', 'Sugam Darshan Desk'] },
      { name: 'Radhey Ki Haveli Sikar', rating: '4.6 ★', priceMultiplier: 1.6, vibe: 'Traditional Shekhawati Fresco Palace Stay', amenities: ['Courtyard Garden', 'Pure Veg Buffet', 'Free Parking'] },
      { name: 'Hotel Royal Inn Sikar', rating: '4.4 ★', priceMultiplier: 0.9, vibe: 'Clean Modern Stay near Sikar Railway Station', amenities: ['AC Deluxe Rooms', 'Lift', '24/7 Hot Water'] }
    ],
    restaurants: [
      { name: 'Shyam Rasoi Pure Veg', cuisine: 'Traditional Marwari Thali', specialty: 'Dal Baati Churma with Gatte ki Sabzi', price: '₹350 for two', badge: 'Pure Veg 🥦' },
      { name: 'Khatu Peda & Rabri House', cuisine: 'Local Milk Sweets', specialty: 'Hot Khatu Mawa Peda & Kesar Milk', price: '₹180 for two', badge: 'Pure Veg 🥦' },
      { name: 'Shekhawati Heritage Restaurant', cuisine: 'North Indian & Rajasthani', specialty: 'Ker Sangri & Missi Roti', price: '₹600 for two', badge: 'Jain Available 🪷' }
    ]
  },
  churu: {
    state: 'Rajasthan',
    country: 'India',
    weather: { temp: '25°C', condition: 'Clear Sky & Breezy' },
    avgHotelPerNight: 2400,
    popularPlaces: [
      {
        title: 'Salasar Balaji Temple Darshan & Savamani Offerings',
        description: 'Revered holy temple of Lord Hanuman with the unique bearded face idol (Dadhi Mooch Wale Balaji) in Salasar.',
        time: '07:00 AM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'Free Entry',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'temple_hindu', text: 'Revered Shrine', colorClass: 'bg-amber-100 text-amber-800' }
        ],
        localTip: 'Book Savamani Laddu Prasad token in advance at the trust counter.',
        openingHours: '05:00 AM - 10:00 PM',
        ticketPrice: 'Free General Darshan',
        dietaryType: 'Pure Veg',
        nearbyPlaces: ['Anjani Mata Temple', 'Salasar Gaushala', 'Balaji Temple Complex Garden'],
        recommendedRestaurant: {
          name: 'Balaji Annakshetra & Bhawani Bhojanalaya',
          cuisine: 'Desi Ghee Churma & Besan Laddu',
          estimatedCost: '₹300 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'RSRTC Bus / Private Cab from Sujangarh / Churu',
          publicTransports: ['Express Buses', 'Local Taxi'],
          fare: '₹80 - ₹200'
        }
      },
      {
        title: 'Tal Chhapar Blackbuck Sanctuary Safari',
        description: 'World-famous open grassland sanctuary home to thousands of leaping Blackbucks, Harriers, and desert migratory birds.',
        time: '03:30 PM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'Entry ₹50',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        tags: [
          { icon: 'nature', text: 'Wildlife Safari', colorClass: 'bg-emerald-100 text-emerald-800' },
          { icon: 'camera_alt', text: 'Bird Photography', colorClass: 'bg-indigo-100 text-indigo-800' }
        ],
        localTip: 'Late afternoon safari from 3:30 PM gives the best golden hour lighting for blackbuck herds.',
        openingHours: '06:00 AM - 06:00 PM',
        ticketPrice: '₹50 Forest Entry + ₹400 Guide / Gypsy option',
        nearbyPlaces: ['Chhapar Grasslands', 'Dronpur Pond'],
        recommendedRestaurant: {
          name: 'Chhapar Nature Retreat Cafe',
          cuisine: 'Fresh Tea, Masala Snacks & Rajasthani Thali',
          estimatedCost: '₹250 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'Cab or Shared Auto from Chhapar Railway Station',
          publicTransports: ['Local Jeep', 'State Transport'],
          fare: '₹50 - ₹150'
        }
      }
    ],
    hotels: [
      { name: 'Hotel Balaji Dham Salasar', rating: '4.7 ★', priceMultiplier: 1.1, vibe: 'Direct walkway access to Salasar Temple', amenities: ['Pure Veg Food', 'AC Rooms', 'Car Parking'] },
      { name: 'Malji Ka Kamra Heritage Resort', rating: '4.8 ★', priceMultiplier: 1.8, vibe: '100-year-old restored Turquoise Shekhawati Haveli', amenities: ['Heritage Courtyard', 'Cultural Evenings', 'Fine Dining'] }
    ],
    restaurants: [
      { name: 'Salasar Laddu & Peda Bhandar', cuisine: 'Fresh Traditional Sweets', specialty: 'Hot Motichoor Laddu in Desi Ghee', price: '₹200 for two', badge: 'Pure Veg 🥦' },
      { name: 'Marwar Swad Bhojanalaya', cuisine: 'Pure Rajasthani Veg', specialty: 'Ker Sangri, Bajra Roti & Garlic Chutney', price: '₹400 for two', badge: 'Pure Veg 🥦' }
    ]
  },
  goa: {
    state: 'Goa',
    country: 'India',
    weather: { temp: '29°C', condition: 'Sunny & Tropical Sea Breeze' },
    avgHotelPerNight: 4200,
    popularPlaces: [
      {
        title: 'Baga & Calangute Beach Watersports Adventure',
        description: 'Parasailing, jet-ski rides, banana boat fun, and relaxing at energetic beach shacks with cold drinks and music.',
        time: '09:30 AM • 3.5 hrs',
        duration: '3.5 hrs',
        costBadgeText: '₹1,500 Package',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        tags: [
          { icon: 'surfing', text: 'Watersports', colorClass: 'bg-cyan-100 text-cyan-800' },
          { icon: 'beach_access', text: 'Coastline', colorClass: 'bg-amber-100 text-amber-800' }
        ],
        localTip: 'Negotiate combo watersport packages directly at government-approved lifeguard counters on Baga Beach.',
        openingHours: '08:00 AM - 06:30 PM',
        ticketPrice: 'Free Beach Entry / Watersports ₹1,200 - ₹2,000',
        dietaryType: 'Non-Veg',
        nearbyPlaces: ['Tito’s Lane', 'Brittos Shack', 'Calangute Market'],
        recommendedRestaurant: {
          name: 'Brittos Seaside Shack',
          cuisine: 'Goan Fish Curry, Butter Garlic Crab & Veg Caldine',
          estimatedCost: '₹800 per person',
          dietaryType: 'Seafood & Veg Available'
        },
        transit: {
          method: 'Rented Scooty / Auto / Taxi',
          publicTransports: ['Goa Kadamba Bus', 'Self-Drive Activa'],
          fare: '₹400/day scooty rent'
        }
      },
      {
        title: 'Aguada Fort & Historic Portuguese Lighthouse',
        description: '17th-century Portuguese fortress standing over the Arabian Sea with panoramic views and historic ramparts.',
        time: '04:00 PM • 2.5 hrs',
        duration: '2.5 hrs',
        costBadgeText: 'Entry ₹25',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'fort', text: 'Heritage Fortress', colorClass: 'bg-purple-100 text-purple-800' },
          { icon: 'wb_sunny', text: 'Sunset View', colorClass: 'bg-orange-100 text-orange-800' }
        ],
        localTip: 'Visit between 4:30 PM and 6:00 PM for the coolest sea breeze and gorgeous sunset photography.',
        openingHours: '09:00 AM - 06:00 PM',
        ticketPrice: '₹25 ASI Entry',
        nearbyPlaces: ['Sinquerim Beach', 'Aguada Jail Museum', 'Lower Fort Wall'],
        recommendedRestaurant: {
          name: 'Cohiba & Sunset Deck Candolim',
          cuisine: 'Goan Portuguese Fusion & Mocktails',
          estimatedCost: '₹750 per person',
          dietaryType: 'Non-Veg & Veg'
        },
        transit: {
          method: 'Scooty / Self-drive Car up Sinquerim Hill',
          publicTransports: ['Scooty', 'Private Cab'],
          fare: '₹150 - ₹300'
        }
      },
      {
        title: 'Anjuna Beach Cliff Sunset & Flea Market Stroll',
        description: 'Vibrant cliffside views, boho clothing stalls, acoustic live music, and iconic sunset shacks.',
        time: '06:00 PM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'Free Entry',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'nightlife', text: 'Sunset Vibe', colorClass: 'bg-rose-100 text-rose-800' }
        ],
        localTip: 'Book a cliff-facing table at Curlies or Shiva Valley around 5:30 PM.',
        openingHours: 'Open 24 Hours (Shacks till 11:30 PM)',
        ticketPrice: 'Free Entry',
        nearbyPlaces: ['Curlies Deck', 'Vagator Hilltop', 'Anjuna Flea Market'],
        recommendedRestaurant: {
          name: 'Curlies Sunset Shack & Grill',
          cuisine: 'Goan Coastal & Woodfired Pizza',
          estimatedCost: '₹650 per person',
          dietaryType: 'Multi-Cuisine'
        },
        transit: {
          method: 'Scooty through Anjuna village roads',
          publicTransports: ['Rental Bike', 'GoaMiles Taxi'],
          fare: '₹50'
        }
      }
    ],
    hotels: [
      { name: 'W Goa Vagator Coastal Resort', rating: '4.9 ★', priceMultiplier: 2.5, vibe: 'Ultra-Luxury Cliffside Beach Resort', amenities: ['Infinity Pool', 'Spa', 'Rock Pool Bar'] },
      { name: 'BloomSuites Calangute', rating: '4.6 ★', priceMultiplier: 1.1, vibe: 'Modern Boutique Hotel near Calangute Beach', amenities: ['Swimming Pool', 'Buffet Breakfast', 'Free High-speed Wi-Fi'] },
      { name: 'Zostel Goa (Morjim / Anjuna)', rating: '4.7 ★', priceMultiplier: 0.5, vibe: 'Fun Social Hostel with Pool & Coworking', amenities: ['Cafe', 'Community Games', 'Scooty Rental Desk'] }
    ],
    restaurants: [
      { name: 'Fisherman’s Wharf Panjim / Salcete', cuisine: 'Authentic Goan Seafood', specialty: 'Goan Prawn Curry & Butter Garlic Squid', price: '₹1,400 for two', badge: 'Non-Veg 🍗' },
      { name: 'Navtara Pure Veg Restaurant', cuisine: 'Pure Veg South & North Indian', specialty: 'Special Ghee Dosa & Veg Thali', price: '₹450 for two', badge: 'Pure Veg 🥦' },
      { name: 'Thalassa Greek Taverna Siolim', cuisine: 'Mediterranean & Sunset Cocktails', specialty: 'Souvlaki & Fresh Baklava', price: '₹2,200 for two', badge: 'Non-Veg 🍗' }
    ]
  }
};

/**
 * Robust Client-Side Trip Synthesizer for Android Native & Web
 * Generates tailored, dynamic itineraries, realistic budget totals, hotel tiers, and activities for ANY destination.
 */
export function synthesizeTripItinerary(input: GenerationInput): TripItinerary {
  const rawDest = (input.destination || 'Kyoto, Japan').trim();
  const lowerDest = rawDest.toLowerCase();
  const daysCount = Math.max(1, Math.min(30, input.days || 3));
  const travellersCount = input.travellers?.includes('1') ? 1 : input.travellers?.includes('Group') ? 4 : input.travellers?.includes('Family') ? 4 : 2;

  // Check if we have specialized knowledge for destination
  const matchedKey = Object.keys(DESTINATION_INSIGHTS).find((k) => lowerDest.includes(k));
  const insight = matchedKey ? DESTINATION_INSIGHTS[matchedKey] : null;

  // Clean city title
  const cityTitle = rawDest.split(',')[0].replace(/\(.*?\)/g, '').trim() || 'Custom Destination';
  const destPhoto = getAccuratePhotoUrl(rawDest, 'destination');

  // Budget calculations
  let baseDailyHotelINR = insight ? insight.avgHotelPerNight : 3800;
  let parsedBudget = parseInt(input.budgetINR?.replace(/[^0-9]/g, '') || '45000');
  if (isNaN(parsedBudget) || parsedBudget <= 0) parsedBudget = 45000;

  const totalNights = Math.max(1, daysCount - 1);
  const calculatedHotelsINR = Math.round(baseDailyHotelINR * totalNights);
  const calculatedFoodINR = Math.round(750 * daysCount * travellersCount);
  const calculatedActivitiesINR = Math.round(600 * daysCount * travellersCount);
  const calculatedTransportINR = Math.round(450 * daysCount * travellersCount);
  const totalCalculatedINR = calculatedHotelsINR + calculatedFoodINR + calculatedActivitiesINR + calculatedTransportINR;

  // Construct day-by-day plans
  const dayItineraries: DayItinerary[] = [];

  const genericThemes = [
    'Arrival, Historic City Center & Sunset Vista',
    'Cultural Heritage, Ancient Temples & Local Delicacies',
    'Scenic Nature Walks, Waterways & Artisan Markets',
    'Panoramas, Fortresses & Authentic Regional Cuisine',
    'Hidden Neighborhoods, Shopping & Farewell Dinner'
  ];

  for (let d = 1; d <= daysCount; d++) {
    const dayTheme = genericThemes[(d - 1) % genericThemes.length];
    
    // Pick activities from database if matched, or synthesize authentic items
    let morningActivity: ItineraryActivity;
    let afternoonActivity: ItineraryActivity;
    let eveningActivity: ItineraryActivity;

    if (insight && insight.popularPlaces.length > 0) {
      const p1 = insight.popularPlaces[(d * 2 - 2) % insight.popularPlaces.length];
      const p2 = insight.popularPlaces[(d * 2 - 1) % insight.popularPlaces.length];

      morningActivity = {
        id: `act-${d}-1`,
        title: p1.title,
        description: p1.description,
        time: p1.time,
        duration: p1.duration,
        costBadgeText: p1.costBadgeText,
        costBadgeClass: p1.costBadgeClass,
        imageUrl: getAccuratePhotoUrl(`${cityTitle} ${p1.title}`, 'activity'),
        tags: p1.tags,
        localTip: p1.localTip,
        openingHours: p1.openingHours,
        ticketPrice: p1.ticketPrice,
        dietaryType: p1.dietaryType,
        nearbyPlaces: p1.nearbyPlaces,
        recommendedRestaurant: p1.recommendedRestaurant,
        transitInfo: {
          recommendedMethod: p1.transit.method,
          applicablePublicTransport: p1.transit.publicTransports,
          estimatedFare: p1.transit.fare
        }
      };

      afternoonActivity = {
        id: `act-${d}-2`,
        title: `Authentic Local Dining & Cultural Stroll in ${cityTitle}`,
        description: `Savor popular signature dishes, sweet delicacies, and regional refreshments at top-rated local eateries in ${cityTitle}.`,
        time: '01:30 PM • 2.0 hrs',
        duration: '2.0 hrs',
        costBadgeText: '₹350 - ₹600',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        imageUrl: getAccuratePhotoUrl(`${cityTitle} traditional food dining`, 'activity'),
        tags: [
          { icon: 'restaurant', text: 'Regional Delicacies', colorClass: 'bg-amber-100 text-amber-800' },
          { icon: 'star', text: 'Must Taste', colorClass: 'bg-purple-100 text-purple-800' }
        ],
        localTip: `"Try the hot regional specialties fresh from the kitchen."`,
        openingHours: '11:00 AM - 11:00 PM',
        ticketPrice: 'Meal Cost Only',
        nearbyPlaces: [`${cityTitle} Central Market`, 'Sweet Alleys', 'Handicraft Plaza'],
        recommendedRestaurant: p1.recommendedRestaurant,
        transitInfo: {
          recommendedMethod: 'Short walk or local Auto',
          applicablePublicTransport: ['Local Auto', 'Walking'],
          estimatedFare: '₹30 - ₹60'
        }
      };

      eveningActivity = {
        id: `act-${d}-3`,
        title: p2.title,
        description: p2.description,
        time: p2.time,
        duration: p2.duration,
        costBadgeText: p2.costBadgeText,
        costBadgeClass: p2.costBadgeClass,
        imageUrl: getAccuratePhotoUrl(`${cityTitle} ${p2.title}`, 'activity'),
        tags: p2.tags,
        localTip: p2.localTip,
        openingHours: p2.openingHours,
        ticketPrice: p2.ticketPrice,
        nearbyPlaces: p2.nearbyPlaces,
        recommendedRestaurant: p2.recommendedRestaurant,
        transitInfo: {
          recommendedMethod: p2.transit.method,
          applicablePublicTransport: p2.transit.publicTransports,
          estimatedFare: p2.transit.fare
        }
      };
    } else {
      // Dynamic synthesis for any city globally
      morningActivity = {
        id: `act-${d}-1`,
        title: d === 1 ? `Arrival & ${cityTitle} Heritage Center` : `${cityTitle} Grand Landmark & Scenic Discovery`,
        description: `Explore the celebrated architectural marvels, historic quarters, and cultural icons of ${cityTitle}.`,
        time: '09:00 AM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'Free Entry',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        imageUrl: getAccuratePhotoUrl(`${cityTitle} landmark architecture`, 'activity'),
        tags: [
          { icon: 'explore', text: 'Top Sight', colorClass: 'bg-blue-100 text-blue-800' },
          { icon: 'camera_alt', text: 'Photo Spot', colorClass: 'bg-emerald-100 text-emerald-800' }
        ],
        localTip: `"Start early around 9:00 AM to enjoy comfortable weather and pleasant photography light."`,
        openingHours: '08:00 AM - 06:00 PM',
        ticketPrice: 'Free General Access',
        nearbyPlaces: [`${cityTitle} Clock Tower`, `${cityTitle} Public Gardens`, 'Heritage Plaza'],
        recommendedRestaurant: {
          name: `${cityTitle} Heritage Cafe`,
          cuisine: 'Fresh Breakfast, Artisanal Tea & Pastries',
          estimatedCost: '₹300 per person',
          dietaryType: 'Pure Veg & Non-Veg'
        },
        transitInfo: {
          recommendedMethod: 'Local Metro, Auto or City Taxi',
          applicablePublicTransport: ['Metro Line 1', 'App Cab', 'Auto'],
          estimatedFare: '₹50 - ₹150'
        }
      };

      afternoonActivity = {
        id: `act-${d}-2`,
        title: `Signature Culinary Tasting & Market Walk`,
        description: `Taste the authentic spices, savory specialties, and traditional sweet delicacies of ${cityTitle}.`,
        time: '01:30 PM • 2.0 hrs',
        duration: '2.0 hrs',
        costBadgeText: 'Moderate',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        imageUrl: getAccuratePhotoUrl(`${cityTitle} local food market`, 'activity'),
        tags: [
          { icon: 'restaurant_menu', text: 'Foodie Trail', colorClass: 'bg-amber-100 text-amber-800' }
        ],
        openingHours: '11:00 AM - 10:30 PM',
        ticketPrice: '₹300 - ₹600 per meal',
        nearbyPlaces: [`${cityTitle} Spice Lane`, 'Crafts Quarter', 'Artisanal Alley'],
        recommendedRestaurant: {
          name: `${cityTitle} Traditional Rasoi`,
          cuisine: 'Authentic Local Specialities & Thalis',
          estimatedCost: '₹450 per person',
          dietaryType: 'Pure Veg Available'
        },
        transitInfo: {
          recommendedMethod: 'Walking in central district',
          applicablePublicTransport: ['Foot Path', 'Rickshaw'],
          estimatedFare: '₹30'
        }
      };

      eveningActivity = {
        id: `act-${d}-3`,
        title: d === daysCount ? `Farewell Sunset Promenade & Celebration` : `${cityTitle} Sunset Viewpoint & Evening Bazaar`,
        description: `Experience the golden hour sunset followed by illuminated evening markets, cultural street music, and souvenir shopping.`,
        time: '06:00 PM • 2.5 hrs',
        duration: '2.5 hrs',
        costBadgeText: 'Free Access',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        imageUrl: getAccuratePhotoUrl(`${cityTitle} sunset viewpoint`, 'activity'),
        tags: [
          { icon: 'wb_twilight', text: 'Sunset Vibe', colorClass: 'bg-orange-100 text-orange-800' },
          { icon: 'shopping_bag', text: 'Local Bazaar', colorClass: 'bg-purple-100 text-purple-800' }
        ],
        localTip: `"Best viewpoint for evening golden hour photos."`,
        openingHours: '05:00 PM - 11:00 PM',
        ticketPrice: 'Free Public Area',
        nearbyPlaces: ['Promenade Pier', 'Illuminated Fountain Plaza', 'Craft Stalls'],
        recommendedRestaurant: {
          name: `${cityTitle} Sunset Rooftop Dining`,
          cuisine: 'Multi-Cuisine & Regional Fusion',
          estimatedCost: '₹700 per person',
          dietaryType: 'Multi-Cuisine'
        },
        transitInfo: {
          recommendedMethod: 'Cab or Auto to Viewpoint',
          applicablePublicTransport: ['City Auto', 'Cab'],
          estimatedFare: '₹80 - ₹180'
        }
      };
    }

    dayItineraries.push({
      dayNumber: d,
      sections: [
        {
          period: 'Morning',
          activities: [morningActivity]
        },
        {
          period: 'Afternoon',
          activities: [afternoonActivity]
        },
        {
          period: 'Evening',
          activities: [eveningActivity]
        }
      ]
    });
  }

  // Construct hotels
  const hotels: HotelRecommendation[] = insight
    ? insight.hotels.map((h) => ({
        name: h.name,
        rating: h.rating,
        pricePerNight: `₹${Math.round(baseDailyHotelINR * h.priceMultiplier).toLocaleString('en-IN')} / night`,
        vibe: h.vibe,
        imageUrl: getAccuratePhotoUrl(`${cityTitle} ${h.name}`, 'hotel'),
        amenities: h.amenities
      }))
    : [
        {
          name: `Grand Palace & Suites ${cityTitle}`,
          rating: '4.8 ★',
          pricePerNight: `₹${Math.round(baseDailyHotelINR * 1.3).toLocaleString('en-IN')} / night`,
          vibe: 'Prime Location with Pool, Rooftop Dining & Spa',
          imageUrl: getAccuratePhotoUrl(`${cityTitle} luxury hotel`, 'hotel'),
          amenities: ['Free Wi-Fi', 'Swimming Pool', 'Complimentary Breakfast', 'Airport Shuttle']
        },
        {
          name: `${cityTitle} Heritage Boutique Hotel`,
          rating: '4.6 ★',
          pricePerNight: `₹${Math.round(baseDailyHotelINR * 0.9).toLocaleString('en-IN')} / night`,
          vibe: 'Charming Architecture & Cozy Garden Courtyard',
          imageUrl: getAccuratePhotoUrl(`${cityTitle} boutique hotel`, 'hotel'),
          amenities: ['Free Breakfast', '24/7 Hot Water', 'Travel Desk', 'Room Service']
        }
      ];

  // Construct restaurants
  const restaurants: RestaurantRecommendation[] = insight
    ? insight.restaurants
    : [
        {
          name: `${cityTitle} Heritage Dining Room`,
          cuisine: 'Traditional Regional & North Indian',
          specialty: 'Chef’s Royal Tasting Thali',
          priceRange: '₹800 for two',
          dietaryBadge: 'Pure Veg 🥦'
        },
        {
          name: `${cityTitle} Spice & Grill Courtyard`,
          cuisine: 'Local Flavors & Charcoal Grills',
          specialty: 'Woodfired Specialties & Fresh Breads',
          priceRange: '₹1,200 for two',
          dietaryBadge: 'Non-Veg 🍗'
        }
      ];

  return {
    id: `trip-${Date.now()}`,
    destination: rawDest,
    dates: input.departure ? `${input.departure} • ${daysCount} Days` : `Next Month • ${daysCount} Days`,
    from: input.from || 'Current Location',
    travellers: input.travellers || `${travellersCount} Travellers`,
    status: 'Ongoing',
    imageUrl: destPhoto,
    weather: insight ? insight.weather : { temp: '25°C', condition: 'Pleasant & Sunny' },
    budgetSummary: {
      hotelsCost: `₹${calculatedHotelsINR.toLocaleString('en-IN')}`,
      foodCost: `₹${calculatedFoodINR.toLocaleString('en-IN')}`,
      activitiesCost: `₹${calculatedActivitiesINR.toLocaleString('en-IN')}`,
      transportCost: `₹${calculatedTransportINR.toLocaleString('en-IN')}`,
      totalEstimatedCost: `₹${totalCalculatedINR.toLocaleString('en-IN')}`,
    },
    hotels,
    restaurants,
    nearbyAttractions: [
      `${cityTitle} Historic Square`,
      `${cityTitle} Scenic Hilltop`,
      'Central Bazaar & Handicraft Street',
      'Artisan Food Alley'
    ],
    dayItineraries
  };
}
