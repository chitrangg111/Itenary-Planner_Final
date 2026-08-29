import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { TopAppBar } from './components/TopAppBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { MobileStatusBar } from './components/MobileStatusBar';
import { ExploreView } from './components/ExploreView';
import { ItineraryView } from './components/ItineraryView';
import { BudgetView } from './components/BudgetView';
import { AIChatView } from './components/AIChatView';
import { OnboardingView } from './components/OnboardingView';
import { ProfileView } from './components/ProfileView';
import { AddActivityModal } from './components/AddActivityModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { TripGenerationLoader } from './components/TripGenerationLoader';

import {
  INITIAL_RECENT_TRIPS,
  INITIAL_DREAM_DESTINATIONS,
  INITIAL_EXPENSES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_TRIP_ITINERARIES,
  GOA_ITINERARY,
  getPrebuiltOrFallbackItinerary,
} from './data';
import { synthesizeTripItinerary } from './utils/tripSynthesizer';
import { generateLumiAssistantReply } from './utils/chatAssistant';
import { apiGenerateTrip, apiSendChat } from './utils/apiClient';
import {
  RecentTrip,
  DreamDestination,
  DayItinerary,
  ExpenseItem,
  ChatMessage,
  UserPreferences,
  ItineraryActivity,
  TripItinerary,
} from './types';
import {
  STORAGE_KEYS,
  getStoredItem,
  setStoredItem,
  clearAllLumiStorage,
} from './utils/storage';

