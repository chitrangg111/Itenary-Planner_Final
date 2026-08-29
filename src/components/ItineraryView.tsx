import React, { useState } from 'react';
import { KYOTO_HEADER_IMG } from '../data';
import { DayItinerary, TripItinerary } from '../types';
import { SafeImage } from './SafeImage';

interface ItineraryViewProps {
  dayItineraries: DayItinerary[];
  currentTrip?: TripItinerary;
  onAddActivityClick: () => void;
  onAskLumi?: (prompt?: string) => void;
  onUpdateTimings?: (startTime: string, endTime: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  dayItineraries,
  currentTrip,
  onAddActivityClick,
  onAskLumi,
  onUpdateTimings,
}) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  const currentDayData = dayItineraries.find((d) => d.dayNumber === selectedDay) || dayItineraries[0];

  const destinationName = currentTrip?.destination || 'Kyoto, Japan';
  const headerImg = currentTrip?.imageUrl || KYOTO_HEADER_IMG;
  const datesText = currentTrip?.dates || 'Mar 22 — Mar 30, 2026';
  const weatherTemp = currentTrip?.weather?.temp || '22°C';
  const weatherCond = currentTrip?.weather?.condition || 'Sunny';

  const budget = currentTrip?.budgetSummary;
  const hotels = currentTrip?.hotels || [];
  const restaurants = currentTrip?.restaurants || [];
  const nearbyAttractions = currentTrip?.nearbyAttractions || [];

  const totalDays = dayItineraries.length || 1;
  const firstDay = dayItineraries[0];
  const firstAct = firstDay?.sections?.[0]?.activities?.[0];
  
  const lastDay = dayItineraries[totalDays - 1];
  const lastSecIndex = lastDay?.sections?.length ? lastDay.sections.length - 1 : 0;
  const lastSec = lastDay?.sections?.[lastSecIndex];
  const lastActIndex = lastSec?.activities?.length ? lastSec.activities.length - 1 : 0;
  const lastAct = lastSec?.activities?.[lastActIndex];

  const [isEditingTimings, setIsEditingTimings] = useState(false);
  const [customStartTime, setCustomStartTime] = useState<string>(currentTrip?.tripStartTime || '');
  const [customEndTime, setCustomEndTime] = useState<string>(currentTrip?.tripEndTime || '');

  const displayTripStart = customStartTime || currentTrip?.tripStartTime || (
    firstAct?.startTime ? `${firstAct.startTime} (Day 1)` : (firstAct?.time ? `${firstAct.time} (Day 1)` : '06:30 AM (Day 1 Departure)')
  );

  const displayTripEnd = customEndTime || currentTrip?.tripEndTime || (
    lastAct?.endTime ? `${lastAct.endTime} (Day ${lastDay?.dayNumber || totalDays})` : (lastAct?.time ? `${lastAct.time} (Day ${totalDays})` : `09:45 PM (Day ${totalDays} Return)`)
  );

  const handleToggleDoneEditing = () => {
    if (isEditingTimings && onUpdateTimings) {
      onUpdateTimings(displayTripStart, displayTripEnd);
    }
    setIsEditingTimings(!isEditingTimings);
  };

  return (
    <div className="space-y-6 pb-24">

      {/* Destination Header Card */}
      <section>
        <div className="relative h-56 w-full rounded-[24px] overflow-hidden mb-3 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-black/5">
          <SafeImage
            src={headerImg}
            alt={destinationName}
            containerClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover"
            fallbackText="Destination Photo Unavailable"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-1">
              {currentTrip?.from ? `From ${currentTrip.from} • ` : ''}{currentTrip?.travellers || '2 Travellers'}
            </span>
            <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-1.5 flex-wrap">
              <span>{destinationName}</span>
            </h2>
            <p className="text-white/90 text-sm font-medium mt-0.5 flex items-center gap-2">
              <span>{datesText}</span>
              {currentTrip?.from && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-white/20">
                  ✈️ Route from {currentTrip.from.split(',')[0]}
                </span>
              )}
            </p>
          </div>

          {/* Weather Widget */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30 text-white flex items-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-yellow-300">wb_sunny</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-none">{weatherTemp}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-90">{weatherCond}</span>
            </div>
          </div>
        </div>

        {/* Whole Trip Schedule Banner (Start Time & End Time) */}
        <div className="bg-gradient-to-r from-[#003875] via-[#0058bc] to-[#1e1b4b] text-white rounded-2xl p-4 shadow-md border border-blue-700/40 mb-4">
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-300 text-lg">schedule</span>
              <span className="font-bold text-xs uppercase tracking-wider text-blue-100">Overall Trip Timings Schedule</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleDoneEditing}
                className="bg-white/15 hover:bg-white/25 active:scale-95 transition-all px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white border border-white/20 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">edit_calendar</span>
                <span>{isEditingTimings ? 'Done' : 'Change Timings'}</span>
              </button>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white border border-white/20">
                {totalDays} {totalDays === 1 ? 'Day' : 'Days'} Tour
              </span>
            </div>
          </div>

          {isEditingTimings ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 space-y-3 mb-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-blue-100 uppercase tracking-wider block">Change Start Time</label>
                  <input
                    type="text"
                    defaultValue={displayTripStart}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    placeholder="e.g. 06:30 AM (Day 1 Departure)"
                    className="w-full h-9 px-3 rounded-lg bg-white text-[#1a1b1f] text-xs font-bold outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['06:00 AM (Day 1)', '07:30 AM (Day 1)', '09:00 AM (Day 1)'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCustomStartTime(t)}
                        className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-semibold cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-blue-100 uppercase tracking-wider block">Change End Time</label>
                  <input
                    type="text"
                    defaultValue={displayTripEnd}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    placeholder={`e.g. 09:45 PM (Day ${totalDays} Return)`}
                    className="w-full h-9 px-3 rounded-lg bg-white text-[#1a1b1f] text-xs font-bold outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {[`08:00 PM (Day ${totalDays})`, `09:30 PM (Day ${totalDays})`, `10:00 PM (Day ${totalDays})`].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCustomEndTime(t)}
                        className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-semibold cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Time */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/25 text-emerald-300 flex items-center justify-center font-bold border border-emerald-400/30 flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Trip Start Time</span>
                  <span className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                    <span>{displayTripStart}</span>
                  </span>
                </div>
              </div>

              {/* End Time */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/25 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30 flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">flight_land</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Trip End Time</span>
                  <span className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                    <span>{displayTripEnd}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => {
              setActiveQuickFilter(activeQuickFilter === 'navigate' ? null : 'navigate');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
              activeQuickFilter === 'navigate'
                ? 'bg-[#0058bc] text-white shadow-md ring-2 ring-blue-300'
                : 'bg-[#0058bc] text-white hover:bg-[#004493]'
            }`}
          >
            <span className="material-symbols-outlined text-base">near_me</span>
            <span>Navigate</span>
          </button>

          <button
            onClick={() => setActiveQuickFilter(activeQuickFilter === 'budget' ? null : 'budget')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
              activeQuickFilter === 'budget'
                ? 'bg-[#0058bc] text-white shadow-md'
                : 'bg-[#0058bc]/10 text-[#0058bc] hover:bg-[#0058bc]/20'
            }`}
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>Budget Breakdown</span>
          </button>

          <button
            onClick={() => setActiveQuickFilter(activeQuickFilter === 'hotels' ? null : 'hotels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
              activeQuickFilter === 'hotels'
                ? 'bg-[#0058bc] text-white shadow-md'
                : 'bg-[#0058bc]/10 text-[#0058bc] hover:bg-[#0058bc]/20'
            }`}
          >
            <span className="material-symbols-outlined text-base">hotel</span>
            <span>Hotels & Dining</span>
          </button>
        </div>

        {/* Active Navigate Drawer / Transit Navigation Hub */}
        {activeQuickFilter === 'navigate' && (
          <div className="mt-3 bg-blue-600 text-white p-4 rounded-2xl shadow-lg border border-blue-400 space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="material-symbols-outlined">directions_bus</span>
                <span>Navigation & Public Transport Hub — {destinationName}</span>
              </div>
              <button
                onClick={() => setActiveQuickFilter(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Quickly navigate between spots on your itinerary using local public transport, buses, trains, and taxis.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationName)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-[#0058bc] px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
              >
                <span className="material-symbols-outlined text-base">map</span>
                Open {destinationName} in Google Maps
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Budget & Total Money Spent Card */}
      {budget && (
        <section className="bg-gradient-to-br from-[#0058bc]/5 via-white to-blue-50/50 p-5 rounded-[24px] border border-[#0058bc]/15 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-[#0058bc] font-bold text-xs uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                <span>Total Estimated Budget & Expenses</span>
              </div>
              <h3 className="text-2xl font-black text-[#1a1b1f] tracking-tight">
                {budget.totalEstimatedCost}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Est. Total Cost
            </span>
          </div>

          {/* Itemized Cost Pill Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717786] block">🏨 Hotels / Stay</span>
              <span className="text-sm font-bold text-[#1a1b1f] mt-0.5 block">{budget.hotelsCost}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717786] block">🍜 Food & Dining</span>
              <span className="text-sm font-bold text-[#1a1b1f] mt-0.5 block">{budget.foodCost}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717786] block">🎟️ Activities & Sights</span>
              <span className="text-sm font-bold text-[#1a1b1f] mt-0.5 block">{budget.activitiesCost}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717786] block">🚕 Local Transit</span>
              <span className="text-sm font-bold text-[#1a1b1f] mt-0.5 block">{budget.transportCost}</span>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Hotels & Stays Experience */}
      {hotels.length > 0 && (
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0058bc]">hotel</span>
              <h3 className="font-bold text-lg text-[#1a1b1f]">Recommended Hotels & Stays</h3>
            </div>
            <span className="text-xs font-medium text-[#717786]">Curated for your vibe</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hotels.map((hotel, hIdx) => (
              <div key={hIdx} className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm flex gap-3.5 items-center">
                <SafeImage
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  containerClassName="w-20 h-20 rounded-xl flex-shrink-0"
                  className="w-full h-full object-cover"
                  fallbackText="No Photo"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#1a1b1f] truncate">{hotel.name}</h4>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex-shrink-0">
                      {hotel.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#717786] mt-0.5 line-clamp-1">{hotel.vibe}</p>
                  <span className="text-xs font-bold text-[#0058bc] mt-2 block">{hotel.pricePerNight}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Dining & Restaurants */}
      {restaurants.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058bc]">restaurant</span>
            <h3 className="font-bold text-lg text-[#1a1b1f]">Top Dining & Food Experience</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {restaurants.map((rest, rIdx) => (
              <div key={rIdx} className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-[#1a1b1f]">{rest.name}</h4>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {rest.priceRange}
                  </span>
                </div>
                <p className="text-xs text-[#0058bc] font-medium">{rest.cuisine}</p>
                <p className="text-xs text-[#717786] italic">Specialty: {rest.specialty}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nearer Places to Visit */}
      {nearbyAttractions.length > 0 && (
        <section className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058bc]">explore</span>
            <h3 className="font-bold text-sm text-[#1a1b1f]">Nearer Attractions & Places to Visit</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {nearbyAttractions.map((spot, sIdx) => (
              <span
                key={sIdx}
                className="px-3 py-1.5 rounded-full bg-[#f4f3f8] text-[#414755] text-xs font-medium border border-black/5 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xs text-[#0058bc]">place</span>
                {spot}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Ask Lumi AI Question Bar */}
      <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0058bc] rounded-[24px] p-5 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-300">smart_toy</span>
          <h3 className="font-bold text-base">Have a question about {destinationName}?</h3>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          Ask Lumi AI for hotel adjustments, local food recommendations, or nearby attractions!
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => onAskLumi && onAskLumi(`What are the top recommended hotels in ${destinationName}?`)}
            className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            🏨 Ask about Hotels & Stays
          </button>
          <button
            onClick={() => onAskLumi && onAskLumi(`Suggest best local restaurants and dishes to try in ${destinationName}`)}
            className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            🍜 Ask about Restaurants
          </button>
          <button
            onClick={() => onAskLumi && onAskLumi(`What are other nearer places to visit around ${destinationName}?`)}
            className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            📍 Ask about Nearby Places
          </button>
        </div>
      </section>

      {/* Day Selector Navigation */}
      <nav className="flex gap-2 overflow-x-auto scrollbar-none sticky top-16 bg-[#faf9fe]/90 backdrop-blur-md z-30 py-2 -mx-5 px-5">
        {dayItineraries.map((d) => (
          <button
            key={d.dayNumber}
            onClick={() => setSelectedDay(d.dayNumber)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm transition-all active:scale-95 cursor-pointer ${
              selectedDay === d.dayNumber
                ? 'bg-[#0058bc] text-white font-bold shadow-md'
                : 'bg-[#eeedf3] text-[#414755] font-medium hover:bg-[#e9e7ed]'
            }`}
          >
            Day {d.dayNumber}
          </button>
        ))}
      </nav>

      {/* Detailed Activity Timeline */}
      <div className="relative space-y-8">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#717786]/40 via-[#717786]/20 to-transparent border-l border-dashed border-[#717786]/40" />

        {currentDayData?.sections.map((section, idx) => (
          <div key={idx} className="relative z-10">
            {/* Period Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#0058bc] border-4 border-white shadow-sm ring-1 ring-black/5 flex-none" />
              <h3 className="font-semibold text-xl text-[#1a1b1f]">{section.period}</h3>
            </div>

            {/* Activities for this section */}
            <div className="space-y-4 ml-8">
              {section.activities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-[24px] p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-black/5 hover:border-[#0058bc]/20 transition-all space-y-3"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <SafeImage
                      src={act.imageUrl}
                      alt={act.title}
                      containerClassName="w-full md:w-32 h-32 rounded-xl flex-shrink-0"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      fallbackText="No Photo"
                    />

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <h4 className="font-bold text-lg text-[#1a1b1f]">{act.title}</h4>
                          {(() => {
                            let start = act.startTime;
                            let end = act.endTime;
                            if (!start || !end) {
                              if (act.time && (act.time.includes('-') || act.time.includes('–'))) {
                                const parts = act.time.split(/[-–]/);
                                start = start || parts[0].trim();
                                end = end || parts[1]?.trim();
                              } else if (act.time && act.time.includes('•')) {
                                const parts = act.time.split('•');
                                start = start || parts[0].trim();
                                end = end || `+${parts[1]?.trim()}`;
                              } else {
                                start = start || act.time || '09:00 AM';
                                end = end || (act.duration ? `+${act.duration}` : 'Flexible');
                              }
                            }
                            return (
                              <div className="flex flex-wrap items-center gap-2 text-xs font-medium mt-1.5 mb-2">
                                <div className="flex items-center gap-1 text-[#0058bc] font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80">
                                  <span className="material-symbols-outlined text-sm text-[#0058bc]">play_circle</span>
                                  <span>Start: {start}</span>
                                </div>
                                <div className="flex items-center gap-1 text-indigo-900 font-bold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/80">
                                  <span className="material-symbols-outlined text-sm text-indigo-700">task_alt</span>
                                  <span>End: {end}</span>
                                </div>
                                {act.duration && (
                                  <div className="flex items-center gap-1 text-[#414755] bg-[#eeedf3] px-2.5 py-1 rounded-md font-medium">
                                    <span className="material-symbols-outlined text-xs">hourglass_empty</span>
                                    <span>{act.duration}</span>
                                  </div>
                                )}
                                {act.openingHours && (
                                  <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 font-semibold">
                                    <span className="material-symbols-outlined text-xs text-emerald-600">storefront</span>
                                    <span>Timings: {act.openingHours}</span>
                                  </div>
                                )}
                                {act.ticketPrice && (
                                  <div className="flex items-center gap-1 text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-semibold">
                                    <span className="material-symbols-outlined text-xs text-amber-700">confirmation_number</span>
                                    <span>Ticket: {act.ticketPrice}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${act.costBadgeClass}`}>
                          {act.costBadgeText}
                        </span>
                      </div>

                      <p className="text-[#414755] text-sm mb-3 leading-relaxed">
                        {act.description}
                      </p>

                      <div className="flex flex-wrap gap-2 items-center">
                        {act.tags.map((tag, tIdx) => (
                          <div
                            key={tIdx}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${tag.colorClass}`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {tag.icon === 'flame'
                                ? 'local_fire_department'
                                : tag.icon === 'camera'
                                ? 'camera_alt'
                                : tag.icon === 'users'
                                ? 'group'
                                : tag.icon === 'trees'
                                ? 'landscape'
                                : tag.icon === 'utensils'
                                ? 'restaurant'
                                : tag.icon === 'moon'
                                ? 'nightlight_round'
                                : 'star'}
                            </span>
                            <span>{tag.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nearer Places to Visit for this Activity */}
                  {act.nearbyPlaces && act.nearbyPlaces.length > 0 && (
                    <div className="bg-[#faf9fe] p-2.5 rounded-xl border border-black/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058bc] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">near_me</span>
                        Nearer Places to Visit
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {act.nearbyPlaces.map((np, nIdx) => (
                          <span
                            key={nIdx}
                            className="bg-white px-2.5 py-1 rounded-lg text-xs font-medium text-[#414755] border border-black/5 shadow-2xs"
                          >
                            {np}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Restaurant for this Activity */}
                  {act.recommendedRestaurant && (
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-700">restaurant</span>
                        <div>
                          <span className="font-bold text-amber-900 block">{act.recommendedRestaurant.name}</span>
                          <span className="text-amber-800/80">{act.recommendedRestaurant.cuisine}</span>
                        </div>
                      </div>
                      <span className="font-bold text-amber-900 bg-amber-100 px-2 py-1 rounded-md">
                        {act.recommendedRestaurant.estimatedCost}
                      </span>
                    </div>
                  )}

                  {/* Public Transport & Point-to-Point Route Guidance */}
                  {act.transitInfo && (
                    <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#0058bc]">
                          <span className="material-symbols-outlined text-base">directions_bus</span>
                          <span>Public Transport & Route Options</span>
                        </div>
                        {act.transitInfo.recommendedMethod && (
                          <span className="bg-[#0058bc] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Best Route: {act.transitInfo.recommendedMethod}
                          </span>
                        )}
                      </div>

                      {/* Applicable Public Transport Tags */}
                      {act.transitInfo.applicablePublicTransport && act.transitInfo.applicablePublicTransport.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#414755] block mb-1">
                            Applicable Public Transport Here:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {act.transitInfo.applicablePublicTransport.map((pt, ptIdx) => (
                              <span
                                key={ptIdx}
                                className="bg-white text-[#001a41] px-2.5 py-1 rounded-lg text-[11px] font-bold border border-blue-200 shadow-2xs flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs text-[#0058bc]">
                                  {pt.toLowerCase().includes('bus')
                                    ? 'directions_bus'
                                    : pt.toLowerCase().includes('train') || pt.toLowerCase().includes('local')
                                    ? 'train'
                                    : pt.toLowerCase().includes('metro')
                                    ? 'subway'
                                    : pt.toLowerCase().includes('ferry') || pt.toLowerCase().includes('boat')
                                    ? 'directions_boat'
                                    : pt.toLowerCase().includes('walk')
                                    ? 'directions_walk'
                                    : 'local_taxi'}
                                </span>
                                {pt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Route Guidance */}
                      {act.transitInfo.routeGuidance && (
                        <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-[#1a1b1f] space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058bc] block">
                            🗺️ How to travel (Point-to-Point):
                          </span>
                          <p className="text-xs leading-relaxed font-medium text-[#2d313c]">
                            {act.transitInfo.routeGuidance}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Local Tip Quote Box */}
                  {act.localTip && (
                    <div className="bg-[#f4f3f8] p-3 rounded-xl flex gap-3 items-start border border-black/5">
                      <span className="material-symbols-outlined text-[#0058bc] text-xl mt-0.5">
                        lightbulb
                      </span>
                      <div>
                        <span className="font-bold text-[11px] uppercase tracking-wider text-[#0058bc] block mb-0.5">
                          Local Tip
                        </span>
                        <p className="text-xs text-[#414755] italic leading-relaxed">
                          {act.localTip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Activity Floating Action Button */}
      <div className="fixed right-6 bottom-24 z-40">
        <button
          onClick={onAddActivityClick}
          className="w-14 h-14 rounded-full bg-[#0058bc] text-white shadow-xl flex items-center justify-center active:scale-90 transition-transform hover:bg-[#004493] cursor-pointer"
          title="Add Custom Activity"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>
    </div>
  );
};
