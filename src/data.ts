import { RecentTrip, DreamDestination, DayItinerary, ExpenseItem, ChatMessage, TripItinerary } from './types';
import { getAccuratePhotoUrl } from './utils/photoResolver';
import { synthesizeTripItinerary } from './utils/tripSynthesizer';

export const USER_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80";

export const INITIAL_RECENT_TRIPS: RecentTrip[] = [
  {
    id: '1',
    destination: 'Goa Beaches & Nightlife',
    dates: 'Oct 12 - Oct 16',
    travellers: '3 Friends',
    status: 'Ongoing',
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
  },
  {
    id: '2',
    destination: 'Jaipur & Udaipur Heritage',
    dates: 'Nov 02 - Nov 08',
    travellers: 'Family (4)',
    status: 'Completed',
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
  },
  {
    id: '3',
    destination: 'Leh Ladakh Expedition',
    dates: 'Jun 15 - Jun 23',
    travellers: 'Solo Traveller',
    status: 'Draft',
    imageUrl: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80",
  },
  {
    id: '4',
    destination: 'Bangkok & Phuket (Thailand)',
    dates: 'Dec 20 - Dec 27',
    travellers: 'Couple',
    status: 'Draft',
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  }
];

export const INITIAL_DREAM_DESTINATIONS: DreamDestination[] = [
  {
    id: 's1',
    title: 'Goa Sunsets & Shacks',
    estimatedBudgetINR: 22000,
    bookmarked: true,
    dietaryTags: ['Veg Friendly 🥦', 'Seafood 🦐', 'Beach Bars 🍹'],
    bestSeason: 'Oct - Mar',
    visaInfo: 'No Visa Required',
    tags: [
      { text: 'BEACH PARTY', colorClass: 'bg-amber-100 text-amber-800' },
      { text: 'BUDGET FRIENDLY', colorClass: 'bg-emerald-100 text-emerald-800' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
  },
  {
    id: 's2',
    title: 'Kerala Backwaters & Munnar',
    estimatedBudgetINR: 32000,
    bookmarked: true,
    dietaryTags: ['Pure Veg Available 🥦', 'Jain Meal 🪷'],
    bestSeason: 'Sep - Feb',
    visaInfo: 'No Visa Required',
    tags: [
      { text: 'NATURE & HOUSEBOAT', colorClass: 'bg-green-100 text-green-800' },
      { text: 'FAMILY FAVORITE', colorClass: 'bg-blue-100 text-blue-800' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
  },
  {
    id: 's3',
    title: 'Jaipur & Udaipur Palaces',
    estimatedBudgetINR: 28000,
    bookmarked: false,
    dietaryTags: ['Pure Veg Thali 🥦', 'Jain Friendly 🪷'],
    bestSeason: 'Oct - Mar',
    visaInfo: 'No Visa Required',
    tags: [
      { text: 'ROYAL HERITAGE', colorClass: 'bg-purple-100 text-purple-800' },
      { text: 'PHOTOGRAPHY', colorClass: 'bg-pink-100 text-pink-800' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
  },
  {
    id: 's4',
    title: 'Bangkok & Phuket, Thailand',
    estimatedBudgetINR: 48000,
    bookmarked: true,
    dietaryTags: ['Indian Food Available 🍛', 'Halal / Veg Options'],
    bestSeason: 'Nov - Apr',
    visaInfo: 'Visa-Free Entry for Indians',
    tags: [
      { text: 'VISA-FREE 🇹🇭', colorClass: 'bg-red-100 text-red-800' },
      { text: 'ISLAND HOPPING', colorClass: 'bg-cyan-100 text-cyan-800' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  },
  {
    id: 's5',
    title: 'Dubai Skyline & Desert Safari',
    estimatedBudgetINR: 65000,
    bookmarked: false,
    dietaryTags: ['Pure Veg 🥦', 'Halal 🌙'],
    bestSeason: 'Nov - Mar',
    visaInfo: 'Easy eVisa (3-4 Days)',
    tags: [
      { text: 'LUXURY SHOPPING', colorClass: 'bg-amber-100 text-amber-800' },
      { text: 'DESERT SAFARI', colorClass: 'bg-orange-100 text-orange-800' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  }
];

export const GOA_HEADER_IMG = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80";

export const GOA_ITINERARY: TripItinerary = {
  id: '1',
  destination: 'Goa Beaches & Nightlife',
  dates: 'Oct 12 - Oct 16, 2026',
  from: 'Mumbai (CSMT / BOM)',
  tripStartTime: '06:30 AM (Day 1 Departure)',
  tripEndTime: '09:45 PM (Day 5 Return)',
  travellers: '3 Friends',
  status: 'Ongoing',
  imageUrl: GOA_HEADER_IMG,
  weather: { temp: '29°C', condition: 'Sunny Beach Weather' },
  budgetSummary: {
    hotelsCost: '₹14,500',
    foodCost: '₹8,200',
    activitiesCost: '₹5,500',
    transportCost: '₹3,800',
    totalEstimatedCost: '₹32,000 for 3 people (~₹10,600/person)',
  },
  hotels: [
    {
      name: 'Taj Fort Aguada Resort & Spa',
      rating: '4.9 ★',
      pricePerNight: '₹16,000 / night',
      vibe: 'Luxury Cliffside Beachfront Heritage',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    },
    {
      name: 'BloomSuites @ Calangute',
      rating: '4.7 ★',
      pricePerNight: '₹4,200 / night',
      vibe: 'Vibrant Boutique Stay near Beach & Markets',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    },
  ],
  restaurants: [
    {
      name: 'Thalassa Greek Restaurant (Vagator)',
      cuisine: 'Mediterranean & Greek Sunset Dining',
      specialty: 'Grilled Halloumi & Watermelon Feta Salad',
      priceRange: '₹2,200 for two',
      dietaryBadge: 'Pure Veg 🥦',
    },
    {
      name: 'Souza Lobo (Calangute Beach)',
      cuisine: 'Traditional Goan Curry & Seafood',
      specialty: 'Fish Curry Rice & Veg Xacuti',
      priceRange: '₹1,400 for two',
      dietaryBadge: 'Jain Available 🪷',
    },
  ],
  nearbyAttractions: ['Baga Beach Market', 'Fort Aguada Lighthouse', 'Chapora Fort (Dil Chahta Hai point)', 'Dudhsagar Waterfalls'],
  dayItineraries: [
    {
      dayNumber: 1,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'goa-act-1',
              title: 'Fort Aguada & Aguada Jail Museum',
              time: '09:00 AM • 2 hrs',
              duration: '2.0 hrs',
              startTime: '09:00 AM',
              endTime: '11:00 AM',
              costBadgeText: '₹50 Entry',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Explore the iconic 17th-century Portuguese fortress overlooking the Arabian Sea.',
              imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
              tags: [
                { icon: 'camera', text: 'Sea View Spot', colorClass: 'bg-blue-50 text-blue-700' },
                { icon: 'historic', text: 'Portuguese Heritage', colorClass: 'bg-amber-50 text-amber-700' }
              ],
              localTip: '"Reach before 10 AM to take peaceful photos near the lighthouse before tourist buses arrive."',
              nearbyPlaces: ['Sinquerim Beach', 'Aguada Helipad', 'Lower Fort Wall'],
              recommendedRestaurant: {
                name: 'Koko Bambu Beach Shack',
                cuisine: 'South Indian Breakfast & Filter Coffee',
                estimatedCost: '₹350 per person'
              },
              transitInfo: {
                recommendedMethod: 'Scooter Rental / Pilot Taxi',
                applicablePublicTransport: [
                  'Goa Miles App Taxi',
                  'Self-Drive Scooter / Bike',
                  'Panjim-Candolim Shuttle Bus',
                  'Local Pilot (Motorcycle Taxi)'
                ],
                routeGuidance: 'From Calangute/Candolim: Hire a self-drive scooter (~₹350/day) or take a Goa Miles taxi (~15 mins, ₹250). Local Kadamba shuttle buses run till Candolim stop.'
              }
            }
          ]
        },
        {
          period: 'Afternoon',
          activities: [
            {
              id: 'goa-act-2',
              title: 'Baga & Calangute Water Sports',
              time: '02:00 PM • 3 hrs',
              duration: '3.0 hrs',
              costBadgeText: '₹1,800 Combo',
              costBadgeClass: 'bg-blue-100 text-blue-800',
              description: 'Experience Parasailing, Jet Ski rides, and Banana Boat rides with certified instructors.',
              imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
              tags: [
                { icon: 'surfing', text: 'Adrenaline Rush', colorClass: 'bg-cyan-50 text-cyan-700' },
                { icon: 'verified', text: 'Safety Gear Included', colorClass: 'bg-emerald-50 text-emerald-700' }
              ],
              localTip: '"Bargain for combo tickets if booking for 3+ people to get up to 20% discount."',
              nearbyPlaces: ['Baga Night Market', 'Tito’s Lane', 'Calangute Beach Promenade'],
              recommendedRestaurant: {
                name: 'Brittos Beach Shack',
                cuisine: 'Goan Veg Thali & Paneer Tikka',
                estimatedCost: '₹850 for two'
              },
              transitInfo: {
                recommendedMethod: 'Self-Drive Scooter / Local Bus',
                applicablePublicTransport: [
                  'Mapusa-Calangute Public Bus',
                  'Scooter / Bike Rental',
                  'Goa Miles Taxi',
                  'Shared Auto'
                ],
                routeGuidance: 'From Fort Aguada to Baga Beach: Ride northbound along Aguada-Siolim road on your rental scooter (~18 mins) or take a local Candolim-Baga mini bus (~₹20).'
              }
            }
          ]
        },
        {
          period: 'Evening',
          activities: [
            {
              id: 'goa-act-3',
              title: 'Chapora Fort Sunset (Dil Chahta Hai Point)',
              time: '05:30 PM • 2 hrs',
              duration: '2.0 hrs',
              costBadgeText: 'Free Entry',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Watch the sun dip into the ocean from the famous clifftop fort ruin above Vagator Beach.',
              imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
              tags: [
                { icon: 'wb_sunny', text: 'Top Sunset View', colorClass: 'bg-amber-50 text-amber-700' }
              ],
              nearbyPlaces: ['Vagator Little Beach', 'Thalassa Hilltop', 'Anjuna Flea Market'],
              recommendedRestaurant: {
                name: 'Antares Restaurant & Beach Club',
                cuisine: 'Woodfired Pizzas & Fresh Smoothies',
                estimatedCost: '₹1,500 for two'
              },
              transitInfo: {
                recommendedMethod: 'Scooter / Goa Miles Taxi',
                applicablePublicTransport: [
                  'Panjim-Mapusa-Vagator Public Bus',
                  'Self-Drive Scooter',
                  'Goa Miles Prepaid Cab'
                ],
                routeGuidance: 'From Baga to Chapora Fort (Vagator): Ride along Anjuna-Mapusa road (~20 mins). Parking is available at the fort base, followed by a 10-minute stone staircase walk.'
              }
            }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'goa-act-d2-1',
              title: 'Fontainhas Latin Quarter Walking Tour',
              time: '09:30 AM • 2.5 hrs',
              duration: '2.5 hrs',
              costBadgeText: 'Free Stroll',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Walk through Panjim’s colorful heritage streets with pastel-painted Portuguese villas and cafes.',
              imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
              tags: [
                { icon: 'camera', text: 'Instagrammable Spot', colorClass: 'bg-purple-50 text-purple-700' },
                { icon: 'palette', text: 'Heritage Architecture', colorClass: 'bg-pink-50 text-pink-700' }
              ],
              localTip: '"Stop at Confeitaria 31 De Janeiro for fresh warm Bebinca and Mushroom Patties."',
              nearbyPlaces: ['Our Lady of the Immaculate Conception Church', 'Mandovi River Boardwalk'],
              recommendedRestaurant: {
                name: 'Viva Panjim Heritage Cafe',
                cuisine: 'Pure Veg Goan Meals & Kokum Sharbat',
                estimatedCost: '₹600 for two'
              },
              transitInfo: {
                recommendedMethod: 'Kadamba Bus to Panjim KTC Bus Stand',
                applicablePublicTransport: [
                  'Kadamba AC Public Bus (Mapusa/Panjim route)',
                  'Panjim City EV Buggy',
                  'Local Taxi / Auto',
                  'Walking Tour'
                ],
                routeGuidance: 'To reach Fontainhas from North Goa: Take a Kadamba bus to Panjim KTC Bus Stand (~30 mins, ₹30), then enjoy a 10-minute walk into the Latin Quarter.'
              }
            }
          ]
        }
      ]
    }
  ]
};

export const MUMBAI_HEADER_IMG = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&q=80";

export const MUMBAI_ITINERARY: TripItinerary = {
  id: 'mumbai-1',
  destination: 'Mumbai (South Mumbai Heritage)',
  dates: 'Oct 20 - Oct 25, 2026',
  travellers: '2 Travellers',
  status: 'Ongoing',
  imageUrl: MUMBAI_HEADER_IMG,
  weather: { temp: '30°C', condition: 'Coastal Breeze & Sunny' },
  budgetSummary: {
    hotelsCost: '₹22,000',
    foodCost: '₹9,500',
    activitiesCost: '₹4,000',
    transportCost: '₹3,200',
    totalEstimatedCost: '₹38,700 for 2 people (~₹19,350/person)',
  },
  hotels: [
    {
      name: 'The Taj Mahal Palace (Colaba)',
      rating: '4.9 ★',
      pricePerNight: '₹24,000 / night',
      vibe: 'Iconic 5-Star Seafront Heritage Hotel',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    },
    {
      name: 'Abode Bombay (Colaba)',
      rating: '4.7 ★',
      pricePerNight: '₹5,500 / night',
      vibe: 'Boutique Eco-Stay in Historic South Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    },
  ],
  restaurants: [
    {
      name: 'Bademiya (Colaba)',
      cuisine: 'Famous Mughlai & Rolls',
      specialty: 'Paneer Tikka Roll & Baida Roti',
      priceRange: '₹600 for two',
    },
    {
      name: 'Kyani & Co. (Marine Lines)',
      cuisine: 'Irani Cafe & Parsi Bakery',
      specialty: 'Bun Maska, Irani Chai & Mutton/Veg Cutlet',
      priceRange: '₹350 for two',
    },
  ],
  nearbyAttractions: ['Gateway of India', 'Marine Drive Promenade', 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', 'Colaba Causeway Market'],
  dayItineraries: [
    {
      dayNumber: 1,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'mumb-act-1',
              title: 'Gateway of India & Taj Mahal Palace',
              time: '08:30 AM • 2.5 hrs',
              duration: '2.5 hrs',
              costBadgeText: 'Free Entry',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Marvel at the majestic basalt arch erected overlooking the Arabian Sea, built in 1924.',
              imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
              openingHours: 'Open 24 Hours',
              ticketPrice: 'Free (Ferries to Elephanta ₹260)',
              tags: [
                { icon: 'camera', text: 'Heritage Landmark', colorClass: 'bg-amber-50 text-amber-700' },
                { icon: 'trees', text: 'Sea View', colorClass: 'bg-blue-50 text-blue-700' }
              ],
              localTip: '"Reach early before 9:00 AM for soft morning light and fewer crowd lines near the security gates."',
              nearbyPlaces: ['Colaba Causeway Market', 'Apollo Bunder Pier', 'Kala Ghoda Art District'],
              recommendedRestaurant: {
                name: 'Cafe Mondegar (Monnies)',
                cuisine: 'Iconic retro jukebox cafe with cold brew & breakfasts',
                estimatedCost: '₹700 for two'
              },
              transitInfo: {
                recommendedMethod: 'Kaali-Peeli Taxi / BEST Bus #111 from CSMT Station',
                applicablePublicTransport: [
                  'BEST Bus #111, #123, #138 (Regal Bus Stop)',
                  'Kaali-Peeli Taxi (~₹50 from CSMT)',
                  'Local Train (CSMT Station - 1.8 km)',
                  'Ferry Boat (Apollo Bunder to Elephanta Caves)'
                ],
                routeGuidance: 'To reach Gateway of India from CSMT Station: Take a Kaali-Peeli taxi (~10 mins, ₹50-60) or BEST Bus #111 from CSMT bus depot (12 mins, ₹10).'
              }
            }
          ]
        },
        {
          period: 'Afternoon',
          activities: [
            {
              id: 'mumb-act-2',
              title: 'Marine Drive Coastal Promenade (Queen’s Necklace)',
              time: '02:00 PM • 2.5 hrs',
              duration: '2.5 hrs',
              costBadgeText: 'Free Stroll',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'A 3.6 km long C-shaped boulevard along the Arabian Sea coast, lined with Art Deco heritage buildings.',
              imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80',
              openingHours: 'Open 24 Hours',
              ticketPrice: 'Free Public Promenade',
              tags: [
                { icon: 'wb_sunny', text: 'Coastal Boulevard', colorClass: 'bg-blue-50 text-blue-700' },
                { icon: 'camera', text: 'Art Deco Architecture', colorClass: 'bg-purple-50 text-purple-700' }
              ],
              localTip: '"Sit on the promenade tetra-pods near Nariman Point during high tide for refreshing sea breeze."',
              nearbyPlaces: ['Nariman Point', 'Brabourne Stadium', 'Taraporevala Aquarium', 'Girgaon Chowpatty'],
              recommendedRestaurant: {
                name: 'K Rustom Ice Cream',
                cuisine: 'Famous vintage ice cream sandwich slabs (Mango/Pista/Berry)',
                estimatedCost: '₹90 per sandwich'
              },
              transitInfo: {
                recommendedMethod: 'BEST Bus #103 / #138 or Kaali-Peeli Taxi from Gateway of India',
                applicablePublicTransport: [
                  'BEST Bus #103, #138 (From Regal Cinema Stop to Marine Drive)',
                  'Kaali-Peeli Taxi (~7 mins, ₹40-50)',
                  'Metro Line 3 (Aqua Line - Churchgate Station)',
                  'Western Local Train (Churchgate Station - 500m walk)'
                ],
                routeGuidance: 'To go from Gateway of India to Marine Drive: Board BEST Bus #103 or #138 from Regal Cinema bus stop (~10 mins, ₹15), or take a Kaali-Peeli taxi (~₹40, 7 mins). Alternatively, take a scenic 15-minute walk via Colaba Causeway & Madam Cama Road.'
              }
            }
          ]
        },
        {
          period: 'Evening',
          activities: [
            {
              id: 'mumb-act-3',
              title: 'Girgaon Chowpatty Sunset & Street Food',
              time: '05:30 PM • 2.5 hrs',
              duration: '2.5 hrs',
              costBadgeText: 'Free Stroll',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Experience authentic Mumbai street food (Pav Bhaji, Pani Puri, Bhel Puri) while watching the sunset over the sea.',
              imageUrl: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80',
              openingHours: '4:00 PM - 11:30 PM',
              ticketPrice: 'Free Beach Access',
              tags: [
                { icon: 'utensils', text: 'Street Food Hub', colorClass: 'bg-amber-50 text-amber-700' },
                { icon: 'moon', text: 'Sunset Beach', colorClass: 'bg-pink-50 text-pink-700' }
              ],
              nearbyPlaces: ['Hanging Gardens (Kamla Nehru Park)', 'Babulnath Temple', 'Wilson College'],
              recommendedRestaurant: {
                name: 'Sharma Bhel Puri & Sukh Sagar Pav Bhaji',
                cuisine: 'Legendary Mumbai Pav Bhaji & Kulfi Falooda',
                estimatedCost: '₹300 for two'
              },
              transitInfo: {
                recommendedMethod: 'BEST Bus #108 or Shared Auto/Taxi along Marine Drive Boulevard',
                applicablePublicTransport: [
                  'BEST Bus #108, #123 (Runs along Marine Drive boulevard)',
                  'Kaali-Peeli Taxi (~5 mins from Nariman Point, ₹35)',
                  'Western Railway Local Train (Charni Road Station - 200m walk)',
                  'Shared Auto'
                ],
                routeGuidance: 'To go from Marine Drive (Nariman Point) to Girgaon Chowpatty: Ride BEST Bus #108 northbound along the beach road (8 mins, ₹10), or take a 5-minute taxi (~₹35). You can also walk along the paved boardwalk (1.8 km, 20 mins).'
              }
            }
          ]
        }
      ]
    }
  ]
};

export const KYOTO_HEADER_IMG = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80";

export const KYOTO_ITINERARY: TripItinerary = {
  id: '3',
  destination: 'Kyoto, Japan',
  dates: 'Mar 22 - Mar 30, 2026',
  travellers: '1 Traveller',
  status: 'Draft',
  imageUrl: KYOTO_HEADER_IMG,
  weather: { temp: '18°C', condition: 'Mild & Cherry Blossoms' },
  budgetSummary: {
    hotelsCost: '₹22,500',
    foodCost: '₹14,200',
    activitiesCost: '₹6,800',
    transportCost: '₹5,000',
    totalEstimatedCost: '₹48,500 (~$580 USD)',
  },
  hotels: [
    {
      name: 'The Ritz-Carlton Kyoto',
      rating: '4.9 ★',
      pricePerNight: '₹28,000 / night',
      vibe: 'Luxury Riverside Ryokan Experience',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    },
    {
      name: 'Kyoto Granbell Hotel Gion',
      rating: '4.7 ★',
      pricePerNight: '₹8,500 / night',
      vibe: 'Modern Traditional Heritage Stay',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    },
  ],
  restaurants: [
    {
      name: 'Gion Karyo Kaiseki',
      cuisine: 'Traditional Japanese Kaiseki',
      specialty: 'Seasonal 9-Course Tasting Menu',
      priceRange: '¥12,000 (~₹6,800)',
    },
    {
      name: 'Ippudo Ramen Nishiki',
      cuisine: 'Tonkotsu Ramen & Gyozas',
      specialty: 'Akamaru Shinaji Special',
      priceRange: '¥1,400 (~₹800)',
    },
  ],
  nearbyAttractions: ['Yasaka Shrine', 'Kodai-ji Temple', 'Ninenzaka & Sannenzaka Alleyways', 'Kamogawa River Banks'],
  dayItineraries: [
    {
      dayNumber: 1,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'act-1',
              title: 'Fushimi Inari-taisha',
              time: '08:30 AM • 2.5 hrs',
              duration: '2.5 hrs',
              costBadgeText: 'Free Entry',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Hike through thousands of vibrant orange torii gates up the sacred Mount Inari.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW8tCGnF-8WuLB96NwsBA3OHuv9EqoFgs58fCqdQ1afsHDNE4nF3Ynjly8XwnopyGkJ8-qYOwm57-gO_WfFZS3tOOIAON_b5QDxab8jP-D6mJqT-nN9oCaffAi3dIHcwJ1XmpsgZZguT_eHfJTC3ntpGG6V01DjVcUgMG6NVz8r9tkOIZrxmlNoD_OXk49Kicilk3A9xgRZGM8B_8FEN68KF_umgVk21K7Day7Ja3uEn04NIQa0HEl",
              openingHours: 'Open 24 Hours',
              ticketPrice: 'Free Entry',
              tags: [
                { icon: 'flame', text: 'Moderate Crowd', colorClass: 'bg-purple-50 text-purple-700' },
                { icon: 'camera', text: 'Top Photo Spot', colorClass: 'bg-blue-50 text-blue-700' }
              ],
              localTip: '"Arrive before 8 AM to avoid the main tour groups and get the best photos at the base."',
              nearbyPlaces: ['Inari Mountain Trail', 'Tofuku-ji Temple', 'Fushimi Sake District'],
              recommendedRestaurant: {
                name: 'Kandakaraya Soba',
                cuisine: 'Handcrafted Kitsune Udon & Inari Sushi',
                estimatedCost: '¥1,100 (~₹650)'
              },
              transitInfo: {
                recommendedMethod: 'JR Nara Line (Inari Station)',
                applicablePublicTransport: [
                  'JR Nara Line (Inari Station - 1 min walk)',
                  'Keihan Main Line (Fushimi-Inari Station)',
                  'Kyoto City Bus #105 / Minami 5'
                ],
                routeGuidance: 'From Kyoto Station: Board the JR Nara Line train to Inari Station (5 mins, ¥150). The shrine entrance is directly across the train station exit!'
              }
            }
          ]
        },
        {
          period: 'Afternoon',
          activities: [
            {
              id: 'act-2',
              title: 'Kinkaku-ji (Golden Pavilion)',
              time: '01:30 PM • 1.5 hrs',
              duration: '1.5 hrs',
              costBadgeText: '¥500',
              costBadgeClass: 'bg-blue-100 text-blue-800',
              description: 'A Zen temple in northern Kyoto whose top two floors are completely covered in gold leaf.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAszDG6yiM0rvu20QhkRe2cHkxalByE6-BEW9Yad3b1PfTp_DaKZdAcQczafXvjexx4OOYv2bL2ESIes3iIanEmyK_zbOPH_28xyRxX9X7XDnRMYOYlSp5-C1ixRhuPC8qAERn4byVptn9pZrCljX48dQsnKRM8J41xfI1YV6PuQbh2wukh8sLRIwL6YyebKM4yBCYoF3LLlOb7yIZteFbv4LA89v1BqHtx9xH8TQoM9KLRLac6TrxM",
              openingHours: '9:00 AM - 5:00 PM',
              ticketPrice: '¥500 (~₹280)',
              tags: [
                { icon: 'users', text: 'High Crowd', colorClass: 'bg-red-50 text-red-700' },
                { icon: 'trees', text: 'Garden View', colorClass: 'bg-blue-50 text-blue-700' }
              ],
              localTip: '"Keep your entrance ticket—it\'s an Omamori (charm) for good luck and protection."',
              nearbyPlaces: ['Ryoan-ji Rock Garden', 'Ninna-ji Temple', 'Kinugasa Hill Promenade'],
              recommendedRestaurant: {
                name: 'Kinkaku-ji Itadaki',
                cuisine: 'Japanese Wagyu Beef Hamburg Steaks',
                estimatedCost: '¥1,800 (~₹1,050)'
              },
              transitInfo: {
                recommendedMethod: 'Kyoto City Bus #205 / #101',
                applicablePublicTransport: [
                  'Kyoto City Bus #205, #101 (Kinkakuji-michi Stop)',
                  'Kyoto Subway Karasuma Line (Kitaoji Station + Bus #205)',
                  'Keifuku Randen Tram (Kitanohakubaicho Station)'
                ],
                routeGuidance: 'From Fushimi Inari to Kinkaku-ji: Take Keihan Line to Sanjo Station, then transfer to Kyoto City Bus #59 or #205 directly to Kinkakuji-michi bus stop (~35 mins, ¥230).'
              }
            }
          ]
        },
        {
          period: 'Evening',
          activities: [
            {
              id: 'act-3',
              title: 'Gion District Stroll',
              time: '06:00 PM • 3 hrs',
              duration: '3 hrs',
              costBadgeText: 'Free',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: "Explore Kyoto's famous geisha district with its traditional tea houses and lanterns.",
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiXV9YfKGVrty1tT1HYazvmdZrjV-qerbFNG69oiCbYjICzjwzwLj0R7SUEby3YWVLZuwP-NfWNWAhVrw0a-xDtA5C8OMnZO10MOa88VenrTEzJLGXIiEtKzXurQw6FZrl3Y8nR6aMSskzzHQfO2kSbcYUcBNzMfQoAmcOxCv3engwCTH_4qFb5rsCsffi86tEONQbdx00KD1I-wzBkQt3Waka0vDUZMHVqJL_zMGnNj5qGrwS_DDG",
              openingHours: '5:00 PM - 11:00 PM',
              ticketPrice: 'Free Public District Stroll',
              tags: [
                { icon: 'utensils', text: 'Dining Hub', colorClass: 'bg-purple-50 text-purple-700' },
                { icon: 'moon', text: 'Atmospheric', colorClass: 'bg-blue-50 text-blue-700' }
              ],
              nearbyPlaces: ['Hanamikoji Street', 'Shirakawa Canal', 'Yasaka Pagoda'],
              recommendedRestaurant: {
                name: 'Izakaya Gion Tanto',
                cuisine: 'Okonomiyaki & Teppanyaki',
                estimatedCost: '¥2,500 (~₹1,450)'
              },
              transitInfo: {
                recommendedMethod: 'Keihan Railway (Gion-Shijo Station) / Bus #206',
                applicablePublicTransport: [
                  'Keihan Main Line (Gion-Shijo Station)',
                  'Hankyu Kyoto Line (Kyoto-Kawaramachi Station)',
                  'Kyoto City Bus #206, #12, #46'
                ],
                routeGuidance: 'From Kinkaku-ji to Gion: Board Kyoto City Bus #12 or #206 southbound directly to Gion bus stop (~30 mins, ¥230).'
              }
            }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'act-d2-1',
              title: 'Arashiyama Bamboo Grove & Tenryu-ji',
              time: '08:00 AM • 3.0 hrs',
              duration: '3.0 hrs',
              costBadgeText: '¥600',
              costBadgeClass: 'bg-blue-100 text-blue-800',
              description: 'Wander through towering green bamboo stalks followed by UNESCO heritage Zen temple garden walks.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgdkCXzS_vOxlr_ryPMAk8IZ8A3SVqSgsart6E4tRrvTDHb38pjaCOCh9sfvFNlM4hDxfg3BdPaVwkLYGGl8cUFy8nZLixZUvP3k-WxXMGXdXLfqddCf6C4--sct_zZKvKdSSXUD-q2zE6jeXnp8NhONsOLJc4mnVKRg1QM8b5os0KVB9Ho5m9tdN2mpzONft9XzacAzdLnyvMazvOWj_4SpkWg-N5UTjmWnsRtCYLESkIW8RewbJB",
              tags: [
                { icon: 'trees', text: 'Nature Walk', colorClass: 'bg-green-50 text-green-700' },
                { icon: 'camera', text: 'Must Visit', colorClass: 'bg-blue-50 text-blue-700' }
              ],
              localTip: '"Rent a bicycle near Saga-Arashiyama station to explore Togetsukyo Bridge and surrounding monkey park."',
              nearbyPlaces: ['Togetsukyo Bridge', 'Iwatayama Monkey Park', 'Saga Scenic Railway'],
              recommendedRestaurant: {
                name: 'Shigetsu Temple Vegan',
                cuisine: 'Traditional Buddhist Shojin Ryori',
                estimatedCost: '¥3,500 (~₹2,000)'
              }
            }
          ]
        }
      ]
    },
    {
      dayNumber: 3,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'act-d3-1',
              title: 'Kiyomizu-dera Wooden Stage',
              time: '09:00 AM • 2.0 hrs',
              duration: '2.0 hrs',
              costBadgeText: '¥400',
              costBadgeClass: 'bg-blue-100 text-blue-800',
              description: 'Dramatic temple built over cliffs offering panoramic views of Kyoto cityscape and cherry trees.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfFb0L0hiOE48GDkAHGgFBJYnBurcJEt3T_q9wCDNmUViIxW_Dqn2MUGF9CPcq7Hx5kjZw6pIxz218dJ_GMMek_27MaEf7uUtuXAcvr6VIwepVOV3TuNMyMlveG5luqLQY3wGXlHHbsYUqZkP7D9gVNRGrH_CNi6K6uJF3gJLp_-JVfBpkObsTMalS3ym4VUG9LLTUkw8SxeMPrxqaUdwqt--Js-Mt398MTJ85_NB2itVPRKYLXhn8",
              tags: [
                { icon: 'camera', text: 'Scenic View', colorClass: 'bg-purple-50 text-purple-700' }
              ],
              nearbyPlaces: ['Otowa Waterfall', 'Sannenzaka Preserved District', 'Ishibe-koji Alley']
            }
          ]
        }
      ]
    }
  ]
};

