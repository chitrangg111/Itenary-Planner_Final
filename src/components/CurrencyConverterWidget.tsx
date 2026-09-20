import React, { useState, useEffect } from 'react';
import {
  SUPPORTED_CURRENCIES,
  CurrencyInfo,
  getDestinationCurrency,
  convertCurrency,
  formatCurrencyAmount,
} from '../utils/currency';

interface CurrencyConverterWidgetProps {
  destination?: string;
  homeCurrency?: string;
  onHomeCurrencyChange?: (currency: string) => void;
  localCurrency?: string;
  onLocalCurrencyChange?: (currency: string) => void;
  totalSpentINR?: number;
}

export const CurrencyConverterWidget: React.FC<CurrencyConverterWidgetProps> = ({
  destination,
  homeCurrency = 'INR',
  onHomeCurrencyChange,
  localCurrency: externalLocalCurrency,
  onLocalCurrencyChange,
  totalSpentINR = 0,
}) => {
  // Infer initial local currency from destination
  const defaultLocal = getDestinationCurrency(destination).code;
  const [localCode, setLocalCode] = useState<string>(externalLocalCurrency || defaultLocal);
  const [homeCode, setHomeCode] = useState<string>(homeCurrency);
  const [inputAmount, setInputAmount] = useState<string>('1000');
  const [direction, setDirection] = useState<'localToHome' | 'homeToLocal'>('localToHome');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Sync if destination changes
  useEffect(() => {
    if (destination && !externalLocalCurrency) {
      const detected = getDestinationCurrency(destination).code;
      setLocalCode(detected);
    }
  }, [destination, externalLocalCurrency]);

  useEffect(() => {
    if (externalLocalCurrency) {
      setLocalCode(externalLocalCurrency);
    }
  }, [externalLocalCurrency]);

  const handleLocalChange = (code: string) => {
    setLocalCode(code);
    if (onLocalCurrencyChange) {
      onLocalCurrencyChange(code);
    }
  };

  const handleHomeChange = (code: string) => {
    setHomeCode(code);
    if (onHomeCurrencyChange) {
      onHomeCurrencyChange(code);
    }
  };

  const handleSwap = () => {
    setDirection((prev) => (prev === 'localToHome' ? 'homeToLocal' : 'localToHome'));
  };

  const sourceCurrencyCode = direction === 'localToHome' ? localCode : homeCode;
  const targetCurrencyCode = direction === 'localToHome' ? homeCode : localCode;

  const sourceInfo: CurrencyInfo = SUPPORTED_CURRENCIES[sourceCurrencyCode] || SUPPORTED_CURRENCIES.JPY;
  const targetInfo: CurrencyInfo = SUPPORTED_CURRENCIES[targetCurrencyCode] || SUPPORTED_CURRENCIES.INR;

  const numericAmount = parseFloat(inputAmount) || 0;
  const convertedAmount = convertCurrency(numericAmount, sourceCurrencyCode, targetCurrencyCode);

  // Exchange rate comparison: 1 unit of source = X units of target
  const unitRate = convertCurrency(1, sourceCurrencyCode, targetCurrencyCode);
  const invertedRate = convertCurrency(1, targetCurrencyCode, sourceCurrencyCode);

  // Converted total expenses
  const totalLocalAmount = convertCurrency(totalSpentINR, 'INR', localCode);
  const totalHomeAmount = convertCurrency(totalSpentINR, 'INR', homeCode);

  // Quick preset chips based on source currency value
  const quickPresets = sourceInfo.decimalPlaces === 0 && sourceInfo.rateToINR < 1
    ? [500, 1000, 5000, 10000]
    : [10, 50, 100, 500];

  return (
    <div className="bg-linear-to-br from-white via-white to-blue-50/40 rounded-[24px] p-5 border border-black/5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all">
      {/* Header with expand toggle */}
      <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">currency_exchange</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-[#1a1b1f] tracking-tight">
                Currency Conversion Tool
              </h3>
              <span className="bg-[#0058bc]/10 text-[#0058bc] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Live Rates
              </span>
            </div>
            <p className="text-xs text-[#575e71]">
              Destination ({sourceInfo.code}) ➔ Home ({targetInfo.code})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-gray-100 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-black/5">
            1 {sourceInfo.code} ≈ {formatCurrencyAmount(unitRate, targetInfo.code)}
          </div>
          <button
            type="button"
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-transform"
            aria-label={isExpanded ? 'Collapse converter' : 'Expand converter'}
          >
            <span className={`material-symbols-outlined text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Converter Body */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          {/* Exchange Rate Badge Strip */}
          <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200/60 rounded-xl px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#003875] font-semibold">
              <span className="material-symbols-outlined text-base text-[#0058bc]">trending_up</span>
              <span>
                1 {sourceInfo.code} = <strong>{formatCurrencyAmount(unitRate, targetInfo.code)}</strong>
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              (1 {targetInfo.code} ≈ {formatCurrencyAmount(invertedRate, sourceInfo.code)})
            </div>
          </div>

          {/* Currency Selector Row */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            {/* Source Currency */}
            <div className="bg-white border border-gray-200 rounded-2xl p-2.5 shadow-2xs">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                {direction === 'localToHome' ? `Local (${destination ? destination.split(',')[0] : 'Trip'})` : 'Home Currency'}
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{sourceInfo.flag}</span>
                <select
                  value={sourceCurrencyCode}
                  onChange={(e) => {
                    if (direction === 'localToHome') {
                      handleLocalChange(e.target.value);
                    } else {
                      handleHomeChange(e.target.value);
                    }
                  }}
                  className="w-full text-xs font-bold text-gray-800 bg-transparent outline-hidden cursor-pointer"
                >
                  {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol.trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#0058bc] hover:text-[#0058bc] text-gray-600 flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
              title="Swap currencies"
            >
              <span className="material-symbols-outlined text-base">sync_alt</span>
            </button>

            {/* Target Currency */}
            <div className="bg-white border border-gray-200 rounded-2xl p-2.5 shadow-2xs">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                {direction === 'localToHome' ? 'Home Currency' : `Local (${destination ? destination.split(',')[0] : 'Trip'})`}
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{targetInfo.flag}</span>
                <select
                  value={targetCurrencyCode}
                  onChange={(e) => {
                    if (direction === 'localToHome') {
                      handleHomeChange(e.target.value);
                    } else {
                      handleLocalChange(e.target.value);
                    }
                  }}
                  className="w-full text-xs font-bold text-gray-800 bg-transparent outline-hidden cursor-pointer"
                >
                  {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol.trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Calculation Card */}
          <div className="bg-gray-50/90 border border-gray-200/80 rounded-2xl p-3.5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Amount Input */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Amount in {sourceInfo.code} ({sourceInfo.symbol.trim()})
                </span>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-bold text-gray-400 text-sm">
                    {sourceInfo.symbol.trim()}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm text-[#1a1b1f] focus:outline-hidden focus:ring-2 focus:ring-[#0058bc]/30 focus:border-[#0058bc]"
                  />
                </div>
              </div>

              {/* Converted Output Display */}
              <div className="bg-white border border-[#0058bc]/20 rounded-xl p-2.5 flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058bc] block">
                  Converts To ({targetInfo.code})
                </span>
                <div className="text-xl font-extrabold text-[#003875] tracking-tight mt-0.5">
                  {formatCurrencyAmount(convertedAmount, targetInfo.code)}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  At benchmark rate of {unitRate.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                Quick:
              </span>
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInputAmount(preset.toString())}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inputAmount === preset.toString()
                      ? 'bg-[#0058bc] text-white shadow-2xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  +{sourceInfo.symbol.trim()}{preset.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setInputAmount('0')}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-gray-400 hover:text-gray-700 bg-transparent cursor-pointer ml-auto"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Current Trip Expenses Translation Summary */}
          {totalSpentINR > 0 && (
            <div className="bg-[#f8f9fe] border border-[#0058bc]/15 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058bc] text-base">receipt_long</span>
                <div>
                  <span className="font-bold text-gray-700 block">Total Trip Expenses:</span>
                  <span className="text-[11px] text-gray-500">
                    Local: <strong>{formatCurrencyAmount(totalLocalAmount, localCode)}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-[#0058bc] text-sm block">
                  {formatCurrencyAmount(totalHomeAmount, homeCode)}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">
                  in Home Currency ({homeCode})
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
