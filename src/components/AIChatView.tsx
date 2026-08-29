import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface AIChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg);
  };

  const handleChipClick = async (chipText: string) => {
    if (isLoading) return;
    await onSendMessage(chipText);
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser environment.");
      return;
    }
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Messages */}
      <div className="space-y-6 py-2 flex-1">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {msg.sender === 'lumi' ? (
              <div className="flex flex-col gap-1.5 max-w-[92%] md:max-w-[85%]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="material-symbols-outlined text-[#0070eb] text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    smart_toy
                  </span>
                  <span className="text-xs font-semibold text-[#414755]">Lumi AI</span>
                </div>

                <div className="p-4 rounded-2xl rounded-tl-none bg-[#f4f3f8] border border-black/5 shadow-sm text-[#1a1b1f] text-sm md:text-base leading-relaxed space-y-3">
                  {msg.isUpdatedBadge && (
                    <div className="flex items-center gap-1.5 text-[#006e28] font-semibold text-sm">
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      <span>Itinerary Draft Ready</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Preview Card if exists */}
                  {msg.previewCard && (
                    <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 active:scale-[0.99] transition-transform cursor-pointer">
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{ backgroundImage: `url('${msg.previewCard.imageUrl}')` }}
                      />
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-[#1a1b1f]">
                            {msg.previewCard.title}
                          </h4>
                          <span className="px-2 py-0.5 bg-[#6ffb85] text-[#00732a] text-[10px] font-bold rounded-full uppercase">
                            {msg.previewCard.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#414755] text-xs">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span>{msg.previewCard.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Integrated Map Snippet if exists */}
                  {msg.mapSnippet && (
                    <div className="rounded-xl overflow-hidden border border-black/5 h-40 relative group cursor-pointer">
                      <img
                        src={msg.mapSnippet.imageUrl}
                        alt={msg.mapSnippet.location}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-[#0058bc] text-base">
                          location_on
                        </span>
                        <span className="text-xs font-bold text-[#1a1b1f]">
                          View Route Map
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[85%] md:max-w-[75%]">
                <div className="p-4 rounded-2xl rounded-tr-none bg-[#0058bc] text-white shadow-sm text-sm md:text-base leading-relaxed">
                  {msg.text}
                </div>
                {msg.time && (
                  <span className="text-[11px] font-medium text-[#414755] mr-1">
                    {msg.time}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 max-w-[80%]">
            <span
              className="material-symbols-outlined text-[#0070eb] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
            <div className="p-4 rounded-2xl rounded-tl-none bg-[#f4f3f8] border border-black/5 text-[#414755] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-base">sync</span>
              <span>Lumi is customizing your itinerary...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Sticky Prompt Chips & Input Bar */}
      <div className="sticky bottom-0 w-full z-20 bg-[#faf9fe]/95 backdrop-blur-md pt-2">
        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 px-1">
          {[
            '3-Day Jaipur Heritage Plan',
            '4-Day Kerala Backwaters',
            'Customize for Pure Veg Food',
            '3-Day Manali Budget Trip',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="flex-shrink-0 px-4 py-2 rounded-full bg-[#e9e7ed] border border-black/5 text-[#414755] text-xs font-semibold hover:bg-[#d8e2ff] hover:text-[#001a41] transition-colors active:scale-95 cursor-pointer shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="pb-4">
          <div className="bg-white/90 backdrop-blur-xl border border-black/10 rounded-[28px] shadow-lg flex items-center p-2 gap-2">
            <button
              type="button"
              onClick={() => alert("Attachment upload ready!")}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#414755] hover:bg-[#eeedf3] transition-colors cursor-pointer"
              title="Add Attachment"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Lumi to plan or customize an itinerary..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base py-2 px-1 text-[#1a1b1f] outline-none"
            />

            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-[#0070eb] bg-[#0058bc]/5 hover:bg-[#0058bc]/10'
              }`}
              title="Voice Input"
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mic
              </span>
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#0058bc] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_upward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

