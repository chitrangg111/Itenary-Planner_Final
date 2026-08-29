/**
 * Curated World & Indian Destination Knowledge Base for AI Travel Planner
 * Contains detailed landmarks, transport routes, weather, hotels, and authentic restaurants.
 */

export interface DestinationInsight {
  state?: string;
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
}

export const WORLD_DESTINATIONS: Record<string, DestinationInsight> = {
  london: {
    country: 'United Kingdom',
    weather: { temp: '16°C', condition: 'Mild & Partly Cloudy' },
    avgHotelPerNight: 9500,
    popularPlaces: [
      {
        title: 'Big Ben, Westminster Abbey & London Eye River Walk',
        description: 'Iconic neo-Gothic Elizabeth Tower clock and Westminster Abbey followed by crossing Westminster Bridge to the London Eye.',
        time: '09:00 AM • 3.5 hrs',
        duration: '3.5 hrs',
        costBadgeText: 'Free Exterior / £35 Wheel',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        tags: [
          { icon: 'account_balance', text: 'Historic Landmark', colorClass: 'bg-indigo-100 text-indigo-800' },
          { icon: 'camera_alt', text: 'River Thames View', colorClass: 'bg-emerald-100 text-emerald-800' }
        ],
        localTip: 'Tap in with a contactless bank card or Oyster card on the Underground; daily caps save significant money.',
        openingHours: '09:30 AM - 06:00 PM',
        ticketPrice: 'Free Bridge Walk / £34 London Eye',
        nearbyPlaces: ['Parliament Square', 'Southbank Centre', 'St. James’s Park'],
        recommendedRestaurant: {
          name: 'Dishoom Covent Garden (Bombay Cafe)',
          cuisine: 'Iconic Bombay Parsi Grills & Chai',
          estimatedCost: '£22 / ~₹2,400 per person',
          dietaryType: 'Halal & Pure Veg Friendly'
        },
        transit: {
          method: 'London Underground (Jubilee or District Line) to Westminster Station',
          publicTransports: ['London Underground Tube', 'Red Double-Decker Bus #11, #24', 'Thames Clipper Ferry'],
          fare: '£2.80 - £3.40 (~₹300 - ₹380)'
        }
      },
      {
        title: 'Tower of London, Tower Bridge Glass Floor & Borough Market',
        description: 'Medieval royal fortress housing the Crown Jewels, iconic bascule bridge high-level walkways, and gourmet street food tasting.',
        time: '02:30 PM • 3.5 hrs',
        duration: '3.5 hrs',
        costBadgeText: '£33 Castle / Free Market',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'castle', text: 'Crown Jewels', colorClass: 'bg-purple-100 text-purple-800' },
          { icon: 'restaurant', text: 'Artisanal Food Market', colorClass: 'bg-amber-100 text-amber-800' }
        ],
        localTip: 'Sample Borough Market hot raclette cheese or mushroom risotto around 2:30 PM after peak lunchtime crowds subside.',
        openingHours: '09:00 AM - 05:30 PM',
        ticketPrice: '£33.60 Tower of London / Free Borough Market Entry',
        nearbyPlaces: ['The Shard', 'HMS Belfast', 'Leadenhall Market'],
        recommendedRestaurant: {
          name: 'Saravanaa Bhavan Leicester Square',
          cuisine: 'Authentic Pure Veg South Indian',
          estimatedCost: '£15 / ~₹1,600 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'Tube Circle / District Line to Tower Hill Station',
          publicTransports: ['London Underground', 'Borough High St Buses'],
          fare: '£2.80'
        }
      }
    ],
    hotels: [
      { name: 'Park Plaza Westminster Bridge London', rating: '4.8 ★', priceMultiplier: 1.8, vibe: 'Modern luxury overlooking Big Ben and the Houses of Parliament', amenities: ['Spa', 'Indoor Swimming Pool', 'Gym', 'Free High-speed Wi-Fi'] },
      { name: 'Point A Hotel London Kings Cross', rating: '4.5 ★', priceMultiplier: 0.8, vibe: 'Smart compact budget hotel near St Pancras International Eurostar', amenities: ['Free Wi-Fi', '24/7 Reception', 'Coffee Lounge'] }
    ],
    restaurants: [
      { name: 'Dishoom Indian Cafe', cuisine: 'Bombay Irani Cafe Classics', specialty: 'House Black Daal & Chicken Ruby with Butter Naan', price: '£45 for two (~₹4,800)', badge: 'Halal 🌙' },
      { name: 'Govinda’s Pure Veg Soho', cuisine: 'Pure Veg & Vegan Indian Cuisine', specialty: 'Thali Feast with Paneer Makhani & Gulab Jamun', price: '£24 for two (~₹2,600)', badge: 'Pure Veg 🥦' }
    ]
  },
  paris: {
    country: 'France',
    weather: { temp: '18°C', condition: 'Pleasant & Sunny' },
    avgHotelPerNight: 9800,
    popularPlaces: [
      {
        title: 'Eiffel Tower Summit & Trocadéro Gardens Photography',
        description: 'Ascend Paris’s wrought-iron symbol for 360-degree panorama followed by pristine photos from across Pont d’Iéna at Trocadéro.',
        time: '09:00 AM • 3.5 hrs',
        duration: '3.5 hrs',
        costBadgeText: '€28.30 Summit Lift',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        tags: [
          { icon: 'apartment', text: 'World Icon', colorClass: 'bg-indigo-100 text-indigo-800' },
          { icon: 'camera_alt', text: 'Trocadéro View', colorClass: 'bg-emerald-100 text-emerald-800' }
        ],
        localTip: 'Book summit elevator tickets 60 days in advance on the official site to skip 2-hour general queues.',
        openingHours: '09:00 AM - 11:45 PM',
        ticketPrice: '€28.30 Adult Summit Lift / ~₹2,600',
        nearbyPlaces: ['Champ de Mars', 'Seine River Cruise Pier', 'Musée du Quai Branly'],
        recommendedRestaurant: {
          name: 'Cafe de Flore Saint-Germain',
          cuisine: 'Classic Parisian Bistro & Hot Chocolate',
          estimatedCost: '€25 / ~₹2,300 per person',
          dietaryType: 'French Cafe & Croissants'
        },
        transit: {
          method: 'Paris Metro Line 6 to Bir-Hakeim or Line 9 to Trocadéro',
          publicTransports: ['Paris Metro Lines 6 & 9', 'RER C Champ de Mars Tour Eiffel', 'RATP Bus 42'],
          fare: '€2.15 (~₹200)'
        }
      },
      {
        title: 'Louvre Museum Mona Lisa & Seine River Sunset Cruise',
        description: 'World’s greatest art palace featuring Leonardo’s Mona Lisa and Venus de Milo, followed by a romantic 1-hour Seine boat glide.',
        time: '02:30 PM • 4.0 hrs',
        duration: '4.0 hrs',
        costBadgeText: '€22 Museum / €17 Boat',
        costBadgeClass: 'bg-purple-100 text-purple-800',
        tags: [
          { icon: 'museum', text: 'World-Renowned Art', colorClass: 'bg-purple-100 text-purple-800' },
          { icon: 'directions_boat', text: 'Seine Sunset Cruise', colorClass: 'bg-cyan-100 text-cyan-800' }
        ],
        localTip: 'Enter the Louvre via the underground Carrousel du Louvre entrance instead of the main glass pyramid queue to save 45 minutes.',
        openingHours: '09:00 AM - 06:00 PM (Closed Tuesdays)',
        ticketPrice: '€22 Louvre Entry / €17 Vedettes du Pont Neuf Boat Cruise',
        nearbyPlaces: ['Tuileries Garden', 'Palais-Royal', 'Pont Neuf'],
        recommendedRestaurant: {
          name: 'Saravanaa Bhavan Gare du Nord Paris',
          cuisine: 'Pure Veg South Indian Dosa & Thali',
          estimatedCost: '€18 / ~₹1,650 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'Paris Metro Line 1 to Palais-Royal Musée du Louvre',
          publicTransports: ['Paris Metro Line 1', 'Line 7', 'Batobus River Shuttle'],
          fare: '€2.15'
        }
      }
    ],
    hotels: [
      { name: 'Pullman Paris Tour Eiffel', rating: '4.8 ★', priceMultiplier: 2.1, vibe: 'Direct balcony view of Eiffel Tower with Parisian elegance', amenities: ['Balcony Rooms', 'Fitness Lounge', 'Free Wi-Fi', 'Bar'] },
      { name: 'CitizenM Paris Gare de Lyon', rating: '4.6 ★', priceMultiplier: 0.9, vibe: 'Contemporary boutique hotel with mood-lit smart rooms', amenities: ['24/7 CanteenM', 'Rooftop Cloud Bar', 'High-speed Wi-Fi'] }
    ],
    restaurants: [
      { name: 'Le Refuge des Fondus Montmartre', cuisine: 'Traditional French Fondue', specialty: 'Hot Cheese Fondue & Beef Broth with Baguette', price: '€50 for two (~₹4,600)', badge: 'Non-Veg 🍗' },
      { name: 'Saravanaa Bhavan Paris', cuisine: 'Pure Veg South Indian', specialty: 'Special Mysore Masala Dosa & Filter Coffee', price: '€35 for two (~₹3,200)', badge: 'Pure Veg 🥦' }
    ]
  },
  rome: {
    country: 'Italy',
    weather: { temp: '22°C', condition: 'Sunny Mediterranean' },
    avgHotelPerNight: 8800,
    popularPlaces: [
      {
        title: 'Colosseum, Roman Forum & Palatine Hill Antiquities',
        description: 'Walk into the gladiatorial amphitheater of ancient Rome and explore the ruins of Roman temples and imperial palaces.',
        time: '08:30 AM • 3.5 hrs',
        duration: '3.5 hrs',
        costBadgeText: '€18 Combined Pass',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'account_balance', text: 'Ancient Wonder', colorClass: 'bg-amber-100 text-amber-800' },
          { icon: 'history', text: 'Roman Empire', colorClass: 'bg-indigo-100 text-indigo-800' }
        ],
        localTip: 'Bring an empty reusable water bottle; public fountains (nasoni) throughout ancient Rome offer free icy cold mineral water.',
        openingHours: '08:30 AM - 07:15 PM',
        ticketPrice: '€18 Standard Pass / ~₹1,650',
        nearbyPlaces: ['Arch of Constantine', 'Capitoline Hill', 'Piazza Venezia'],
        recommendedRestaurant: {
          name: 'Trattoria Da Enzo al 29 (Trastevere)',
          cuisine: 'Authentic Roman Pasta Cacio e Pepe & Carbonara',
          estimatedCost: '€20 / ~₹1,850 per person',
          dietaryType: 'Traditional Italian'
        },
        transit: {
          method: 'Rome Metro Line B to Colosseo Station',
          publicTransports: ['Rome Metro Line B', 'Tram 3', 'ATAC Bus 75, 87'],
          fare: '€1.50 (~₹140)'
        }
      },
      {
        title: 'Vatican Museums, Sistine Chapel & St. Peter’s Basilica',
        description: 'Michelangelo’s ceiling frescoes, the Raphael Rooms, and the grandest basilica in Christendom with its monumental dome.',
        time: '02:00 PM • 4.0 hrs',
        duration: '4.0 hrs',
        costBadgeText: '€20 Vatican Pass',
        costBadgeClass: 'bg-purple-100 text-purple-800',
        tags: [
          { icon: 'church', text: 'Sistine Chapel', colorClass: 'bg-purple-100 text-purple-800' },
          { icon: 'palette', text: 'Michelangelo Masterpieces', colorClass: 'bg-indigo-100 text-indigo-800' }
        ],
        localTip: 'Strict dress code applies: shoulders and knees must be covered to enter St. Peter’s Basilica and Sistine Chapel.',
        openingHours: '08:00 AM - 07:00 PM',
        ticketPrice: '€20 Vatican Museums / St Peter’s Free Entry',
        nearbyPlaces: ['St. Peter’s Square', 'Castel Sant’Angelo', 'Borgo Pio'],
        recommendedRestaurant: {
          name: 'Giolitti Gelateria since 1900',
          cuisine: 'Legendary Artisanal Italian Gelato',
          estimatedCost: '€5 / ~₹450 per person',
          dietaryType: 'Pure Vegetarian Sweets 🥦'
        },
        transit: {
          method: 'Rome Metro Line A to Ottaviano - San Pietro',
          publicTransports: ['Rome Metro Line A', 'Tram 19'],
          fare: '€1.50'
        }
      }
    ],
    hotels: [
      { name: 'Hotel Artemide Rome', rating: '4.9 ★', priceMultiplier: 1.6, vibe: 'Historic 19th-century palazzo on Via Nazionale with panoramic rooftop', amenities: ['Artemis Spa', 'Rooftop Restaurant', 'Free Mini-Bar', 'Gym'] },
      { name: 'The RomeHello Hostel & Hotel', rating: '4.7 ★', priceMultiplier: 0.7, vibe: 'Vibrant boutique stay with street art murals near Termini Station', amenities: ['Courtyard Garden', 'Beer Garden', 'Free Wi-Fi', 'Luggage Room'] }
    ],
    restaurants: [
      { name: 'Osteria da Fortunata', cuisine: 'Handmade Roman Pasta', specialty: 'Hand-rolled Tagliolini Cacio e Pepe & Ravioli', price: '€40 for two (~₹3,700)', badge: 'Non-Veg 🍗' },
      { name: 'Krishna 13 Indian Restaurant Rome', cuisine: 'North & South Indian', specialty: 'Paneer Butter Masala, Samosas & Garlic Naan', price: '€32 for two (~₹2,950)', badge: 'Pure Veg 🥦' }
    ]
  },
  'new york': {
    country: 'United States',
    weather: { temp: '21°C', condition: 'Sunny & Crisp' },
    avgHotelPerNight: 12500,
    popularPlaces: [
      {
        title: 'Statue of Liberty Ferry, Battery Park & Wall Street Bull',
        description: 'Board the Liberty Island ferry for Lady Liberty views, Ellis Island history, and walking the historic financial district.',
        time: '08:30 AM • 3.5 hrs',
        duration: '3.5 hrs',
        costBadgeText: 'Ferry $24',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        tags: [
          { icon: 'flag', text: 'Freedom Monument', colorClass: 'bg-emerald-100 text-emerald-800' },
          { icon: 'directions_boat', text: 'Harbor Cruise', colorClass: 'bg-cyan-100 text-cyan-800' }
        ],
        localTip: 'Or take the Staten Island Ferry for free harbor views of the Statue of Liberty if on a tight budget.',
        openingHours: '09:00 AM - 05:00 PM',
        ticketPrice: '$24.50 Ferry Pass / ~₹2,050',
        nearbyPlaces: ['One World Observatory', '9/11 Memorial Pools', 'Trinity Church'],
        recommendedRestaurant: {
          name: 'Saravanaa Bhavan Lexington Ave NYC',
          cuisine: 'Pure Veg South Indian & Dosa',
          estimatedCost: '$20 / ~₹1,700 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'NYC Subway Line 1 to South Ferry or 4/5 to Bowling Green',
          publicTransports: ['NYC Subway Lines 1, 4, 5, R, W', 'MTA Bus M15-SBS'],
          fare: '$2.90 (~₹240)'
        }
      },
      {
        title: 'Central Park Walk, Times Square & Summit One Vanderbilt',
        description: 'Stroll Bethesda Terrace and Bow Bridge in Central Park, followed by illuminated Times Square neon signs and glass skydeck vistas.',
        time: '03:30 PM • 4.0 hrs',
        duration: '4.0 hrs',
        costBadgeText: '$42 Skydeck',
        costBadgeClass: 'bg-purple-100 text-purple-800',
        tags: [
          { icon: 'park', text: 'Central Park Oasis', colorClass: 'bg-green-100 text-green-800' },
          { icon: 'flare', text: 'Times Square Lights', colorClass: 'bg-indigo-100 text-indigo-800' }
        ],
        localTip: 'Visit Times Square around 9:30 PM after dusk when all giant digital billboards are fully vibrant and animated.',
        openingHours: '24/7 Public Park & Square / Skydeck 09:00 AM - 10:30 PM',
        ticketPrice: 'Free Park & Square / $42 Summit Skydeck',
        nearbyPlaces: ['Bryant Park & Public Library', 'Grand Central Terminal', 'Rockefeller Center'],
        recommendedRestaurant: {
          name: 'Katz’s Delicatessen since 1888',
          cuisine: 'Iconic NYC Pastrami on Rye & Pickles',
          estimatedCost: '$28 / ~₹2,350 per person',
          dietaryType: 'Kosher Deli'
        },
        transit: {
          method: 'NYC Subway N, Q, R, W to Times Sq - 42nd St',
          publicTransports: ['NYC Subway Lines N, Q, R, W, 1, 2, 3, 7, S'],
          fare: '$2.90'
        }
      }
    ],
    hotels: [
      { name: 'Arlo Midtown Manhattan', rating: '4.7 ★', priceMultiplier: 1.4, vibe: 'Chic boutique hotel with rooftop terrace near Hudson Yards', amenities: ['Rooftop Lounge', 'Free Wi-Fi', 'Bikes', 'Fitness Studio'] },
      { name: 'Pod 39 Murray Hill', rating: '4.5 ★', priceMultiplier: 0.8, vibe: 'Smart micro-hotel with colorful rooftop lounge and taco cafe', amenities: ['Rooftop Bar', 'Playroom Lounge', 'High-speed Wi-Fi'] }
    ],
    restaurants: [
      { name: 'Joe’s Pizza Greenwich Village', cuisine: 'Classic New York Thin Crust Pizza', specialty: 'Hot Fresh Cheese Slice & Pepperoni', price: '$20 for two (~₹1,700)', badge: 'Non-Veg 🍗' },
      { name: 'Dhaba NYC Curry Hill', cuisine: 'North Indian Punjabi Curry', specialty: 'Butter Chicken, Dal Makhani & Garlic Naan', price: '$50 for two (~₹4,200)', badge: 'Halal 🌙' }
    ]
  },
  tokyo: {
    country: 'Japan',
    weather: { temp: '19°C', condition: 'Clear & Crisp' },
    avgHotelPerNight: 7800,
    popularPlaces: [
      {
        title: 'Senso-ji Asakusa Temple & Nakamise Souvenir Street',
        description: 'Tokyo’s oldest Buddhist temple founded in 645 AD, giant red Kaminarimon Lantern, incense rituals, and traditional snack alleys.',
        time: '08:30 AM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'Free Entry',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'temple_buddhist', text: 'Historic Temple', colorClass: 'bg-amber-100 text-amber-800' },
          { icon: 'shopping_bag', text: 'Nakamise Street', colorClass: 'bg-rose-100 text-rose-800' }
        ],
        localTip: 'Buy a PASMO or Suica digital IC card for iPhone/Android wallet; seamless tap-and-pay for all Tokyo trains, subways, and convenience stores.',
        openingHours: '06:00 AM - 05:00 PM',
        ticketPrice: 'Free Temple Grounds Entry',
        nearbyPlaces: ['Sumida River Walkway', 'Tokyo Skytree', 'Kaminarimon Gate'],
        recommendedRestaurant: {
          name: 'Nataraj Vegetarian Indian Ginza / Asakusa',
          cuisine: 'Pure Veg & Jain Friendly Organic Indian',
          estimatedCost: '¥1,800 / ~₹1,050 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'Tokyo Metro Ginza Line to Asakusa Station (G19)',
          publicTransports: ['Tokyo Metro Ginza Line', 'Toei Asakusa Line', 'Tobu Skytree Line'],
          fare: '¥180 - ¥210 (~₹100 - ₹120)'
        }
      },
      {
        title: 'Shibuya Scramble Crossing, Hachiko & Shibuya Sky Observation',
        description: 'World’s busiest pedestrian crossing with 3,000 people per green light, faithful dog Hachiko statue, and open-air 360 rooftop skydeck.',
        time: '04:30 PM • 3.5 hrs',
        duration: '3.5 hrs',
        costBadgeText: '¥2,200 Skydeck',
        costBadgeClass: 'bg-indigo-100 text-indigo-800',
        tags: [
          { icon: 'directions_walk', text: 'Scramble Crossing', colorClass: 'bg-cyan-100 text-cyan-800' },
          { icon: 'visibility', text: 'Open-Air Skydeck', colorClass: 'bg-purple-100 text-purple-800' }
        ],
        localTip: 'Reserve Shibuya Sky sunset slot (around 05:00 PM) online in advance to witness golden hour transitioning to neon Tokyo night lights.',
        openingHours: '10:00 AM - 10:30 PM',
        ticketPrice: '¥2,200 Online Ticket / ~₹1,250',
        nearbyPlaces: ['Miyashita Park Rooftop', 'Harajuku Takeshita Street', 'Meiji Jingu Shrine'],
        recommendedRestaurant: {
          name: 'Ichiran Ramen Shibuya (Custom Veg/Halal options)',
          cuisine: 'Solo Dining Booth Tonkotsu Ramen / Veg Broth',
          estimatedCost: '¥1,300 / ~₹750 per person',
          dietaryType: 'Japanese Ramen'
        },
        transit: {
          method: 'JR Yamanote Line to Shibuya Station Hachiko Exit',
          publicTransports: ['JR Yamanote Line', 'Tokyo Metro Hanzomon & Fukutoshin Lines'],
          fare: '¥170'
        }
      }
    ],
    hotels: [
      { name: 'Hotel Gracery Shinjuku (Godzilla Hotel)', rating: '4.8 ★', priceMultiplier: 1.3, vibe: 'Modern high-rise hotel featuring iconic giant Godzilla head terrace', amenities: ['Terrace Lounge', 'Free Wi-Fi', '24/7 Conbini', 'Buffet Breakfast'] },
      { name: 'Candeo Hotels Tokyo Shimbashi', rating: '4.6 ★', priceMultiplier: 0.9, vibe: 'Boutique stay with open-air rooftop Japanese Sky Spa & Sauna', amenities: ['Rooftop Onsen Bath', 'Sauna', 'High-speed Wi-Fi'] }
    ],
    restaurants: [
      { name: 'Gyukatsu Motomura Shibuya', cuisine: 'Japanese Crispy Beef Cutlet with Stone Grill', specialty: 'Rare Beef Cutlet seared on mini stone grill with wasabi', price: '¥3,400 for two (~₹1,950)', badge: 'Non-Veg 🍗' },
      { name: 'T’s Tantan Pure Vegan Ramen Tokyo Station', cuisine: '100% Plant-based Japanese Ramen & Gyoza', specialty: 'Creamy Sesame DanDan Noodles & Golden Gyoza', price: '¥2,200 for two (~₹1,250)', badge: 'Pure Veg 🥦' }
    ]
  },
  singapore: {
    country: 'Singapore',
    weather: { temp: '29°C', condition: 'Tropical Warmth' },
    avgHotelPerNight: 8500,
    popularPlaces: [
      {
        title: 'Gardens by the Bay Cloud Forest & Supertree Garden Rhapsody',
        description: 'Futuristic 35-meter indoor waterfall mist conservatory, Flower Dome flora, and evening illuminated music light show under Supertrees.',
        time: '02:30 PM • 4.5 hrs',
        duration: '4.5 hrs',
        costBadgeText: 'S$32 Domes / Free Light Show',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'forest', text: 'Supertree Grove', colorClass: 'bg-green-100 text-green-800' },
          { icon: 'waterfall_chart', text: 'Cloud Forest', colorClass: 'bg-cyan-100 text-cyan-800' }
        ],
        localTip: 'Supertree Garden Rhapsody light show runs daily at 7:45 PM and 8:45 PM; completely free to sit on the grass and watch.',
        openingHours: '09:00 AM - 09:00 PM',
        ticketPrice: 'S$32 Domes Combo / ~₹2,000 (Outdoor Supertrees are Free)',
        nearbyPlaces: ['Marina Bay Sands SkyPark', 'Helix Bridge', 'ArtScience Museum'],
        recommendedRestaurant: {
          name: 'Lau Pa Sat Satay Street & Hawker Centre',
          cuisine: 'Singaporean Satay, Char Kway Teow & Roti Prata',
          estimatedCost: 'S$12 / ~₹750 per person',
          dietaryType: 'Halal & Veg Friendly'
        },
        transit: {
          method: 'MRT Downtown Line or Thomson-East Coast Line to Gardens by the Bay Station',
          publicTransports: ['Singapore MRT Network', 'SBS Transit Bus 400'],
          fare: 'S$1.40 - S$1.90 (~₹90 - ₹120)'
        }
      },
      {
        title: 'Marina Bay Sands SkyPark Observation & Merlion Park',
        description: 'Panoramic 57th-floor observation deck spanning the Singapore Strait, followed by waterfront walk to the iconic half-lion Merlion.',
        time: '09:30 AM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'S$26 SkyPark / Free Merlion',
        costBadgeClass: 'bg-blue-100 text-blue-800',
        tags: [
          { icon: 'apartment', text: '57th Floor Panorama', colorClass: 'bg-indigo-100 text-indigo-800' },
          { icon: 'water_drop', text: 'Merlion Mascot', colorClass: 'bg-cyan-100 text-cyan-800' }
        ],
        localTip: 'Walk across the double-helix Helix Bridge at sunset for reflections of illuminated skyscrapers in Marina Bay.',
        openingHours: '10:00 AM - 10:00 PM',
        ticketPrice: 'S$26 SkyPark Entry',
        nearbyPlaces: ['Esplanade Theatres', 'Fullerton Hotel Promenade', 'Singapore Flyer'],
        recommendedRestaurant: {
          name: 'Ananda Bhavan Little India (Oldest Indian Veg since 1924)',
          cuisine: 'Pure Veg South & North Indian Thali & Dosa',
          estimatedCost: 'S$10 / ~₹620 per person',
          dietaryType: 'Pure Veg 🥦'
        },
        transit: {
          method: 'MRT to Bayfront Station (CE1/DT16)',
          publicTransports: ['MRT Circle & Downtown Lines'],
          fare: 'S$1.50'
        }
      }
    ],
    hotels: [
      { name: 'Marina Bay Sands Luxury Resort', rating: '4.9 ★', priceMultiplier: 2.8, vibe: 'World’s most iconic rooftop infinity pool & luxury shopping destination', amenities: ['57th Floor Infinity Pool', 'Banyan Tree Spa', 'Casino', '20+ Celebrity Restaurants'] },
      { name: 'Hotel G Singapore (Bugis/Bencoolen)', rating: '4.5 ★', priceMultiplier: 0.9, vibe: 'Trendy lifestyle boutique hotel in vibrant arts district', amenities: ['Vintage Gym', 'French Wine Bar', 'Free Wi-Fi'] }
    ],
    restaurants: [
      { name: 'Jumbo Seafood East Coast / Riverside', cuisine: 'Award-winning Singaporean Seafood', specialty: 'Signature Singapore Chilli Crab with Fried Mantou Buns', price: 'S$90 for two (~₹5,600)', badge: 'Non-Veg 🍗' },
      { name: 'Komala Vilas Little India', cuisine: 'Traditional Pure Veg South Indian', specialty: 'Paper Roast Masala Dosa, Vadai & Filter Kapi', price: 'S$18 for two (~₹1,100)', badge: 'Pure Veg 🥦' }
    ]
  },
  bali: {
    country: 'Indonesia',
    weather: { temp: '28°C', condition: 'Sunny Tropical' },
    avgHotelPerNight: 4200,
    popularPlaces: [
      {
        title: 'Tegallalang Rice Terraces & Sacred Ubud Monkey Forest Sanctuary',
        description: 'Cascading emerald green rice paddy valleys with giant jungle swings, followed by walking among 1,000 playful macaques under mossy banyans.',
        time: '08:30 AM • 4.5 hrs',
        duration: '4.5 hrs',
        costBadgeText: 'IDR 80k Forest',
        costBadgeClass: 'bg-green-100 text-green-800',
        tags: [
          { icon: 'nature_people', text: 'Monkey Sanctuary', colorClass: 'bg-amber-100 text-amber-800' },
          { icon: 'landscape', text: 'Emerald Rice Valley', colorClass: 'bg-emerald-100 text-emerald-800' }
        ],
        localTip: 'Secure sunglasses, loose jewelry, and water bottles inside zipped backpacks before entering monkey forest grounds.',
        openingHours: '09:00 AM - 06:00 PM',
        ticketPrice: 'IDR 80,000 Monkey Forest / ~₹420',
        nearbyPlaces: ['Ubud Art Market', 'Saraswati Lotus Temple', 'Campuhan Ridge Walk'],
        recommendedRestaurant: {
          name: 'Warung Biah Biah Ubud',
          cuisine: 'Authentic Balinese Tapas & Nasi Campur',
          estimatedCost: 'IDR 60,000 / ~₹320 per person',
          dietaryType: 'Balinese Local'
        },
        transit: {
          method: 'Rented Scooter or Hired Private Driver',
          publicTransports: ['Grab / Gojek Car', 'Scooter Rental'],
          fare: 'IDR 70,000 scooter day rental (~₹370/day)'
        }
      },
      {
        title: 'Tanah Lot Sunset Sea Temple & Coastal Waves',
        description: 'Ancient 16th-century Hindu pilgrimage shrine perched on a dramatic rock formation surrounded by crashing Indian Ocean waves at dusk.',
        time: '04:00 PM • 3.0 hrs',
        duration: '3.0 hrs',
        costBadgeText: 'IDR 60k Entry',
        costBadgeClass: 'bg-amber-100 text-amber-800',
        tags: [
          { icon: 'temple_hindu', text: 'Ocean Rock Temple', colorClass: 'bg-orange-100 text-orange-800' },
          { icon: 'wb_twilight', text: 'Legendary Sunset', colorClass: 'bg-rose-100 text-rose-800' }
        ],
        localTip: 'At low tide, walk across the tidal reef to the base of the rock to receive holy spring water blessing from temple priests.',
        openingHours: '07:00 AM - 07:00 PM',
        ticketPrice: 'IDR 60,000 Adult / ~₹320',
        nearbyPlaces: ['Batu Bolong Sea Arch', 'Surfer Sunset Point', 'Art Souvenir Market'],
        recommendedRestaurant: {
          name: 'Queen’s Tandoor Indian Restaurant Seminyak / Ubud',
          cuisine: 'Pure Veg & Royal Tandoori Indian',
          estimatedCost: 'IDR 150,000 / ~₹800 per person',
          dietaryType: 'Pure Veg Friendly 🥦'
        },
        transit: {
          method: 'Private Day Car Tour or Gojek',
          publicTransports: ['Private Driver Tour', 'Gojek App'],
          fare: 'IDR 450,000 full day car with driver (~₹2,400)'
        }
      }
    ],
    hotels: [
      { name: 'Maya Ubud Resort & Spa', rating: '4.8 ★', priceMultiplier: 1.8, vibe: 'Jungle valley sanctuary nestled along the Petanu River with riverside infinity pools', amenities: ['Infinity River Pools', 'Yoga Pavilion', 'Spa', 'Free Shuttle to Ubud'] },
      { name: 'Kosta Hostel Seminyak / Canggu', rating: '4.6 ★', priceMultiplier: 0.4, vibe: 'Chic beach bohemian boutique hostel with swimming pool and cafe', amenities: ['Swimming Pool', 'Good Mantra Cafe', 'Surfboard Racks', 'Wi-Fi'] }
    ],
    restaurants: [
      { name: 'Naughty Nuri’s Warung Ubud', cuisine: 'Balinese BBQ Grills', specialty: 'Charcoal BBQ Ribs & Fresh Coconut Water', price: 'IDR 250,000 for two (~₹1,350)', badge: 'Non-Veg 🍗' },
      { name: 'Warung Semesta Ubud', cuisine: 'Organic Balinese & Vegetarian', specialty: 'Gado-Gado with Peanut Sauce & Balinese Curry', price: 'IDR 120,000 for two (~₹640)', badge: 'Pure Veg 🥦' }
    ]
  },
  bangkok: {
    country: 'Thailand',
    weather: { temp: '30°C', condition: 'Sunny & Vibrant' },
    avgHotelPerNight: 3500,
    popularPlaces: [
      {
        title: 'Grand Palace, Wat Phra Kaew & Wat Arun Dawn Temple',
        description: 'Gleaming golden spires of the Emerald Buddha Temple followed by crossing the Chao Phraya River by cross-river ferry to porcelain-clad Wat Arun.',
        time: '08:30 AM • 4.0 hrs',
        duration: '4.0 hrs',
        costBadgeText: 'THB 500 Palace / THB 100 Wat Arun',
        costBadgeClass: 'bg-amber-100 text-amber-800',
        tags: [
          { icon: 'temple_buddhist', text: 'Emerald Buddha', colorClass: 'bg-emerald-100 text-emerald-800' },
          { icon: 'directions_boat', text: 'River Crossing Ferry', colorClass: 'bg-cyan-100 text-cyan-800' }
        ],
        localTip: 'Take the Chao Phraya Orange Flag Express Boat for THB 16 (~₹38) instead of private tourist longtail boats that charge 50x more.',
        openingHours: '08:30 AM - 03:30 PM',
        ticketPrice: 'THB 500 Grand Palace + THB 100 Wat Arun (~₹1,450 total)',
        nearbyPlaces: ['Wat Pho Reclining Buddha', 'Tha Tien Pier', 'Sanam Luang Royal Field'],
        recommendedRestaurant: {
          name: 'Thip Samai Pad Thai (Maha Chai Road)',
          cuisine: 'World’s most legendary Pad Thai wrapped in egg omelette',
          estimatedCost: 'THB 150 / ~₹360 per person',
          dietaryType: 'Thai Street Delicacy'
        },
        transit: {
          method: 'MRT Blue Line to Sanam Chai Station or Chao Phraya Express Boat to Tha Chang Pier',
          publicTransports: ['Chao Phraya Express Boat (Orange Flag)', 'MRT Blue Line', 'Local Tuk-Tuk'],
          fare: 'THB 16 - THB 30 (~₹38 - ₹70)'
        }
      },
      {
        title: 'Chatuchak Weekend Market & ICONSIAM Riverfront Spectacular',
        description: 'World’s largest weekend market with 15,000 stalls followed by luxury riverside ICONSIAM featuring air-conditioned indoor floating market (SookSiam).',
        time: '03:00 PM • 4.5 hrs',
        duration: '4.5 hrs',
        costBadgeText: 'Free Entry',
        costBadgeClass: 'bg-emerald-100 text-emerald-800',
        tags: [
          { icon: 'shopping_cart', text: '15,000 Stalls Bazaar', colorClass: 'bg-rose-100 text-rose-800' },
          { icon: 'storefront', text: 'Indoor Floating Market', colorClass: 'bg-indigo-100 text-indigo-800' }
        ],
        localTip: 'SookSiam on G-Floor of ICONSIAM has authentic street food from all 77 Thai provinces in air-conditioned sanitary comfort.',
        openingHours: '10:00 AM - 10:00 PM',
        ticketPrice: 'Free Public Entry',
        nearbyPlaces: ['Chao Phraya Riverfront Promenade', 'Siam Paragon', 'Asiatique Riverfront'],
        recommendedRestaurant: {
          name: 'Bawarchi Indian Restaurant Bangkok',
          cuisine: 'Pure Veg & Mughlai Indian Delicacies',
          estimatedCost: 'THB 400 / ~₹950 per person',
          dietaryType: 'Pure Veg & Halal Friendly'
        },
        transit: {
          method: 'BTS Skytrain Silom Line to Saphan Taksin + Free ICONSIAM Shuttle Boat',
          publicTransports: ['BTS Skytrain', 'Free River Shuttle Boat'],
          fare: 'THB 35 BTS'
        }
      }
    ],
    hotels: [
      { name: 'Amari Bangkok (Pratunam)', rating: '4.8 ★', priceMultiplier: 1.4, vibe: 'Luxury 5-star hotel in heart of shopping district Pratunam & CentralWorld', amenities: ['Rooftop Swimming Pool', 'Breeze Spa', 'Free High-speed Wi-Fi'] },
      { name: 'Lub d Bangkok Siam', rating: '4.6 ★', priceMultiplier: 0.5, vibe: 'Vibrant modern youth hotel right next to National Stadium BTS station', amenities: ['Common Social Area', 'Bar & Cafe', 'Luggage Storage'] }
    ],
    restaurants: [
      { name: 'Somtam Nua Siam Square', cuisine: 'Authentic Isan Thai', specialty: 'Crispy Fried Chicken with Sticky Rice & Green Papaya Salad', price: 'THB 450 for two (~₹1,080)', badge: 'Non-Veg 🍗' },
      { name: 'Saravana Bhavan Bangkok', cuisine: 'Pure Veg South Indian', specialty: 'Special Ghee Roast Dosa, Rava Dosa & Filter Coffee', price: 'THB 350 for two (~₹840)', badge: 'Pure Veg 🥦' }
    ]
  }
};
