import React, { useState, useEffect } from 'react';
import { TripItinerary } from '../types';
import {
  getShareableTripUrl,
  generateItineraryText,
  shareTripNative,
  copyTextToClipboard,
  downloadOfflineHtmlItinerary,
} from '../utils/shareUtils';

interface ShareExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripItinerary;
}

export const ShareExportModal: React.FC<ShareExportModalProps> = ({
  isOpen,
  onClose,
  trip,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'export'>('share');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    if (isOpen && trip) {
      setShareUrl(getShareableTripUrl(trip));
    }
  }, [isOpen, trip]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyTextSummary = async () => {
    const text = generateItineraryText(trip, shareUrl);
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const res = await shareTripNative(trip);
    if (res.method === 'clipboard' && res.success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = generateItineraryText(trip, shareUrl);
    const encoded = encodeURIComponent(text);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handlePrintToPdf = () => {
    setIsExportingPdf(true);
    setTimeout(() => {
      window.print();
      setIsExportingPdf(false);
    }, 250);
  };

  const handleDownloadHtml = () => {
    downloadOfflineHtmlItinerary(trip);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn no-print">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-blue-50/50 via-white to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">ios_share</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1a1b1f] tracking-tight">
                Share & Export Itinerary
              </h2>
              <p className="text-xs text-[#575e71] font-medium">
                {trip.destination} &bull; {trip.dates}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 px-4 pt-2 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'share'
                ? 'border-[#0058bc] text-[#0058bc]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-base">link</span>
            <span>Share Link & Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'export'
                ? 'border-[#0058bc] text-[#0058bc]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Export PDF & Docs</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'share' ? (
            <div className="space-y-4">
              {/* Shareable Link Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span>Shareable Itinerary Link</span>
                  {copiedLink && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Link Copied!
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 truncate select-all focus:outline-hidden"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-[#0058bc] text-white font-bold text-xs hover:bg-[#004493] active:scale-95 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copiedLink ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Anyone with this link can open your full interactive trip with all days, hotel recommendations, and directions.
                </p>
              </div>

              {/* Instant Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Native OS Share */}
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 hover:border-[#0058bc] hover:bg-blue-50/40 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="material-symbols-outlined text-lg text-[#0058bc]">share</span>
                  <span>Share via Apps / AirDrop</span>
                </button>

                {/* WhatsApp Share */}
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>Share on WhatsApp</span>
                </button>
              </div>

              {/* Formatted Text Summary Box */}
              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-600 text-sm">subject</span>
                    <span className="text-xs font-bold text-gray-800">Ready-to-Paste Group Summary</span>
                  </div>
                  <button
                    onClick={handleCopyTextSummary}
                    className="text-[11px] font-bold text-[#0058bc] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {copiedText ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedText ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 text-[11px] text-gray-600 font-mono max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                  {generateItineraryText(trip, shareUrl)}
                </div>
              </div>

              {/* Trip Highlights Snapshot Card */}
              <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                    Trip Overview
                  </span>
                  <div className="font-extrabold text-sm">{trip.destination}</div>
                  <div className="text-[11px] text-white/80 mt-0.5">
                    {trip.dayItineraries?.length || 0} Days &bull; {trip.travellers || '2 Travellers'}
                    {trip.budgetSummary?.totalEstimatedCost ? ` &bull; ${trip.budgetSummary.totalEstimatedCost}` : ''}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <span className="material-symbols-outlined text-xl text-amber-300">verified</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Print to PDF Option */}
              <div className="border border-blue-100 bg-blue-50/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0058bc] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900">
                      Save as Clean PDF Document
                    </h3>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                      Generates a print-ready vector PDF containing day-by-day activities, timings, budget breakdown, hotel recommendations, and transit guides.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePrintToPdf}
                  disabled={isExportingPdf}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0058bc] hover:bg-[#004493] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-lg">print</span>
                  <span>{isExportingPdf ? 'Preparing PDF Print...' : 'Open Print & Save as PDF'}</span>
                </button>
                <p className="text-[10px] text-gray-500 text-center">
                  💡 In the print preview, select <strong>"Save as PDF"</strong> as the Destination.
                </p>
              </div>

              {/* Standalone HTML File Option */}
              <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl">download_for_offline</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900">
                      Download Offline HTML Itinerary
                    </h3>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                      Download a self-contained offline document you can open anywhere without internet, send via email attachment, or print anytime.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadHtml}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="material-symbols-outlined text-lg text-emerald-600">download</span>
                  <span>Download Offline Travel File (.html)</span>
                </button>
              </div>

              {/* PDF Preview Specs */}
              <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 space-y-1 border border-gray-100">
                <div className="font-bold text-gray-700">📄 Included in your export:</div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                  <span>Complete departure & return schedules ({trip.tripStartTime || '06:30 AM'} ➔ {trip.tripEndTime || '09:45 PM'})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                  <span>Every day's morning, afternoon & evening activities + costs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                  <span>Local bus, metro & auto transit directions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                  <span>Full budget summary & hotel recommendations</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
