import React, { useState, useEffect } from 'react';
import { ExpenseItem, TripItinerary } from '../types';
import { CurrencyConverterWidget } from './CurrencyConverterWidget';
import {
  SUPPORTED_CURRENCIES,
  getDestinationCurrency,
  convertCurrency,
  formatCurrencyAmount,
} from '../utils/currency';

interface BudgetViewProps {
  expenses: ExpenseItem[];
  onAddExpenseClick: () => void;
  currentTrip?: TripItinerary;
  homeCurrency?: string;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  expenses,
  onAddExpenseClick,
  currentTrip,
  homeCurrency: initialHomeCurrency = 'INR',
}) => {
  const destination = currentTrip?.destination || 'Goa, India';
  const detectedLocal = getDestinationCurrency(destination);

  const [homeCurrency, setHomeCurrency] = useState<string>(initialHomeCurrency);
  const [localCurrency, setLocalCurrency] = useState<string>(detectedLocal.code);
  const [currencyDisplayMode, setCurrencyDisplayMode] = useState<'home' | 'local' | 'dual'>('home');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  // Update local currency if destination changes
  useEffect(() => {
    if (destination) {
      setLocalCurrency(getDestinationCurrency(destination).code);
    }
  }, [destination]);

  // Amounts in INR
  const totalBudgetINR = 45000;
  const spentINR = expenses.reduce((acc, curr) => acc + curr.amountINR, 0);
  const remainingINR = Math.max(0, totalBudgetINR - spentINR);
  const percentUsed = Math.min(100, Math.round((spentINR / totalBudgetINR) * 100));

  const homeInfo = SUPPORTED_CURRENCIES[homeCurrency] || SUPPORTED_CURRENCIES.INR;
  const localInfo = SUPPORTED_CURRENCIES[localCurrency] || SUPPORTED_CURRENCIES.JPY;
  const isDifferentCurrency = homeCurrency !== localCurrency;

  // Format amount based on current display mode
  const formatAmount = (inrVal: number, mode = currencyDisplayMode) => {
    const homeVal = convertCurrency(inrVal, 'INR', homeCurrency);
    const localVal = convertCurrency(inrVal, 'INR', localCurrency);

    if (mode === 'local') {
      return formatCurrencyAmount(localVal, localCurrency);
    }
    if (mode === 'dual' && isDifferentCurrency) {
      return `${formatCurrencyAmount(homeVal, homeCurrency)} (${formatCurrencyAmount(localVal, localCurrency)})`;
    }
    return formatCurrencyAmount(homeVal, homeCurrency);
  };

  // Group Split calculation
  const totalSplitCount = 3; // You + Rahul + Ankit
  const perPersonShareINR = Math.round(spentINR / totalSplitCount);

  const generateWhatsAppSplitText = () => {
    const homeTotal = formatCurrencyAmount(convertCurrency(spentINR, 'INR', homeCurrency), homeCurrency);
    const localTotal = isDifferentCurrency
      ? ` (~ ${formatCurrencyAmount(convertCurrency(spentINR, 'INR', localCurrency), localCurrency)})`
      : '';
    const perPersonHome = formatCurrencyAmount(convertCurrency(perPersonShareINR, 'INR', homeCurrency), homeCurrency);
    const perPersonLocal = isDifferentCurrency
      ? ` (~ ${formatCurrencyAmount(convertCurrency(perPersonShareINR, 'INR', localCurrency), localCurrency)})`
      : '';

    let text = `🌴 *${destination} Trip Expense Split Summary*\n\n`;
    text += `💰 Total Trip Expense: ${homeTotal}${localTotal}\n`;
    text += `👥 Members (3): You, Rahul, Ankit\n`;
    text += `👉 *Per Person Share: ${perPersonHome}${perPersonLocal}*\n\n`;
    text += `*Expense Items:*\n`;
    expenses.forEach((e) => {
      const eHome = formatCurrencyAmount(convertCurrency(e.amountINR, 'INR', homeCurrency), homeCurrency);
      const eLocal = isDifferentCurrency
        ? ` [${formatCurrencyAmount(convertCurrency(e.amountINR, 'INR', localCurrency), localCurrency)}]`
        : '';
      text += `• ${e.title}: ${eHome}${eLocal} (${e.paymentMethod || 'UPI'})\n`;
    });
    text += `\nExchange reference: 1 ${localCurrency} ≈ ${formatCurrencyAmount(convertCurrency(1, localCurrency, homeCurrency), homeCurrency)}\n`;
    text += `Pay via GPay / PhonePe / Paytm UPI or Wire. Thanks guys! 🎉`;
    return text;
  };

  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(generateWhatsAppSplitText());
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0058bc] uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">payments</span>
            <span>Currency & Budget Tracker</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1b1f] flex items-center gap-2 flex-wrap">
            <span>Financial Overview</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0058bc] border border-blue-200">
              {destination.split(',')[0]} ({localInfo.code} {localInfo.flag})
            </span>
          </h2>
        </div>

        {/* Currency Display Mode Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-[#eeedf3] rounded-full p-1 shadow-inner self-start sm:self-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCurrencyDisplayMode('home')}
            className={`px-3 py-1 rounded-full font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              currencyDisplayMode === 'home'
                ? 'bg-[#0058bc] text-white shadow-xs'
                : 'text-[#414755] hover:text-[#1a1b1f]'
            }`}
            title={`Show in Home Currency (${homeInfo.code})`}
          >
            <span>{homeInfo.flag}</span>
            <span>Home ({homeInfo.code})</span>
          </button>

          {isDifferentCurrency && (
            <>
              <button
                onClick={() => setCurrencyDisplayMode('local')}
                className={`px-3 py-1 rounded-full font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  currencyDisplayMode === 'local'
                    ? 'bg-[#0058bc] text-white shadow-xs'
                    : 'text-[#414755] hover:text-[#1a1b1f]'
                }`}
                title={`Show in Trip Local Currency (${localInfo.code})`}
              >
                <span>{localInfo.flag}</span>
                <span>Local ({localInfo.code})</span>
              </button>

              <button
                onClick={() => setCurrencyDisplayMode('dual')}
                className={`px-2.5 py-1 rounded-full font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  currencyDisplayMode === 'dual'
                    ? 'bg-[#0058bc] text-white shadow-xs'
                    : 'text-[#414755] hover:text-[#1a1b1f]'
                }`}
                title="Show both Home & Local currencies side by side"
              >
                <span>Dual View</span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Embedded Currency Conversion Tool */}
      <CurrencyConverterWidget
        destination={destination}
        homeCurrency={homeCurrency}
        onHomeCurrencyChange={(curr) => setHomeCurrency(curr)}
        localCurrency={localCurrency}
        onLocalCurrencyChange={(curr) => setLocalCurrency(curr)}
        totalSpentINR={spentINR}
      />

      {/* Main Budget Progress & Split Card */}
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
              Spent {formatAmount(spentINR, 'home')} of {formatAmount(totalBudgetINR, 'home')}
            </p>
            {isDifferentCurrency && (
              <p className="text-xs text-gray-500 mt-0.5">
                Local: ~{formatAmount(spentINR, 'local')} of {formatAmount(totalBudgetINR, 'local')}
              </p>
            )}
          </div>
        </div>

        {/* Middle: Total vs Remaining & Group Split Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-6 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#414755]">
                Total Trip Budget ({currencyDisplayMode === 'local' ? localInfo.code : homeInfo.code})
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1b1f] tracking-tight">
                {formatAmount(totalBudgetINR)}
              </h3>
              {isDifferentCurrency && currencyDisplayMode === 'home' && (
                <p className="text-xs text-gray-500">
                  ≈ {formatAmount(totalBudgetINR, 'local')} ({localInfo.code})
                </p>
              )}
              <div className="flex items-center gap-1 text-[#006e28] text-xs font-semibold mt-1">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>On Track for {destination.split(',')[0]} Trip</span>
              </div>
            </div>

            <div className="bg-[#0058bc]/5 rounded-2xl p-4 border border-[#0058bc]/10 space-y-1">
              <p className="text-xs font-bold text-[#0058bc]">Remaining Balance</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0058bc] tracking-tight">
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
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {homeInfo.symbol.trim()}
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">Group Split (3 Travellers)</p>
                <p className="text-sm font-bold text-emerald-800">
                  {formatAmount(perPersonShareINR, 'home')}{' '}
                  {isDifferentCurrency && (
                    <span className="text-xs font-normal text-emerald-700">
                      (~{formatAmount(perPersonShareINR, 'local')})
                    </span>
                  )}
                  <span className="text-xs font-normal"> / person</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-base">share</span>
              <span>WhatsApp Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1a1b1f]">Category Breakdown</h3>
          <span className="text-xs text-gray-500 font-medium">
            Shown in {currencyDisplayMode === 'local' ? localInfo.code : homeInfo.code}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined text-lg">restaurant</span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-full">Dining</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Food & Dining</p>
              <p className="font-bold text-[#1a1b1f] text-sm">{formatAmount(8200)}</p>
            </div>
          </div>

          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined text-lg">train</span>
              </div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded-full">Transit</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Flights & Transit</p>
              <p className="font-bold text-[#1a1b1f] text-sm">{formatAmount(5800)}</p>
            </div>
          </div>

          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-lg">surfing</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full">Excursions</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Sightseeing & Tickets</p>
              <p className="font-bold text-[#1a1b1f] text-sm">{formatAmount(5500)}</p>
            </div>
          </div>

          <div className="bg-white/80 border border-black/5 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <span className="material-symbols-outlined text-lg">moped</span>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded-full">Local</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#414755]">Local City Commute</p>
              <p className="font-bold text-[#1a1b1f] text-sm">{formatAmount(3800)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Expenses List with Dual Currency Values */}
      <section className="bg-white/90 backdrop-blur-md rounded-[24px] p-5 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1a1b1f]">Recent Expenses</h3>
            <p className="text-xs text-gray-500">
              Showing converted expenses based on {destination.split(',')[0]} ({localInfo.code})
            </p>
          </div>
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
                    <span className="font-semibold text-[#0058bc]">{item.paymentMethod || 'UPI / Card'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#1a1b1f] text-sm">
                  - {formatAmount(item.amountINR, 'home')}
                </p>
                {isDifferentCurrency && (
                  <p className="text-[11px] text-gray-500 font-medium">
                    ≈ {formatAmount(item.amountINR, 'local')}
                  </p>
                )}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <span className="material-symbols-outlined text-2xl">chat</span>
                <h3>WhatsApp Bill Split</h3>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 cursor-pointer"
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
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-transform cursor-pointer"
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