const DEFAULT_PREFERENCES: UserPreferences = {
  userName: 'Alex',
  styles: ['Beach & Sunset', 'Foodie & Shacks', 'Heritage & Forts'],
  stay: '4star',
  transit: ['Scooty / Cab', 'Vande Bharat Train', 'Flight'],
  dietary: 'Pure Veg',
  originCity: 'New Delhi (DEL)',
  preferredTrainClass: 'Vande Bharat / 1A / 2A',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab | 'onboarding'>(() =>
    getStoredItem<NavTab | 'onboarding'>(STORAGE_KEYS.ACTIVE_TAB, 'explore')
  );
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Persistent State
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>(() =>
    getStoredItem<RecentTrip[]>(STORAGE_KEYS.RECENT_TRIPS, INITIAL_RECENT_TRIPS)
  );
  const [dreamDestinations, setDreamDestinations] = useState<DreamDestination[]>(() =>
    getStoredItem<DreamDestination[]>(STORAGE_KEYS.DREAM_DESTINATIONS, INITIAL_DREAM_DESTINATIONS)
  );
  
  const [tripItinerariesMap, setTripItinerariesMap] = useState<Record<string, TripItinerary>>(() =>
    getStoredItem<Record<string, TripItinerary>>(STORAGE_KEYS.TRIP_MAP, INITIAL_TRIP_ITINERARIES)
  );

  const [currentTrip, setCurrentTrip] = useState<TripItinerary>(() =>
    getStoredItem<TripItinerary>(STORAGE_KEYS.CURRENT_TRIP, GOA_ITINERARY)
  );
  const [dayItineraries, setDayItineraries] = useState<DayItinerary[]>(() =>
    getStoredItem<DayItinerary[]>(STORAGE_KEYS.DAY_ITINERARIES, GOA_ITINERARY.dayItineraries)
  );
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() =>
    getStoredItem<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES)
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    getStoredItem<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES)
  );
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Generation loading & progress state
  const [isGeneratingTrip, setIsGeneratingTrip] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMeta, setGenerationMeta] = useState<{
    destination: string;
    from: string;
    days: number;
    departure: string;
    travellers: string;
    budgetINR: string;
  } | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    getStoredItem<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES)
  );

  // Synchronize state changes to localStorage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.RECENT_TRIPS, recentTrips);
  }, [recentTrips]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.DREAM_DESTINATIONS, dreamDestinations);
  }, [dreamDestinations]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.TRIP_MAP, tripItinerariesMap);
  }, [tripItinerariesMap]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.CURRENT_TRIP, currentTrip);
  }, [currentTrip]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.DAY_ITINERARIES, dayItineraries);
  }, [dayItineraries]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.CHAT_MESSAGES, chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.PREFERENCES, preferences);
  }, [preferences]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  // Modal states
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Bookmark toggle
  const handleToggleBookmark = (id: string) => {
    setDreamDestinations((prev) =>
      prev.map((dest) => (dest.id === id ? { ...dest, bookmarked: !dest.bookmarked } : dest))
    );
  };

  // Add custom Activity to Itinerary
  const handleAddActivity = (
    activity: ItineraryActivity,
    period: 'Morning' | 'Afternoon' | 'Evening'
  ) => {
    setDayItineraries((prev) => {
      const day1 = prev[0] || { dayNumber: 1, sections: [] };
      const newSections = [...day1.sections];
      const targetSection = newSections.find((s) => s.period === period);

      if (targetSection) {
        targetSection.activities.push(activity);
      } else {
        newSections.push({
          period,
          activities: [activity],
        });
      }

      const updated = [{ ...day1, sections: newSections }, ...prev.slice(1)];
      
      setCurrentTrip((curr) => {
        const updatedTrip = { ...curr, dayItineraries: updated };
        setTripItinerariesMap((map) => ({ ...map, [curr.id]: updatedTrip }));
        return updatedTrip;
      });

      return updated;
    });
  };

  // Update whole trip start & end timings
  const handleUpdateTimings = (startTime: string, endTime: string) => {
    setCurrentTrip((curr) => {
      const updatedTrip = {
        ...curr,
        tripStartTime: startTime,
        tripEndTime: endTime,
      };
      setTripItinerariesMap((map) => ({
        ...map,
        [curr.id]: updatedTrip,
      }));
      return updatedTrip;
    });
  };

  // Reset demo data
  const handleResetData = () => {
    clearAllLumiStorage();
    setRecentTrips(INITIAL_RECENT_TRIPS);
    setDreamDestinations(INITIAL_DREAM_DESTINATIONS);
    setTripItinerariesMap(INITIAL_TRIP_ITINERARIES);
    setCurrentTrip(GOA_ITINERARY);
    setDayItineraries(GOA_ITINERARY.dayItineraries);
    setExpenses(INITIAL_EXPENSES);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setPreferences(DEFAULT_PREFERENCES);
    setActiveTab('explore');
  };

  // Add Expense
  const handleAddExpense = (expense: ExpenseItem) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  // Send Chat message to Lumi AI API
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const data = await apiSendChat(text, currentTrip.destination);
      setIsChatLoading(false);

      if (data && data.reply) {
        const lumiMsg: ChatMessage = {
          id: `l-${Date.now()}`,
          sender: 'lumi',
          text: data.reply,
          isUpdatedBadge: text.toLowerCase().includes('hike') || text.toLowerCase().includes('replace'),
          previewCard: data.previewCard || (text.toLowerCase().includes('hike') ? {
            title: 'Harder Kulm Ridge Path',
            badge: 'Hiking',
            duration: '4.5 hours • Moderate',
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
          } : undefined),
        };
        setChatMessages((prev) => [...prev, lumiMsg]);
      } else {
        const fallbackResponse = generateLumiAssistantReply(text, currentTrip.destination);
        const fallbackMsg: ChatMessage = {
          id: `l-${Date.now()}`,
          sender: 'lumi',
          text: fallbackResponse.reply,
          isUpdatedBadge: text.toLowerCase().includes('hike') || text.toLowerCase().includes('replace'),
          previewCard: fallbackResponse.previewCard,
        };
        setChatMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.log('Mobile chat fallback:', err);
      setIsChatLoading(false);
      const fallbackResponse = generateLumiAssistantReply(text, currentTrip.destination);
      const fallbackMsg: ChatMessage = {
        id: `l-${Date.now()}`,
        sender: 'lumi',
        text: fallbackResponse.reply,
        isUpdatedBadge: text.toLowerCase().includes('hike') || text.toLowerCase().includes('replace'),
        previewCard: fallbackResponse.previewCard,
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  // Select Recent Trip from Explore view
  const handleSelectRecentTrip = (trip: RecentTrip) => {
    let itinerary = tripItinerariesMap[trip.id];
    if (!itinerary) {
      itinerary = getPrebuiltOrFallbackItinerary(trip.destination, trip.dates);
    }
    setCurrentTrip(itinerary);
    setDayItineraries(itinerary.dayItineraries || []);
    setActiveTab('itinerary');
  };

  // Real-time AI Trip Generation
  const handleGenerateTrip = async (data: {
    from: string;
    destination: string;
    departure: string;
    days: number;
    budgetINR: string;
    travellers: string;
    tripStartTime?: string;
    tripEndTime?: string;
  }) => {
    setIsGeneratingTrip(true);
    setGenerationProgress(10);
    setGenerationMeta({
      destination: data.destination || 'Kyoto, Japan',
      from: data.from || 'Current Location',
      days: data.days || 5,
      departure: data.departure || 'Upcoming',
      travellers: data.travellers || '2 People',
      budgetINR: data.budgetINR || '50,000',
    });

    // Smooth progressive percentage ticker
    let currentPct = 10;
    const progressInterval = setInterval(() => {
      if (currentPct < 35) {
        currentPct += Math.random() * 6 + 3;
      } else if (currentPct < 65) {
        currentPct += Math.random() * 4 + 2;
      } else if (currentPct < 88) {
        currentPct += Math.random() * 2 + 1;
      } else if (currentPct < 94) {
        currentPct += 0.3;
      }
      setGenerationProgress(Math.min(currentPct, 95));
    }, 200);

    let generatedItinerary: TripItinerary;
    try {
      const apiResult = await apiGenerateTrip(data);
      if (apiResult && apiResult.dayItineraries && Array.isArray(apiResult.dayItineraries) && apiResult.dayItineraries.length > 0) {
        generatedItinerary = apiResult;
      } else {
        generatedItinerary = synthesizeTripItinerary({
          destination: data.destination || 'Custom Destination',
          from: data.from,
          departure: data.departure,
          days: data.days || 3,
          budgetINR: data.budgetINR,
          travellers: data.travellers,
          tripStartTime: data.tripStartTime,
          tripEndTime: data.tripEndTime
        });
      }
    } catch (err) {
      console.log('Mobile client trip synthesis fallback:', err);
      generatedItinerary = synthesizeTripItinerary({
        destination: data.destination || 'Custom Destination',
        from: data.from,
        departure: data.departure,
        days: data.days || 3,
        budgetINR: data.budgetINR,
        travellers: data.travellers,
        tripStartTime: data.tripStartTime,
        tripEndTime: data.tripEndTime
      });
    } finally {
      clearInterval(progressInterval);
    }

    // Set to 100% when response is ready
    setGenerationProgress(100);

    if (data.tripStartTime) {
      generatedItinerary.tripStartTime = data.tripStartTime.includes('Day 1')
        ? data.tripStartTime
        : `${data.tripStartTime} (Day 1 Departure)`;
    }
    if (data.tripEndTime) {
      generatedItinerary.tripEndTime = data.tripEndTime.includes('Day')
        ? data.tripEndTime
        : `${data.tripEndTime} (Day ${data.days} Return)`;
    }

    const tripId = generatedItinerary.id || `trip-${Date.now()}`;
    generatedItinerary.id = tripId;

    const newTripItem: RecentTrip = {
      id: tripId,
      destination: generatedItinerary.destination || data.destination || 'Kyoto, Japan',
      dates: generatedItinerary.dates || `${data.departure} • ${data.days} Days`,
      travellers: generatedItinerary.travellers || data.travellers || '2 Travellers',
      status: 'Ongoing',
      imageUrl: generatedItinerary.imageUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    };

    // Hold at 100% briefly so user sees the completed state
    setTimeout(() => {
      setRecentTrips((prev) => [newTripItem, ...prev.filter((t) => t.id !== tripId)]);
      setTripItinerariesMap((prev) => ({ ...prev, [tripId]: generatedItinerary }));
      setCurrentTrip(generatedItinerary);
      setDayItineraries(generatedItinerary.dayItineraries || []);
      setIsGeneratingTrip(false);
      setGenerationProgress(0);
      setGenerationMeta(null);
      setActiveTab('itinerary');
    }, 450);
  };

  // Ask Lumi handler from Itinerary or Explore
  const handleAskLumi = (prompt?: string) => {
    setActiveTab('chat');
    if (prompt) {
      handleSendMessage(prompt);
    }
  };

  const isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();

  return (
    <div className={`h-screen max-h-screen w-full flex items-center justify-center p-0 font-sans text-[#1a1b1f] overflow-hidden ${
      isNative ? 'bg-[#faf9fe]' : 'bg-[#111218] md:p-4'
    }`}>
      {/* Outer Phone Shell Container */}
      <div
        className={`w-full transition-all duration-300 relative bg-[#faf9fe] flex flex-col h-full max-h-full overflow-hidden ${
          isNative
            ? 'max-w-full h-full rounded-none border-none shadow-none'
            : isPhoneFrame
            ? 'max-w-[420px] md:h-[880px] md:max-h-[880px] md:rounded-[44px] md:border-[10px] md:border-[#222430] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]'
            : 'max-w-md md:max-w-2xl lg:max-w-4xl md:rounded-3xl md:shadow-2xl'
        }`}
      >
        {/* Mobile Device Status Bar */}
        <MobileStatusBar isSimulator={isPhoneFrame} />

        {/* Top App Header */}
        <TopAppBar
          title={
            activeTab === 'onboarding'
              ? 'Lumi Setup'
              : activeTab === 'chat'
              ? 'Lumi AI Assistant'
              : activeTab === 'budget'
              ? 'Budget Engine'
              : activeTab === 'itinerary'
              ? currentTrip.destination || 'Trip Itinerary'
              : activeTab === 'profile'
              ? 'Traveler Profile'
              : 'AI Travel Planner'
          }
          canGoBack={activeTab !== 'explore'}
          onBack={() => setActiveTab('explore')}
          onOpenMenu={() => setActiveTab('onboarding')}
          onOpenProfile={() => setActiveTab('profile')}
          showSearch={activeTab === 'itinerary' || activeTab === 'explore'}
          onSearchClick={() => setActiveTab('explore')}
          isPhoneFrame={isPhoneFrame}
          onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
          {activeTab === 'explore' && (
            <ExploreView
              userName={preferences.userName}
              recentTrips={recentTrips}
              dreamDestinations={dreamDestinations}
              onToggleBookmark={handleToggleBookmark}
              onGenerateTrip={handleGenerateTrip}
              onStartChat={() => setActiveTab('chat')}
              onSelectRecentTrip={handleSelectRecentTrip}
              isGenerating={isGeneratingTrip}
              generationProgress={generationProgress}
            />
          )}

          {activeTab === 'itinerary' && (
            <ItineraryView
              currentTrip={currentTrip}
              dayItineraries={dayItineraries}
              onAddActivityClick={() => setIsAddActivityOpen(true)}
              onAskLumi={handleAskLumi}
              onUpdateTimings={handleUpdateTimings}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetView
              expenses={expenses}
              onAddExpenseClick={() => setIsAddExpenseOpen(true)}
            />
          )}

          {activeTab === 'chat' && (
            <AIChatView
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
            />
          )}

          {activeTab === 'onboarding' && (
            <OnboardingView
              onCompleteOnboarding={(newPrefs) => {
                setPreferences((prev) => ({ ...prev, ...newPrefs }));
                setActiveTab('explore');
              }}
              onSkip={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              preferences={preferences}
              onReRunOnboarding={() => setActiveTab('onboarding')}
              onUpdatePreferences={(newPrefs) => setPreferences((prev) => ({ ...prev, ...newPrefs }))}
              onResetData={handleResetData}
            />
          )}
        </main>

        {/* Mobile Native Bottom Navigation */}
        {activeTab !== 'onboarding' && (
          <BottomNav
            activeTab={activeTab as NavTab}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Modals */}
        <AddActivityModal
          isOpen={isAddActivityOpen}
          onClose={() => setIsAddActivityOpen(false)}
          onAddActivity={handleAddActivity}
        />

        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          onAddExpense={handleAddExpense}
        />

        {/* Real-time AI Trip Generation Progress Modal */}
        {isGeneratingTrip && generationMeta && (
          <TripGenerationLoader
            destination={generationMeta.destination}
            from={generationMeta.from}
            days={generationMeta.days}
            departure={generationMeta.departure}
            travellers={generationMeta.travellers}
            budgetINR={generationMeta.budgetINR}
            progressPercent={generationProgress}
          />
        )}
      </div>
    </div>
  );
}

