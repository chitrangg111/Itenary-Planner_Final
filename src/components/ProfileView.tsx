import React, { useState } from 'react';
import { USER_AVATAR } from '../data';
import { UserPreferences } from '../types';

interface ProfileViewProps {
  preferences: UserPreferences;
  onReRunOnboarding: () => void;
  onUpdatePreferences?: (newPrefs: Partial<UserPreferences>) => void;
  onResetData?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  preferences,
  onReRunOnboarding,
  onUpdatePreferences,
  onResetData,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(preferences.userName || 'Alex');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim() && onUpdatePreferences) {
      onUpdatePreferences({ userName: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-screen-md mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#0058bc]/20 shadow-md">
          <img src={USER_AVATAR} alt="User Avatar" className="w-full h-full object-cover" />
        </div>

        <div>
          {isEditingName ? (
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-3 py-1.5 border border-[#0058bc] rounded-xl text-center font-bold text-lg outline-none w-full"
                placeholder="Enter your name"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="px-3 py-1.5 bg-[#0058bc] text-white rounded-xl text-xs font-bold hover:bg-[#004494] transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-[#1a1b1f]">
                {preferences.userName || 'Alex'}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[#414755] hover:text-[#0058bc] p-1 cursor-pointer transition-colors"
                title="Edit Name"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
          )}
          <p className="text-sm font-medium text-[#414755] mt-0.5">Frequent Traveler & Explorer</p>
        </div>

        {/* Travel Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5">
          <div className="p-2">
            <span className="block text-2xl font-extrabold text-[#0058bc]">12</span>
            <span className="text-xs font-semibold text-[#414755]">Countries</span>
          </div>
          <div className="p-2 border-x border-black/5">
            <span className="block text-2xl font-extrabold text-[#0058bc]">28</span>
            <span className="text-xs font-semibold text-[#414755]">Cities</span>
          </div>
          <div className="p-2">
            <span className="block text-2xl font-extrabold text-[#0058bc]">4</span>
            <span className="text-xs font-semibold text-[#414755]">Trips Planned</span>
          </div>
        </div>
      </div>

      {/* Preferences Summary */}
      <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1a1b1f]">Travel Preferences</h3>
          <button
            onClick={onReRunOnboarding}
            className="text-[#0058bc] font-semibold text-sm hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            <span>Edit Setup</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs font-semibold text-[#414755] uppercase tracking-wider block mb-1">
              Favorite Styles
            </span>
            <div className="flex flex-wrap gap-2">
              {preferences.styles.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#0058bc]/10 text-[#0058bc] rounded-full text-xs font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-black/5">
            <span className="text-xs font-semibold text-[#414755] uppercase tracking-wider block mb-1">
              Preferred Accommodation
            </span>
            <span className="px-3 py-1 bg-[#6ffb85]/30 text-[#00732a] rounded-full text-xs font-bold uppercase">
              {preferences.stay}
            </span>
          </div>

          <div className="pt-2 border-t border-black/5">
            <span className="text-xs font-semibold text-[#414755] uppercase tracking-wider block mb-1">
              Transit Preferences
            </span>
            <div className="flex flex-wrap gap-2">
              {preferences.transit.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#eeedf3] text-[#1a1b1f] rounded-full text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] space-y-3">
        <h3 className="text-xl font-bold text-[#1a1b1f]">App Settings</h3>

        <div className="space-y-1">
          <div className="flex items-center justify-between p-3 hover:bg-[#f4f3f8] rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0058bc]">language</span>
              <span className="font-semibold text-[#1a1b1f] text-sm">Currency & Language</span>
            </div>
            <span className="text-xs font-bold text-[#414755]">INR (₹) / English</span>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-[#f4f3f8] rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0058bc]">notifications</span>
              <span className="font-semibold text-[#1a1b1f] text-sm">Trip Alerts & Weather</span>
            </div>
            <span className="text-xs font-bold text-[#006e28]">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-[#f4f3f8] rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0058bc]">cloud_done</span>
              <div>
                <span className="font-semibold text-[#1a1b1f] text-sm block">Auto-Save & Local Sync</span>
                <span className="text-[11px] text-[#717786]">All itineraries & timings saved on this device</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
          </div>

          {onResetData && (
            <div className="pt-2 border-t border-black/5">
              {showResetConfirm ? (
                <div className="p-3 bg-red-50 rounded-xl space-y-2 border border-red-200">
                  <p className="text-xs font-semibold text-red-800">
                    Are you sure you want to reset all saved trips and restore default samples?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onResetData();
                        setShowResetConfirm(false);
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Yes, Reset Data
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 bg-white text-[#414755] border border-black/10 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-between p-3 text-red-600 hover:bg-red-50/60 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">restart_alt</span>
                    <span className="font-semibold text-sm">Reset to Default Sample Data</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