export const ZERMATT_ITINERARY: TripItinerary = {
  id: '1',
  destination: 'Zermatt, Switzerland',
  dates: 'Dec 12 - Dec 19, 2026',
  travellers: '2 Travellers',
  status: 'Completed',
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPJ66NSnC56Ij29F5YVIKigFd63EwhJqSAlH7ygrSAAWxZKYROYEGx6gfb9o2dgfVtsQxjsa5oW3sg3nwzPuUWbkJRGOvHh9_zYigHhh0JxFYi6eNDP5RxLLD-m7qTlI8Do6uST6r7MjMhijla0VJZ1ADy9ULZUi4pDsn6eFyFZkPdg0Nymji2GZaxU5qCwwdOuRMLYWhv9yovWTdybkP7bR2sW4L8iHX5NPXbCqIAxtBu3wVdZbVO",
  weather: { temp: '-2°C', condition: 'Snowy & Alpine Sun' },
  budgetSummary: {
    hotelsCost: '₹95,000',
    foodCost: '₹38,000',
    activitiesCost: '₹28,000',
    transportCost: '₹18,000',
    totalEstimatedCost: '₹1,79,000 (~CHF 1,920)',
  },
  hotels: [
    {
      name: 'Omnia Luxury Alpine Lodge Zermatt',
      rating: '4.9 ★',
      pricePerNight: '₹42,000 / night',
      vibe: 'Modern Cliffside Chalet with Matterhorn Views',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    },
    {
      name: 'Hotel Schweizerhof Zermatt',
      rating: '4.8 ★',
      pricePerNight: '₹22,000 / night',
      vibe: 'Cozy Alpine Village Resort & Spa',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    },
  ],
  restaurants: [
    {
      name: 'Chez Vrony Chalet Restaurant',
      cuisine: 'Alpine Fine Dining & Gourmet Cheese Fondue',
      specialty: 'House Cured Alpine Beef & Truffle Fondue',
      priceRange: 'CHF 85 (~₹8,200)',
    },
    {
      name: 'Saycheese! Zermatt',
      cuisine: 'Swiss Raclette & Wine Pairing',
      specialty: 'AOP Valais Cheese Raclette',
      priceRange: 'CHF 48 (~₹4,600)',
    },
  ],
  nearbyAttractions: ['Riffelsee Alpine Lake', 'Breithorn Peak', 'Hinterdorf Historic Wooden Quarter', 'Zermatt Ski Resort Slopes'],
  dayItineraries: [
    {
      dayNumber: 1,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'z-1',
              title: 'Gornergrat Railway & Matterhorn Peak',
              time: '09:00 AM • 3.5 hrs',
              duration: '3.5 hrs',
              costBadgeText: 'CHF 65',
              costBadgeClass: 'bg-[#0058bc]/10 text-[#0058bc]',
              description: "Board Europe's highest open-air cogwheel train ascending to 3,089m for unobstructed Matterhorn panorama.",
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEnAsu_LGDYjIyRqA3DMGYuvQnndnWIuxye4QG1VF9qIL9mpVdW1zyHvTSCscRClXOW1mkkJVK4HdtHl5-Mb7hwedqQ8mMcfi7UuoJuWbELyHP7OgJuxEgOSTlwEtPH6_goiOUfIwgBeDQHXRv7qXblSrjUjKJwqVopj1E0GGz2GM1_d8j8QsxDy2oOah77EhMJRuKcfTAYQdPQnP5V5AXnXgJrmkHExhoSdlQpd23K30TZTyJVEgG",
              tags: [
                { icon: 'camera', text: 'Panoramic View', colorClass: 'bg-blue-50 text-blue-700' },
                { icon: 'trees', text: 'Swiss Alps', colorClass: 'bg-green-50 text-green-700' }
              ],
              localTip: '"Sit on the right side of the carriage going up for uninterrupted photos of the Matterhorn!"',
              nearbyPlaces: ['Gornergrat Observatory', '360° Alpine Panorama Platform', 'Riffelberg Station Chalet'],
              recommendedRestaurant: {
                name: '3100 Kulmhotel Restaurant',
                cuisine: 'Alpine Röstis & Hot Spiced Wine',
                estimatedCost: 'CHF 32 (~₹3,100)'
              }
            }
          ]
        },
        {
          period: 'Afternoon',
          activities: [
            {
              id: 'z-2',
              title: 'Matterhorn Glacier Paradise (3,883m)',
              time: '01:30 PM • 3.0 hrs',
              duration: '3.0 hrs',
              costBadgeText: 'CHF 90',
              costBadgeClass: 'bg-[#0058bc]/10 text-[#0058bc]',
              description: 'Ride 3S Cable Car to the highest cable car station in Europe with an ice palace and glacier viewing platform.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPJ66NSnC56Ij29F5YVIKigFd63EwhJqSAlH7ygrSAAWxZKYROYEGx6gfb9o2dgfVtsQxjsa5oW3sg3nwzPuUWbkJRGOvHh9_zYigHhh0JxFYi6eNDP5RxLLD-m7qTlI8Do6uST6r7MjMhijla0VJZ1ADy9ULZUi4pDsn6eFyFZkPdg0Nymji2GZaxU5qCwwdOuRMLYWhv9yovWTdybkP7bR2sW4L8iHX5NPXbCqIAxtBu3wVdZbVO",
              tags: [
                { icon: 'flame', text: 'High Altitude', colorClass: 'bg-purple-50 text-purple-700' }
              ],
              nearbyPlaces: ['Glacier Ice Palace Sculpture Tunnel', 'Snow Park Zermatt', 'Trockener Steg Station']
            }
          ]
        },
        {
          period: 'Evening',
          activities: [
            {
              id: 'z-3',
              title: 'Traditional Alpine Fondue Dinner',
              time: '07:00 PM • 2.0 hrs',
              duration: '2.0 hrs',
              costBadgeText: 'CHF 42',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Cozy up in a wooden chalet in Hinterdorf village for authentic Swiss Gruyère and Vacherin fondue.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiXV9YfKGVrty1tT1HYazvmdZrjV-qerbFNG69oiCbYjICzjwzwLj0R7SUEby3YWVLZuwP-NfWNWAhVrw0a-xDtA5C8OMnZO10MOa88VenrTEzJLGXIiEtKzXurQw6FZrl3Y8nR6aMSskzzHQfO2kSbcYUcBNzMfQoAmcOxCv3engwCTH_4qFb5rsCsffi86tEONQbdx00KD1I-wzBkQt3Waka0vDUZMHVqJL_zMGnNj5qGrwS_DDG",
              tags: [
                { icon: 'utensils', text: 'Swiss Cuisine', colorClass: 'bg-amber-50 text-amber-700' }
              ],
              nearbyPlaces: ['Hinterdorf Strasse Old Barns', 'Bahnhofstrasse Shopping Street'],
              recommendedRestaurant: {
                name: 'Restaurant Whymper-Stube',
                cuisine: 'Authentic Valais Cheese Fondue & Raclette',
                estimatedCost: 'CHF 45 (~₹4,300)'
              }
            }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'z-2-1',
              title: 'Five Lakes Walk (Seenweg Hike)',
              time: '09:00 AM • 4.0 hrs',
              duration: '4.0 hrs',
              costBadgeText: 'Free Hike',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Trek past Stellisee, Grindjisee, and Leisee where the Matterhorn is reflected crystal clear in mountain waters.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEnAsu_LGDYjIyRqA3DMGYuvQnndnWIuxye4QG1VF9qIL9mpVdW1zyHvTSCscRClXOW1mkkJVK4HdtHl5-Mb7hwedqQ8mMcfi7UuoJuWbELyHP7OgJuxEgOSTlwEtPH6_goiOUfIwgBeDQHXRv7qXblSrjUjKJwqVopj1E0GGz2GM1_d8j8QsxDy2oOah77EhMJRuKcfTAYQdPQnP5V5AXnXgJrmkHExhoSdlQpd23K30TZTyJVEgG",
              tags: [
                { icon: 'trees', text: 'Nature Trail', colorClass: 'bg-green-50 text-green-700' }
              ],
              nearbyPlaces: ['Stellisee Reflection Spot', 'Sunnegga Paradise Funicular', 'Findeln Alpine Village']
            }
          ]
        }
      ]
    }
  ]
};

