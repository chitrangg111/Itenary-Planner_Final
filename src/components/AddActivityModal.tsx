import React, { useState } from 'react';
import { ItineraryActivity } from '../types';
import { getAccuratePhotoUrl } from '../utils/photoResolver';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: ItineraryActivity, period: 'Morning' | 'Afternoon' | 'Evening') => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
}) => {
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('2.0 hrs');
  const [costText, setCostText] = useState('Free');
  const [openingHours, setOpeningHours] = useState('9:00 AM - 6:00 PM');
  const [ticketPrice, setTicketPrice] = useState('Free Entry');
  const [description, setDescription] = useState('');
  const [localTip, setLocalTip] = useState('');
  const [recommendedTransit, setRecommendedTransit] = useState('');
  const [publicTransportOptions, setPublicTransportOptions] = useState('');
  const [routeGuidance, setRouteGuidance] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const transitInfo = (recommendedTransit.trim() || publicTransportOptions.trim() || routeGuidance.trim())
      ? {
          recommendedMethod: recommendedTransit.trim() || 'Public Transit',
          applicablePublicTransport: publicTransportOptions
            ? publicTransportOptions.split(',').map(s => s.trim()).filter(Boolean)
            : ['Local Bus', 'Metro', 'Taxi'],
          routeGuidance: routeGuidance.trim() || undefined
        }
      : undefined;

    const newAct: ItineraryActivity = {
      id: `custom-act-${Date.now()}`,
      title: title.trim(),
      time: `${time} • ${duration}`,
      duration,
      costBadgeText: costText,
      costBadgeClass: costText.toLowerCase().includes('free')
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-blue-100 text-blue-800',
      description: description.trim() || 'Custom planned activity.',
      imageUrl: getAccuratePhotoUrl(title.trim(), 'activity'),
      openingHours: openingHours.trim() || undefined,
      ticketPrice: ticketPrice.trim() || undefined,
      tags: [{ icon: 'camera', text: 'Custom Activity', colorClass: 'bg-blue-50 text-blue-700' }],
      localTip: localTip.trim() ? `"${localTip.trim()}"` : undefined,
      transitInfo
    };

    onAddActivity(newAct, period);
    setTitle('');
    setDescription('');
    setLocalTip('');
    setRecommendedTransit('');
    setPublicTransportOptions('');
    setRouteGuidance('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b border-black/5 pb-3">
          <h3 className="text-xl font-bold text-[#1a1b1f]">Add Activity to Itinerary</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#717786] hover:text-[#1a1b1f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#414755] block mb-1">Activity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Tea Ceremony"
              className="w-full h-12 rounded-xl border border-[#c1c6d7] px-4 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Time of Day</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full h-12 rounded-xl border border-[#c1c6d7] px-3 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full h-12 rounded-xl border border-[#c1c6d7] px-4 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Opening Hours / Timings</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="e.g. 9:00 AM - 6:00 PM"
                className="w-full h-12 rounded-xl border border-[#c1c6d7] px-4 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Ticket Price</label>
              <input
                type="text"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                placeholder="e.g. ₹50 / Free Entry"
                className="w-full h-12 rounded-xl border border-[#c1c6d7] px-4 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#414755] block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of the activity..."
              rows={2}
              className="w-full rounded-xl border border-[#c1c6d7] p-3 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#414755] block mb-1">Local Tip (Optional)</label>
            <input
              type="text"
              value={localTip}
              onChange={(e) => setLocalTip(e.target.value)}
              placeholder="e.g. Book 1 week in advance for sunset slot"
              className="w-full h-12 rounded-xl border border-[#c1c6d7] px-4 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
            />
          </div>

          <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200/60 space-y-3">
            <span className="text-xs font-bold text-[#0058bc] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">directions_bus</span>
              Transportation & Public Transit Info
            </span>

            <div>
              <label className="text-[11px] font-semibold text-[#414755] block mb-1">
                Best Route / Transit Method
              </label>
              <input
                type="text"
                value={recommendedTransit}
                onChange={(e) => setRecommendedTransit(e.target.value)}
                placeholder="e.g. BEST Bus #103 / Kaali-Peeli Taxi"
                className="w-full h-10 rounded-xl border border-[#c1c6d7] bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#414755] block mb-1">
                Applicable Public Transport (Comma Separated)
              </label>
              <input
                type="text"
                value={publicTransportOptions}
                onChange={(e) => setPublicTransportOptions(e.target.value)}
                placeholder="e.g. BEST Bus #103, Local Train (CSMT), Taxi, Metro Line 3"
                className="w-full h-10 rounded-xl border border-[#c1c6d7] bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#414755] block mb-1">
                Point-to-Point Route Guidance
              </label>
              <input
                type="text"
                value={routeGuidance}
                onChange={(e) => setRouteGuidance(e.target.value)}
                placeholder="e.g. Take BEST Bus #103 from Regal Cinema stop (~10 mins, ₹15)"
                className="w-full h-10 rounded-xl border border-[#c1c6d7] bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-full border border-black/10 text-[#414755] font-bold text-sm hover:bg-[#eeedf3] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-full bg-[#0058bc] text-white font-bold text-sm hover:bg-[#004493] cursor-pointer shadow-md"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
