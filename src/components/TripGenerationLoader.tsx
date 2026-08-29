import React, { useState, useEffect } from 'react';

interface TripGenerationLoaderProps {
  destination: string;
  from?: string;
  days: number;
  departure?: string;
  travellers?: string;
  budgetINR?: string;
  progressPercent: number; // 0 to 100
  currentPhaseText?: string;
}

const GENERATION_PHASES = [
  {
    minPercent: 0,
    maxPercent: 20,
    title: 'Initializing Travel Engine',
    desc: 'Setting up departure & return schedules',
    icon: 'schedule',
    badge: 'Step 1 of 5',
  },
  {
    minPercent: 21,
    maxPercent: 45,
    title: 'Analyzing Routes & Transport',
    desc: 'Connecting optimal flights, trains & cab transfers',
    icon: 'flight_takeoff',
    badge: 'Step 2 of 5',
  },
  {
    minPercent: 46,
    maxPercent: 68,
    title: 'Curating Top Stays & Hotels',
    desc: 'Filtering verified boutique stays & budget accommodations',
    icon: 'hotel',
    badge: 'Step 3 of 5',
  },
  {
    minPercent: 69,
    maxPercent: 86,
    title: 'Selecting Food & Local Dining',
    desc: 'Adding authentic cuisine, Pure Veg & popular food spots',
    icon: 'restaurant',
    badge: 'Step 4 of 5',
  },
  {
    minPercent: 87,
    maxPercent: 100,
    title: 'Finalizing Day-by-Day Plan',
    desc: 'Structuring timeline, activities & cost breakdown',
    icon: 'auto_awesome',
    badge: 'Step 5 of 5',
  },
];

const TRAVEL_TIPS = [
  'Pro-Tip: Booking trains on IRCTC 120 days ahead gives the best seat availability on premier express routes.',
  'Early 6:30 AM starts allow you to beat midday heat and crowded tourist queues at major attractions.',
  'Local cabs & scooty rentals are usually 25% cheaper when booked through your hotel front desk.',
  'Keeping a 15% buffer in your travel budget prevents unexpected surge pricing surprises.',
  'Pure vegetarian & Jain dining options are curated in every daily itinerary section.',
];

export const TripGenerationLoader: React.FC<TripGenerationLoaderProps> = ({
  destination,
  from = 'Current Location',
  days,
  departure = 'Upcoming',
  travellers = '2 People',
  budgetINR = '50,000',
  progressPercent,
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate helpful tips every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TRAVEL_TIPS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const activePhase =
    GENERATION_PHASES.find(
      (p) => progressPercent >= p.minPercent && progressPercent <= p.maxPercent
    ) || GENERATION_PHASES[GENERATION_PHASES.length - 1];

  const roundedPercent = Math.min(Math.max(Math.round(progressPercent), 0), 100);

  return (
    <div
      id="trip-generation-loader-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden relative">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-[#003d80] via-[#0058bc] to-[#0070eb] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-300 animate-pulse text-2xl">
                auto_awesome
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-100 block leading-tight">
                  AI Travel Concierge
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  Live Cloud AI Generation
                </span>
              </div>
            </div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              {days} Days • ₹{budgetINR}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Crafting Itinerary for {destination}
            </h3>
            <p className="text-blue-100 text-xs mt-1 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-sm text-blue-200">near_me</span>
              <span>Departing from {from}</span>
              <span>•</span>
              <span>{travellers}</span>
            </p>
          </div>

          {/* Decorative blur sphere */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Percentage Display with Radial & Bar indicator */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative flex items-center justify-center w-28 h-28 mb-3">
              {/* Circular SVG Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#0058bc] transition-all duration-300 ease-out"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * roundedPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-[#1a1b1f] tracking-tight">
                  {roundedPercent}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#717786]">
                  {roundedPercent === 100 ? 'Ready' : 'Loading'}
                </span>
              </div>
            </div>

            {/* Horizontal Glowing Bar */}
            <div className="w-full bg-[#e3e2e7] h-2.5 rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#0058bc] via-[#0070eb] to-emerald-400 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${roundedPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Current Milestone / Phase Card */}
          <div className="bg-[#f0f4fa] border border-blue-200/70 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#0058bc] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <span className="material-symbols-outlined text-xl animate-spin" style={{ animationDuration: '3s' }}>
                {activePhase.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0058bc]">
                  {activePhase.badge}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  In Progress
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1a1b1f] mt-0.5">
                {activePhase.title}
              </h4>
              <p className="text-xs text-[#515b70] mt-0.5 leading-relaxed">
                {activePhase.desc}
              </p>
            </div>
          </div>

          {/* Step Timeline Indicator */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717786] block">
              Generation Milestones
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {GENERATION_PHASES.map((phase, idx) => {
                const isCompleted = progressPercent > phase.maxPercent;
                const isCurrent = progressPercent >= phase.minPercent && progressPercent <= phase.maxPercent;

                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className={`w-full h-1.5 rounded-full mb-1.5 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-[#0058bc] animate-pulse'
                          : 'bg-[#e3e2e7]'
                      }`}
                    />
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#0058bc] text-white ring-2 ring-blue-200'
                          : 'bg-[#e3e2e7] text-[#717786]'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Travel Tips / Trivia Ticker */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-amber-600 text-base flex-shrink-0 mt-0.5">
              lightbulb
            </span>
            <p className="text-[11px] text-amber-900 font-medium leading-relaxed transition-all duration-300">
              {TRAVEL_TIPS[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