export const MALDIVES_ITINERARY: TripItinerary = {
  id: '2',
  destination: 'Male, Maldives',
  dates: 'Jan 05 - Jan 12, 2026',
  travellers: '4 Travellers',
  status: 'Ongoing',
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpxMQDNVcwDhfPPRignDeT_6SWz22ObzStOQBBJxA8Xgqt3NHIMQzMoR6tHeCMdaTVWphJkOwswBM7uBY4NaYOpqAof1kliQAq-OMx8y2Kk0JXGlV0dIx8hWAhbpOF-14wl1i0CN_FUpnrVaVhIy0DKL1qMjtkARX1ma-P_69lJ2WbodmUCspz8ZMPZ2okvcapBS7ABYpjPd1uTUbRLgeJMiSZArj7dGuBGONogYzUoqAvb4lIqFzM",
  weather: { temp: '29°C', condition: 'Tropical Sun & Lagoon' },
  budgetSummary: {
    hotelsCost: '₹1,20,000',
    foodCost: '₹42,000',
    activitiesCost: '₹22,000',
    transportCost: '₹16,000',
    totalEstimatedCost: '₹2,00,000 (~$2,400 USD)',
  },
  hotels: [
    {
      name: 'Soneva Jani Overwater Resort',
      rating: '5.0 ★',
      pricePerNight: '₹65,000 / night',
      vibe: 'Private Lagoon Overwater Villa with Water Slide',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    },
    {
      name: 'Anantara Dhigu Maldives Resort',
      rating: '4.8 ★',
      pricePerNight: '₹32,000 / night',
      vibe: 'Luxury Coral Island Island Suites & Spa',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    },
  ],
  restaurants: [
    {
      name: '5.8 Undersea Restaurant',
      cuisine: 'Undersea World-Class Seafood Tasting',
      specialty: '7-Course Wine Pairing Meal Under the Ocean',
      priceRange: 'USD $280 (~₹23,000)',
    },
    {
      name: 'Symphony Lagoon Bistro',
      cuisine: 'Maldivian Grilled Reef Fish & Curry',
      specialty: 'Garudhiya Soup & Fresh Coconut Rice',
      priceRange: 'USD $45 (~₹3,700)',
    },
  ],
  nearbyAttractions: ['Banana Reef Marine Reserve', 'Maafushi Island Sandbank', 'Male Fish Market & Old Friday Mosque', 'Hulhumale Beach Walk'],
  dayItineraries: [
    {
      dayNumber: 1,
      sections: [
        {
          period: 'Morning',
          activities: [
            {
              id: 'm-1',
              title: 'Speedboat Transfer & Overwater Villa Check-in',
              time: '10:00 AM • 2.0 hrs',
              duration: '2.0 hrs',
              costBadgeText: 'Included',
              costBadgeClass: 'bg-emerald-100 text-emerald-800',
              description: 'Arrival at Male Velana Airport, gliding over turquoise ocean lagoons via private speedboat.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpxMQDNVcwDhfPPRignDeT_6SWz22ObzStOQBBJxA8Xgqt3NHIMQzMoR6tHeCMdaTVWphJkOwswBM7uBY4NaYOpqAof1kliQAq-OMx8y2Kk0JXGlV0dIx8hWAhbpOF-14wl1i0CN_FUpnrVaVhIy0DKL1qMjtkARX1ma-P_69lJ2WbodmUCspz8ZMPZ2okvcapBS7ABYpjPd1uTUbRLgeJMiSZArj7dGuBGONogYzUoqAvb4lIqFzM",
              tags: [
                { icon: 'camera', text: 'Luxury Resort', colorClass: 'bg-blue-50 text-blue-700' }
              ],
              nearbyPlaces: ['Airport Jetty Dock', 'Velana Arrival Lounge', 'Crystal Blue Ocean Waterway']
            }
          ]
        },
        {
          period: 'Afternoon',
          activities: [
            {
              id: 'm-2',
              title: 'Banana Reef Coral Snorkeling',
              time: '02:00 PM • 2.5 hrs',
              duration: '2.5 hrs',
              costBadgeText: 'USD $45',
              costBadgeClass: 'bg-[#0058bc]/10 text-[#0058bc]',
              description: 'Swim alongside sea turtles, reef sharks, and vibrant coral formations in a protected marine sanctuary.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfFb0L0hiOE48GDkAHGgFBJYnBurcJEt3T_q9wCDNmUViIxW_Dqn2MUGF9CPcq7Hx5kjZw6pIxz218dJ_GMMek_27MaEf7uUtuXAcvr6VIwepVOV3TuNMyMlveG5luqLQY3wGXlHHbsYUqZkP7D9gVNRGrH_CNi6K6uJF3gJLp_-JVfBpkObsTMalS3ym4VUG9LLTUkw8SxeMPrxqaUdwqt--Js-Mt398MTJ85_NB2itVPRKYLXhn8",
              tags: [
                { icon: 'flame', text: 'Marine Life', colorClass: 'bg-purple-50 text-purple-700' }
              ],
              localTip: '"Bring an underwater camera casing—the visibility at Banana Reef is over 25 meters!"',
              nearbyPlaces: ['Manta Ray Point', 'Chicken Island Reef', 'Thulusdhoo Surfing Point'],
              recommendedRestaurant: {
                name: 'The Reef Grill Atoll',
                cuisine: 'Catch of the Day Fresh Fish & Lobster',
                estimatedCost: 'USD $65 (~₹5,400)'
              }
            }
          ]
        },
        {
          period: 'Evening',
          activities: [
            {
              id: 'm-3',
              title: 'Sunset Dolphin Cruise & Beach BBQ',
              time: '05:30 PM • 3.0 hrs',
              duration: '3.0 hrs',
              costBadgeText: 'USD $75',
              costBadgeClass: 'bg-[#0058bc]/10 text-[#0058bc]',
              description: 'Cruise into the Indian Ocean sunset as spinner dolphins leap alongside your wooden dhoni boat.',
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpxMQDNVcwDhfPPRignDeT_6SWz22ObzStOQBBJxA8Xgqt3NHIMQzMoR6tHeCMdaTVWphJkOwswBM7uBY4NaYOpqAof1kliQAq-OMx8y2Kk0JXGlV0dIx8hWAhbpOF-14wl1i0CN_FUpnrVaVhIy0DKL1qMjtkARX1ma-P_69lJ2WbodmUCspz8ZMPZ2okvcapBS7ABYpjPd1uTUbRLgeJMiSZArj7dGuBGONogYzUoqAvb4lIqFzM",
              tags: [
                { icon: 'moon', text: 'Romantic Sunset', colorClass: 'bg-pink-50 text-pink-700' }
              ],
              nearbyPlaces: ['North Male Atoll Sandbank', 'Private Island Bonfire Spot']
            }
          ]
        }
      ]
    }
  ]
};

