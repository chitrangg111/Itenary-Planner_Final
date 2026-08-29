import React from 'react';

export type NavTab = 'explore' | 'itinerary' | 'chat' | 'budget' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="shrink-0 w-full z-40 bg-[#faf9fe]/95 backdrop-blur-xl border-t border-black/5 rounded-t-2xl shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] pt-1.5 pb-2 select-none">
      <div className="flex items-center justify-between w-full px-1 max-w-md mx-auto">
        {/* Tab 1: Explore */}
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex-1 w-1/5 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'explore'
              ? 'text-[#0058bc] font-bold active:scale-95'
              : 'text-[#414755] hover:bg-[#0058bc]/5 active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl leading-none"
            style={{ fontVariationSettings: activeTab === 'explore' ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className="text-[11px] font-semibold mt-1 tracking-tight text-center truncate w-full">Explore</span>
        </button>

        {/* Tab 2: Itinerary */}
        <button
          onClick={() => onSelectTab('itinerary')}
          className={`flex-1 w-1/5 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'itinerary'
              ? 'text-[#0058bc] font-bold active:scale-95'
              : 'text-[#414755] hover:bg-[#0058bc]/5 active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl leading-none"
            style={{ fontVariationSettings: activeTab === 'itinerary' ? "'FILL' 1" : "'FILL' 0" }}
          >
            event_note
          </span>
          <span className="text-[11px] font-semibold mt-1 tracking-tight text-center truncate w-full">Itinerary</span>
        </button>

        {/* Tab 3: Center Floating AI Chat */}
        <button
          onClick={() => onSelectTab('chat')}
          className="flex-1 w-1/5 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer group active:scale-95 relative"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center -mt-6 shadow-md border-3 border-[#faf9fe] transition-transform ${
              activeTab === 'chat'
                ? 'bg-[#0058bc] text-white scale-110 shadow-lg'
                : 'bg-[#0058bc] text-white group-hover:scale-105'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">smart_toy</span>
          </div>
          <span
            className={`text-[11px] mt-1 tracking-tight text-center truncate w-full ${
              activeTab === 'chat' ? 'text-[#0058bc] font-bold' : 'text-[#414755] font-semibold'
            }`}
          >
            AI Chat
          </span>
        </button>

        {/* Tab 4: Budget */}
        <button
          onClick={() => onSelectTab('budget')}
          className={`flex-1 w-1/5 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'budget'
              ? 'text-[#0058bc] font-bold active:scale-95'
              : 'text-[#414755] hover:bg-[#0058bc]/5 active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl leading-none"
            style={{ fontVariationSettings: activeTab === 'budget' ? "'FILL' 1" : "'FILL' 0" }}
          >
            payments
          </span>
          <span className="text-[11px] font-semibold mt-1 tracking-tight text-center truncate w-full">Budget</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 w-1/5 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#0058bc] font-bold active:scale-95'
              : 'text-[#414755] hover:bg-[#0058bc]/5 active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl leading-none"
            style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="text-[11px] font-semibold mt-1 tracking-tight text-center truncate w-full">Profile</span>
        </button>
      </div>

      {/* iOS / Android Bottom Handle Bar Indicator */}
      <div className="w-28 h-1 bg-black/20 rounded-full mx-auto mt-1.5"></div>
    </nav>
  );
};

