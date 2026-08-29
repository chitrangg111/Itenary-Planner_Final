export interface RecentTrip {
  id: string;
  destination: string;
  dates: string;
  travellers: string;
  status: 'Completed' | 'Ongoing' | 'Draft';
  imageUrl: string;
}

export interface DreamDestination {
  id: string;
  title: string;
  estimatedBudgetINR: number;
  tags: { text: string; colorClass: string }[];
  imageUrl: string;
  bookmarked: boolean;
  dietaryTags?: string[];
  bestSeason?: string;
  visaInfo?: string;
}

export interface TransitInfo {
  recommendedMethod: string;
  applicablePublicTransport: string[];
  routeGuidance?: string;
  estimatedFare?: string;
}

export interface ItineraryActivity {
  id: string;
  title: string;
  time: string;
  duration: string;
  startTime?: string;
  endTime?: string;
  costBadgeText: string;
  costBadgeClass: string;
  description: string;
  imageUrl: string;
  tags: { icon: string; text: string; colorClass: string }[];
  localTip?: string;
  nearbyPlaces?: string[];
  dietaryType?: 'Pure Veg' | 'Jain Friendly' | 'Non-Veg' | 'Halal';
  openingHours?: string;
  ticketPrice?: string;
  recommendedRestaurant?: {
    name: string;
    cuisine: string;
    estimatedCost: string;
    dietaryType?: string;
  };
  transitInfo?: TransitInfo;
}

export interface DaySection {
  period: string;
  activities: ItineraryActivity[];
}

export interface DayItinerary {
  dayNumber: number;
  sections: DaySection[];
}

export interface HotelRecommendation {
  name: string;
  rating: string;
  pricePerNight: string;
  vibe: string;
  imageUrl?: string;
  amenities?: string[];
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  specialty: string;
  priceRange: string;
  dietaryBadge?: 'Pure Veg 🥦' | 'Jain Available 🪷' | 'Non-Veg 🍗' | 'Halal 🌙';
}

export interface BudgetBreakdown {
  hotelsCost: string;
  foodCost: string;
  activitiesCost: string;
  transportCost: string;
  totalEstimatedCost: string;
}

export interface TripItinerary {
  id: string;
  destination: string;
  dates: string;
  from?: string;
  tripStartTime?: string;
  tripEndTime?: string;
  travellers?: string;
  status?: 'Completed' | 'Ongoing' | 'Draft';
  imageUrl: string;
  weather?: {
    temp: string;
    condition: string;
  };
  budgetSummary?: BudgetBreakdown;
  hotels?: HotelRecommendation[];
  restaurants?: RestaurantRecommendation[];
  nearbyAttractions?: string[];
  localTips?: string[];
  travelAdvice?: {
    bestTime?: string;
    clothing?: string;
    moneySaving?: string;
    safetyOrEtiquette?: string;
  };
  dayItineraries: DayItinerary[];
}

export interface ExpenseItem {
  id: string;
  title: string;
  time: string;
  category: 'Food' | 'Transport' | 'Activities' | 'Hotels' | 'Flights' | 'Train/IRCTC' | 'Other';
  amountINR: number;
  paymentMethod?: 'UPI (GPay/PhonePe)' | 'Credit Card' | 'Cash' | 'Net Banking';
  paidBy?: string;
  splitWith?: string[];
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface ChatMessage {
  id: string;
  sender: 'lumi' | 'user';
  text: string;
  time?: string;
  isUpdatedBadge?: boolean;
  previewCard?: {
    title: string;
    badge: string;
    duration: string;
    imageUrl: string;
  };
  mapSnippet?: {
    location: string;
    imageUrl: string;
  };
}

export interface UserPreferences {
  userName?: string;
  styles: string[];
  stay: string;
  transit: string[];
  dietary?: 'Pure Veg' | 'Jain' | 'Non-Veg' | 'Flexible';
  originCity?: string;
  preferredTrainClass?: 'Vande Bharat / 1A / 2A' | '3A' | 'Sleeper' | 'Flight Only';
}

