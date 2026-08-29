import React, { useState } from 'react';

interface OnboardingViewProps {
  onCompleteOnboarding: (preferences: {
    userName?: string;
    styles: string[];
    stay: string;
    transit: string[];
  }) => void;
  onSkip: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onCompleteOnboarding,
  onSkip,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selections
  const [userName, setUserName] = useState<string>('Alex');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Adventure', 'Nature']);
  const [selectedStay, setSelectedStay] = useState<string>('5star');
  const [selectedTransit, setSelectedTransit] = useState<string[]>(['Walking', 'Train']);

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const toggleTransit = (mode: string) => {
    if (selectedTransit.includes(mode)) {
      setSelectedTransit(selectedTransit.filter((t) => t !== mode));
    } else {
      setSelectedTransit([...selectedTransit, mode]);
    }
  };

  const travelStylesList = [
    { label: 'Adventure', icon: 'explore' },
    { label: 'Luxury', icon: 'diamond' },
    { label: 'Nature', icon: 'park' },
    { label: 'Backpacking', icon: 'backpack' },
    { label: 'Road Trip', icon: 'directions_car' },
    { label: 'Food', icon: 'restaurant' },
    { label: 'Photography', icon: 'photo_camera' },
    { label: 'Beach', icon: 'beach_access' },
    { label: 'Family', icon: 'family_restroom' },
    { label: 'Solo', icon: 'person' },
    { label: 'Couple', icon: 'favorite' },
    { label: 'Business', icon: 'business_center' },
  ];

  const stayOptions = [
    { id: '5star', title: '5 Star', badge: '$$$$', desc: 'Ultimate luxury, world-class amenities, and premium service.' },
    { id: '4star', title: '4 Star', badge: '$$$', desc: 'Upscale comfort with excellent facilities and stylish interiors.' },
    { id: '3star', title: '3 Star', badge: '$$', desc: 'Reliable quality, essential amenities, and great value for money.' },
    { id: 'villa', title: 'Villa', badge: '$$$$', desc: 'Private, spacious retreats perfect for families or secluded getaways.' },
    { id: 'apartment', title: 'Apartment', badge: '$$', desc: 'A home away from home with kitchen facilities and local vibes.' },
    { id: 'hostel', title: 'Hostel', badge: '$', desc: 'Social, budget-friendly environments for solo travelers and groups.' },
  ];

  const transitOptions = [
    { label: 'Walking', icon: 'directions_walk' },
    { label: 'Scooter', icon: 'electric_scooter' },
    { label: 'Bike', icon: 'directions_bike' },
    { label: 'Car', icon: 'directions_car' },
    { label: 'Taxi', icon: 'local_taxi' },
    { label: 'Public Transport', icon: 'directions_bus' },
    { label: 'Train', icon: 'train', subtitle: 'Regional and high-speed rail', isWide: true },
  ];

  const handleFinish = () => {
    onCompleteOnboarding({
      userName: userName.trim() || 'Alex',
      styles: selectedStyles,
      stay: selectedStay,
      transit: selectedTransit,
    });
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-xl mx-auto pb-28 pt-4">
      {/* Step Header */}
      <div>
        {step > 1 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="p-1 text-[#414755] hover:text-[#0058bc] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <span className="text-xs font-semibold text-[#414755] uppercase tracking-widest">
                Step {step} of 3
              </span>
              <div className="w-6" />
            </div>
            <div className="h-1.5 w-full bg-[#e3e2e7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0058bc] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Welcome to Lumi */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#1a1b1f] mb-2">Welcome to Lumi</h2>
              <p className="text-[#414755] text-base leading-relaxed">
                Tell us how you like to travel. We'll use this to craft your perfect itinerary.
              </p>
            </div>

            {/* User Name Input */}
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-xs space-y-1.5">
              <label className="text-xs font-bold text-[#414755] block">Your First Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full h-11 px-3.5 rounded-xl border border-[#c1c6d7] text-sm font-semibold focus:ring-2 focus:ring-[#0058bc] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {travelStylesList.map((item) => {
                const isSelected = selectedStyles.includes(item.label);
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleStyle(item.label)}
                    className={`p-4 rounded-[24px] border transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm active:scale-95 ${
                      isSelected
                        ? 'border-[#0058bc] bg-[#0058bc]/10 text-[#0058bc]'
                        : 'border-black/5 bg-white text-[#1a1b1f] hover:border-[#0058bc]/30'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-3xl mb-2 transition-transform ${
                        isSelected ? 'scale-110 text-[#0058bc]' : 'text-[#0058bc]'
                      }`}
                      style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Stay Your Way */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#1a1b1f] mb-1">Stay Your Way</h2>
              <p className="text-[#414755] text-base">What kind of stays do you prefer?</p>
            </div>

            <div className="space-y-3">
              {stayOptions.map((opt) => {
                const isSelected = selectedStay === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedStay(opt.id)}
                    className={`p-5 rounded-[24px] border transition-all cursor-pointer flex items-center shadow-sm ${
                      isSelected
                        ? 'border-[#0058bc] bg-[#0058bc]/5 shadow-md'
                        : 'border-black/5 bg-white hover:border-[#0058bc]/30'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-[#1a1b1f]">{opt.title}</span>
                        <span className="px-2 py-0.5 bg-[#6ffb85]/30 text-[#00732a] font-bold text-xs rounded-full">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-sm text-[#414755] leading-relaxed">{opt.desc}</p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'border-[#0058bc] bg-[#0058bc]' : 'border-[#c1c6d7]'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Getting Around */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#1a1b1f] mb-1">Getting Around</h2>
              <p className="text-[#414755] text-base leading-relaxed">
                How do you like to explore? Select all that apply to personalize your transit routes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {transitOptions.map((item) => {
                const isSelected = selectedTransit.includes(item.label);
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleTransit(item.label)}
                    className={`p-5 rounded-[24px] border text-left transition-all relative flex flex-col justify-between cursor-pointer shadow-sm active:scale-95 ${
                      item.isWide ? 'col-span-2' : ''
                    } ${
                      isSelected
                        ? 'border-[#0058bc] bg-[#d8e2ff] text-[#001a41]'
                        : 'border-black/5 bg-white text-[#1a1b1f] hover:border-[#0058bc]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#0058bc] text-white' : 'bg-[#0058bc]/10 text-[#0058bc]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <span className="font-bold text-base block">{item.label}</span>
                        {item.subtitle && (
                          <span className="text-xs text-[#414755]">{item.subtitle}</span>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span
                        className={`material-symbols-outlined text-xl ${
                          isSelected ? 'text-[#0058bc]' : 'text-transparent'
                        }`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2 p-3 bg-[#f4f3f8] rounded-xl text-xs text-[#414755]">
              <span className="material-symbols-outlined text-[#0058bc] text-base">info</span>
              <span>You can adjust these anytime in your profile settings.</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <footer className="pt-6 border-t border-black/5 flex items-center justify-between">
        {step === 1 ? (
          <button
            onClick={onSkip}
            className="text-[#414755] font-semibold text-sm hover:text-[#1a1b1f] cursor-pointer"
          >
            Skip for now
          </button>
        ) : (
          <span />
        )}

        <button
          onClick={() => {
            if (step === 1) setStep(2);
            else if (step === 2) setStep(3);
            else handleFinish();
          }}
          className="bg-[#0058bc] text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg hover:bg-[#004493] active:scale-95 transition-all flex items-center gap-2 cursor-pointer ml-auto"
        >
          <span>{step === 3 ? 'Finish Setup' : 'Continue'}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
