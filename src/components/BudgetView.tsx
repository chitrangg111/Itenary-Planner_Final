import React, { useState } from 'react';
import { ExpenseItem } from '../types';

interface BudgetViewProps {
  expenses: ExpenseItem[];
  onAddExpenseClick: () => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({ expenses, onAddExpenseClick }) => {
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'THB' | 'AED'>('INR');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  // Amounts
  const totalBudgetINR = 45000;
  const spentINR = expenses.reduce((acc, curr) => acc + curr.amountINR, 0);
  const remainingINR = Math.max(0, totalBudgetINR - spentINR);
  const percentUsed = Math.min(100, Math.round((spentINR / totalBudgetINR) * 100));

  // Currency rates (1 INR = X currency)
  const rates: Record<string, { rate: number; symbol: string }> = {
    INR: { rate: 1, symbol: '₹' },
    USD: { rate: 0.012, symbol: '$' },
    THB: { rate: 0.42, symbol: '฿' },
    AED: { rate: 0.044, symbol: 'AED ' },
  };

  const formatAmount = (inrVal: number) => {
    const config = rates[currency] || rates.INR;
    const val = inrVal * config.rate;
    if (currency === 'INR') {
      return `₹${inrVal.toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${val.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
  };

  // Group Split calculation
  const totalSplitCount = 3; // You + Rahul + Ankit
  const perPersonShare = Math.round(spentINR / totalSplitCount);

  const generateWhatsAppSplitText = () => {
    let text = `🌴 *Goa Trip Expense Split Summary*\n\n`;
    text += `💰 Total Trip Expense: ₹${spentINR.toLocaleString('en-IN')}\n`;
    text += `👥 Members (3): You, Rahul, Ankit\n`;
    text += `👉 *Per Person Share: ₹${perPersonShare.toLocaleString('en-IN')}*\n\n`;
    text += `*Expense Items:*\n`;
    expenses.forEach((e) => {
      text += `• ${e.title}: ₹${e.amountINR} (${e.paymentMethod || 'UPI'})\n`;
    });
    text += `\nPay via GPay / PhonePe / Paytm UPI. Thanks guys! 🎉`;
    return text;
  };

  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(generateWhatsAppSplitText());
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 2500);
  };

  // Circular progress ring
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentUsed / 100) * circumference;

  return (
    <div className="space-y-6 pb-28">
      {/* Header Section */}
      <section className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0058bc] uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">payments</span>
            <span>UPI & Budget Tracker</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1b1f]">
            Financial Overview
          </h2>
        </div>

        {/* Currency Switcher Pill */}
        <div className="bg-[#eeedf3] rounded-full p-1 flex gap-1 shadow-inner overflow-x-auto max-w-[210px] no-scrollbar">
          {(['INR', 'THB', 'AED', 'USD'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-2.5 py-1 rounded-full font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                currency === curr
                  ? 'bg-[#0058bc] text-white shadow-sm'
                  : 'text-[#414755] hover:text-[#1a1b1f]'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </section>

      {/* Main Budget Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Circular Progress */}
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-6 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center space-y-4 md:col-span-1">
          <div className="relative flex items-center justify-center">
            <svg className="w-44 h-44">
              <circle
                className="text-emerald-100"
                cx="88"
                cy="88"
                r="76"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
              />
              <circle
                className="text-[#006e28] transition-all duration-700 ease-out"
                cx="88"
                cy="88"
                r="76"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 76} ${2 * Math.PI * 76}`}
                strokeDashoffset={(2 * Math.PI * 76) - (percentUsed / 100) * (2 * Math.PI * 76)}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-[#1a1b1f] tracking-tighter">
                {percentUsed}%
              </span>
              <p className="text-xs font-semibold text-[#414755]">Budget Spent</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#414755]">
              Spent {formatAmount(spentINR)} of {formatAmount(totalBudgetINR)}
            </p>
          </div>
        </div>

        {/* Middle: Total vs Remaining & Group Split Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-6 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#414755]">Total Trip Budget</p>
              <h3 className="text-3xl font-extrabold text-[#1a1b1f] tracking-tight">
                {formatAmount(totalBudgetINR)}
              </h3>
              <div className="flex items-center gap-1 text-[#006e28] text-xs font-semibold">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>On Track for 5-Day Trip</span>
              </div>
            </div>

            <div className="bg-[#0058bc]/5 rounded-2xl p-4 border border-[#0058bc]/10 space-y-1">
              <p className="text-xs font-bold text-[#0058bc]">Remaining Balance</p>
              <p className="text-2xl font-extrabold text-[#0058bc] tracking-tight">
                {formatAmount(remainingINR)}
              </p>
              <p className="text-xs font-semibold text-[#0058bc]/80">
                ~{formatAmount(Math.round(remainingINR / 3))} / person remaining
              </p>
            </div>
          </div>

          {/* Quick Group Split Generator Card */}
          <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ₹
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">Group Split (3 Travellers)</p>
                <p className="text-sm font-bold text-emerald-800">
                  ₹{perPersonShare.toLocaleString('en-IN')} <span className="text-xs font-normal">/ person</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-base">share</span>
              <span>WhatsApp Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown Categories */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[#1a1b1f]">Category Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined text-lg">restaurant</span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-full">UPI & Cash</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Food & Shacks</p>
              <p className="font-bold text-[#1a1b1f]">{formatAmount(8200)}</p>
            </div>
          </div>

          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined text-lg">train</span>
              </div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded-full">IRCTC / Vande</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Train & Flights</p>
              <p className="font-bold text-[#1a1b1f]">{formatAmount(5800)}</p>
            </div>
          </div>

          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-lg">surfing</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full">Water Sports</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Activities</p>
              <p className="font-bold text-[#1a1b1f]">{formatAmount(5500)}</p>
            </div>
          </div>

          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <span className="material-symbols-outlined text-lg">moped</span>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded-full">Scooty / Cab</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Local Transport</p>
              <p className="font-bold text-[#1a1b1f]">{formatAmount(3800)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Expenses List */}
      <section className="bg-white/90 backdrop-blur-md rounded-[24px] p-5 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#1a1b1f]">Recent Expenses & UPI Logs</h3>
          <button
            onClick={onAddExpenseClick}
            className="text-[#0058bc] text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Add Log</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {expenses.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 hover:bg-[#f4f3f8] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-black/5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center ${item.iconColor} shrink-0`}>
                  <span className="material-symbols-outlined">
                    {item.icon === 'utensils'
                      ? 'restaurant'
                      : item.icon === 'train'
                      ? 'train'
                      : item.icon === 'surfing'
                      ? 'surfing'
                      : item.icon === 'moped'
                      ? 'moped'
                      : 'payments'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#1a1b1f] text-sm">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs text-[#414755]">
                    <span>{item.time}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#0058bc]">{item.paymentMethod || 'UPI GPay'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#1a1b1f]">- {formatAmount(item.amountINR)}</p>
                {item.paidBy && (
                  <p className="text-[11px] text-emerald-700 font-medium">Paid by {item.paidBy}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp Split Share Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <span className="material-symbols-outlined text-2xl">chat</span>
                <h3>WhatsApp Bill Split</h3>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {generateWhatsAppSplitText()}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyWhatsAppText}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">
                  {whatsappCopied ? 'done' : 'content_copy'}
                </span>
                <span>{whatsappCopied ? 'Copied to Clipboard!' : 'Copy for WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="sticky bottom-4 flex justify-end z-30 pointer-events-none">
        <button
          onClick={onAddExpenseClick}
          className="pointer-events-auto w-14 h-14 bg-[#0058bc] text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-[#004493] cursor-pointer"
          title="Add New Expense"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

