import React from 'react';
import { Capacitor } from '@capacitor/core';
import { USER_AVATAR } from '../data';

interface TopAppBarProps {
  title?: string;
  onOpenMenu?: () => void;
  onOpenProfile?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
  showShare?: boolean;
  onShareClick?: () => void;
  canGoBack?: boolean;
  onBack?: () => void;
  isPhoneFrame?: boolean;
  onToggleFrame?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = "AI Travel Planner",
  onOpenMenu,
  onOpenProfile,
  showSearch,
  onSearchClick,
  showShare,
  onShareClick,
  canGoBack,
  onBack,
  isPhoneFrame,
  onToggleFrame,
}) => {
  return (
    <header className="w-full z-40 bg-[#faf9fe]/90 backdrop-blur-xl border-b border-black/5 shadow-xs h-14 sticky top-0 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        {/* Left Action: Back or Menu */}
        <div className="flex items-center gap-2">
          {canGoBack && onBack ? (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#0058bc] active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              aria-label="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
              <span className="text-xs font-semibold hidden sm:inline">Back</span>
            </button>
          ) : (
            <button
              onClick={onOpenMenu}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#0058bc] active:scale-95 transition-transform cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-lg text-[#1a1b1f] tracking-tight truncate max-w-[160px] sm:max-w-xs">
              {title}
            </h1>
            <span className="px-1.5 py-0.5 rounded-full bg-[#0058bc]/10 text-[#0058bc] text-[10px] font-extrabold uppercase tracking-wider">
              App
            </span>
          </div>
        </div>

        {/* Right Actions: Phone Frame Switcher, Search, Profile */}
        <div className="flex items-center gap-2">
          {onToggleFrame && !Capacitor.isNativePlatform() && (
            <button
              onClick={onToggleFrame}
              className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isPhoneFrame
                  ? 'bg-[#0058bc] text-white border-[#0058bc]'
                  : 'bg-white text-[#414755] border-black/10 hover:bg-[#0058bc]/5'
              }`}
              title={isPhoneFrame ? 'Switch to Full Mobile Screen' : 'Switch to Mobile Phone Simulator Shell'}
            >
              <span className="material-symbols-outlined text-base">smartphone</span>
              <span className="hidden md:inline">{isPhoneFrame ? 'Phone View' : 'Full Screen'}</span>
            </button>
          )}

          {showShare && onShareClick && (
            <button
              onClick={onShareClick}
              className="p-1.5 rounded-full hover:bg-black/5 active:scale-95 transition-all text-[#0058bc] cursor-pointer flex items-center justify-center"
              aria-label="Share Itinerary"
              title="Share & Export Itinerary"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          )}

          {showSearch && (
            <button
              onClick={onSearchClick}
              className="p-1.5 rounded-full hover:bg-black/5 transition-colors text-[#414755] cursor-pointer"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          )}

          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#0058bc]/10 hover:opacity-80 transition-opacity cursor-pointer shadow-xs flex-shrink-0"
            aria-label="User Profile"
          >
            <img
              className="w-full h-full object-cover"
              src={USER_AVATAR}
              alt="User avatar profile"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

