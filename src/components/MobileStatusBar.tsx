import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface MobileStatusBarProps {
  isSimulator?: boolean;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ isSimulator = false }) => {
  const [timeString, setTimeString] = useState('');
  const isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isNative) {
    return <div className="h-[env(safe-area-inset-top,0px)] w-full bg-[#faf9fe]" />;
  }

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-2 pb-1 text-xs font-semibold text-[#1a1b1f] select-none z-50 ${isSimulator ? 'bg-transparent' : 'bg-[#faf9fe]'}`}>
      {/* Time */}
      <div className="w-14 text-left font-bold tracking-tight text-[13px]">
        {timeString || '09:41'}
      </div>

      {/* Dynamic Island / Notch area */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-[10px] shadow-xs">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <span className="font-bold tracking-wider uppercase text-[9px] text-gray-200">Lumi Mobile</span>
      </div>

      {/* Status Icons */}
      <div className="w-14 flex items-center justify-end gap-1 text-[#1a1b1f]">
        <span className="material-symbols-outlined text-sm">signal_cellular_4_bar</span>
        <span className="material-symbols-outlined text-sm">wifi</span>
        <span className="material-symbols-outlined text-sm rotate-90">battery_full</span>
      </div>
    </div>
  );
};