export const INITIAL_TRIP_ITINERARIES: Record<string, TripItinerary> = {
  '1': GOA_ITINERARY,
  '2': MALDIVES_ITINERARY,
  '3': KYOTO_ITINERARY,
  'zer-1': ZERMATT_ITINERARY,
  'mumbai-1': MUMBAI_ITINERARY,
};

export const INITIAL_DAY_ITINERARIES: DayItinerary[] = KYOTO_ITINERARY.dayItineraries;

export function getPrebuiltOrFallbackItinerary(
  destination: string,
  datesStr?: string,
  daysCount: number = 3
): TripItinerary {
  const norm = destination.toLowerCase().trim();

  if (norm.includes('mumbai') || norm.includes('gateway') || norm.includes('marine drive') || norm.includes('colaba')) {
    return MUMBAI_ITINERARY;
  }
  if (norm.includes('zermatt') || norm.includes('switzerland')) {
    return ZERMATT_ITINERARY;
  }
  if (norm.includes('male') || norm.includes('maldives')) {
    return MALDIVES_ITINERARY;
  }
  if (norm.includes('kyoto') || norm.includes('japan')) {
    return KYOTO_ITINERARY;
  }

  // Dynamic intelligent synthesis for any city (Goa, Paris, Delhi, Dubai, London, Sikar, Churu, Manali, etc.)
  return synthesizeTripItinerary({
    destination,
    departure: datesStr?.split('•')[0]?.trim(),
    days: daysCount,
    budgetINR: '50000',
    travellers: '2 People'
  });
}

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'e1',
    title: 'Curlies Beach Shack Dinner',
    time: 'Today • 20:30',
    category: 'Food',
    amountINR: 2850,
    paymentMethod: 'UPI (GPay/PhonePe)',
    paidBy: 'You',
    splitWith: ['Rahul', 'Ankit'],
    icon: 'utensils',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 'e2',
    title: 'Tejas / Vande Bharat Train Ticket',
    time: 'Today • 11:15',
    category: 'Train/IRCTC',
    amountINR: 1950,
    paymentMethod: 'UPI (GPay/PhonePe)',
    paidBy: 'You',
    splitWith: ['Self'],
    icon: 'train',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 'e3',
    title: 'Baga Water Sports & Jet Ski',
    time: 'Yesterday • 15:40',
    category: 'Activities',
    amountINR: 3500,
    paymentMethod: 'UPI (GPay/PhonePe)',
    paidBy: 'Rahul',
    splitWith: ['You', 'Ankit'],
    icon: 'surfing',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'e4',
    title: 'Scooty Fuel & Daily Rent',
    time: 'Yesterday • 10:00',
    category: 'Transport',
    amountINR: 850,
    paymentMethod: 'Cash',
    paidBy: 'Ankit',
    splitWith: ['You', 'Rahul'],
    icon: 'moped',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c1',
    sender: 'lumi',
    text: "Namaste! I'm Lumi, your AI travel assistant. I've customized your trip with Pure Veg & Jain food recommendations, Vande Bharat train schedules, and UPI split calculations. What would you like to plan or change today?",
  },
  {
    id: 'c2',
    sender: 'user',
    text: "Can you recommend a great sunset beach shack in North Goa with good Pure Veg starters?",
    time: "05:12 PM"
  },
  {
    id: 'c3',
    sender: 'lumi',
    text: "I've reserved Thalassa or Curlies Sunset Deck on Anjuna Beach! They serve delicious Veg Paneer Tikka, Crispy Corn, and fresh mocktails with live saxophone music at 6:15 PM.",
    isUpdatedBadge: true,
    previewCard: {
      title: "Anjuna Cliffside Sunset Shack",
      badge: "Pure Veg Friendly 🥦",
      duration: "2.5 hrs • Sunset Vibe",
      imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80"
    }
  }
];

