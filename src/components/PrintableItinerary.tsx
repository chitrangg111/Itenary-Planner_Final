import React from 'react';
import { TripItinerary } from '../types';

interface PrintableItineraryProps {
  trip: TripItinerary;
}

export const PrintableItinerary: React.FC<PrintableItineraryProps> = ({ trip }) => {
  const dest = trip.destination || 'Destination';
  const dates = trip.dates || '';
  const travellers = trip.travellers || '2 Travellers';
  const from = trip.from ? `From ${trip.from}` : '';
  const start = trip.tripStartTime || '06:30 AM (Day 1)';
  const end = trip.tripEndTime || '09:45 PM';
  const budget = trip.budgetSummary;

  return (
    <div className="print-only hidden font-sans text-[#1a1b1f] p-8 max-w-4xl mx-auto bg-white">
      {/* Header Banner */}
      <div className="border-b-2 border-[#0058bc] pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#0058bc]">
              Lumi AI Travel Planner &bull; Official Travel Document
            </span>
            <h1 className="text-3xl font-extrabold text-[#1a1b1f] mt-1 tracking-tight">
              {dest}
            </h1>
            <p className="text-sm font-semibold text-[#575e71] mt-1">
              {dates} &bull; {travellers} {from && `&bull; ${from}`}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-[#0058bc] text-white text-xs font-bold px-3 py-1 rounded-full">
              Trip Itinerary
            </span>
            <p className="text-[11px] text-gray-500 mt-2 font-medium">
              Weather: {trip.weather?.temp || '24°C'}, {trip.weather?.condition || 'Sunny'}
            </p>
          </div>
        </div>

        {/* Departure & Arrival Timing Strip */}
        <div className="grid grid-cols-2 gap-4 bg-[#f4f6fb] p-3 rounded-xl mt-4 border border-[#e1e5f0]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#717786] block">Departure Schedule</span>
            <span className="text-xs font-bold text-[#003875]">{start}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#717786] block">Return Schedule</span>
            <span className="text-xs font-bold text-[#003875]">{end}</span>
          </div>
        </div>
      </div>

      {/* Budget Summary (If available) */}
      {budget && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#0058bc] mb-2">
            Estimated Budget Overview
          </h2>
          <div className="grid grid-cols-5 gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-500 block">Stays</span>
              <span className="text-xs font-bold text-gray-900">{budget.hotelsCost}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-500 block">Dining</span>
              <span className="text-xs font-bold text-gray-900">{budget.foodCost}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-500 block">Activities</span>
              <span className="text-xs font-bold text-gray-900">{budget.activitiesCost}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-500 block">Transit</span>
              <span className="text-xs font-bold text-gray-900">{budget.transportCost}</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg py-1">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Total Est.</span>
              <span className="text-xs font-extrabold text-[#0058bc]">{budget.totalEstimatedCost}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stays & Dining Preview */}
      {((trip.hotels && trip.hotels.length > 0) || (trip.restaurants && trip.restaurants.length > 0)) && (
        <div className="grid grid-cols-2 gap-4 mb-6 break-inside-avoid">
          {trip.hotels && trip.hotels.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-3 bg-white">
              <h3 className="text-xs uppercase font-bold text-[#0058bc] mb-2">Recommended Hotels</h3>
              <ul className="space-y-1.5 text-xs">
                {trip.hotels.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex justify-between items-center text-gray-700">
                    <span className="font-semibold">{h.name}</span>
                    <span className="text-gray-500 text-[11px]">{h.rating}★ &bull; {h.pricePerNight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {trip.restaurants && trip.restaurants.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-3 bg-white">
              <h3 className="text-xs uppercase font-bold text-[#0058bc] mb-2">Top Dining Picks</h3>
              <ul className="space-y-1.5 text-xs">
                {trip.restaurants.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex justify-between items-center text-gray-700">
                    <span className="font-semibold">{r.name} ({r.cuisine})</span>
                    <span className="text-gray-500 text-[11px]">{r.priceRange}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Day by Day Itinerary */}
      <div className="space-y-6">
        <h2 className="text-sm uppercase font-extrabold tracking-wider text-[#0058bc] border-b border-gray-200 pb-1.5">
          Detailed Day-by-Day Itinerary
        </h2>

        {trip.dayItineraries?.map((day) => (
          <div key={day.dayNumber} className="border border-gray-200 rounded-xl overflow-hidden break-inside-avoid shadow-xs">
            <div className="bg-[#0058bc] text-white px-4 py-2 font-bold text-sm flex justify-between items-center">
              <span>Day {day.dayNumber}</span>
              <span className="text-xs font-normal opacity-90">{day.sections?.length || 0} Phases</span>
            </div>

            <div className="p-4 space-y-4 bg-white">
              {day.sections?.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <span className="text-[11px] uppercase font-extrabold text-[#0058bc] tracking-wider block border-b border-gray-100 pb-0.5">
                    {sec.period}
                  </span>

                  <div className="space-y-2.5">
                    {sec.activities?.map((act) => (
                      <div key={act.id} className="grid grid-cols-[100px_1fr] gap-3 text-xs border-b border-gray-100 pb-2 last:border-b-0">
                        <div className="font-bold text-gray-600">
                          {act.time}
                          {act.duration && <span className="block text-[10px] font-normal text-gray-400">{act.duration}</span>}
                        </div>
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-900 text-sm">{act.title}</span>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {act.costBadgeText}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-gray-600 mt-1 text-[11px] leading-relaxed">{act.description}</p>
                          )}
                          {act.transitInfo?.recommendedMethod && (
                            <div className="mt-1.5 text-[11px] text-blue-700 bg-blue-50/80 px-2 py-1 rounded">
                              <strong>Transit:</strong> {act.transitInfo.recommendedMethod} &bull; {act.transitInfo.routeGuidance}
                            </div>
                          )}
                          {act.localTip && (
                            <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                              <strong>Tip:</strong> {act.localTip}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Local Tips & Packing */}
      {trip.localTips && trip.localTips.length > 0 && (
        <div className="mt-6 border border-amber-200 bg-amber-50/50 rounded-xl p-4 break-inside-avoid">
          <h3 className="text-xs uppercase font-extrabold text-amber-900 mb-2">Essential Travel Tips</h3>
          <ul className="list-disc pl-4 space-y-1 text-xs text-amber-900/90">
            {trip.localTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        Generated by <strong>Lumi AI Travel Planner</strong> &bull; Printed on {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
};
