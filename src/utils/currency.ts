export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  // Rate in INR: 1 Unit of this currency = X INR
  rateToINR: number;
  decimalPlaces: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    rateToINR: 1.0,
    decimalPlaces: 0,
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    rateToINR: 0.56, // 1 JPY ≈ 0.56 INR
    decimalPlaces: 0,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    rateToINR: 84.2, // 1 USD ≈ 84.20 INR
    decimalPlaces: 2,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rateToINR: 91.5, // 1 EUR ≈ 91.50 INR
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    rateToINR: 107.8, // 1 GBP ≈ 107.80 INR
    decimalPlaces: 2,
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    flag: '🇦🇪',
    rateToINR: 22.9, // 1 AED ≈ 22.90 INR
    decimalPlaces: 2,
  },
  THB: {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    flag: '🇹🇭',
    rateToINR: 2.45, // 1 THB ≈ 2.45 INR
    decimalPlaces: 1,
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬',
    rateToINR: 64.3, // 1 SGD ≈ 64.30 INR
    decimalPlaces: 2,
  },
  IDR: {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp ',
    flag: '🇮🇩',
    rateToINR: 0.0054, // 1 IDR ≈ 0.0054 INR (1 INR = 185 IDR)
    decimalPlaces: 0,
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    rateToINR: 55.2, // 1 AUD ≈ 55.20 INR
    decimalPlaces: 2,
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    flag: '🇨🇦',
    rateToINR: 61.4, // 1 CAD ≈ 61.40 INR
    decimalPlaces: 2,
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF ',
    flag: '🇨🇭',
    rateToINR: 96.5, // 1 CHF ≈ 96.50 INR
    decimalPlaces: 2,
  },
  VND: {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    flag: '🇻🇳',
    rateToINR: 0.0034, // 1 VND ≈ 0.0034 INR (1 INR = 295 VND)
    decimalPlaces: 0,
  },
};

/**
 * Automatically infers destination currency from destination string
 */
export function getDestinationCurrency(destination?: string): CurrencyInfo {
  if (!destination) return SUPPORTED_CURRENCIES.JPY;
  const lower = destination.toLowerCase();

  if (lower.includes('japan') || lower.includes('kyoto') || lower.includes('tokyo') || lower.includes('osaka')) {
    return SUPPORTED_CURRENCIES.JPY;
  }
  if (lower.includes('dubai') || lower.includes('uae') || lower.includes('abu dhabi')) {
    return SUPPORTED_CURRENCIES.AED;
  }
  if (lower.includes('thailand') || lower.includes('bangkok') || lower.includes('phuket') || lower.includes('chiang mai')) {
    return SUPPORTED_CURRENCIES.THB;
  }
  if (
    lower.includes('france') ||
    lower.includes('paris') ||
    lower.includes('italy') ||
    lower.includes('rome') ||
    lower.includes('spain') ||
    lower.includes('germany') ||
    lower.includes('amsterdam') ||
    lower.includes('europe')
  ) {
    return SUPPORTED_CURRENCIES.EUR;
  }
  if (lower.includes('uk') || lower.includes('london') || lower.includes('england') || lower.includes('scotland') || lower.includes('britain')) {
    return SUPPORTED_CURRENCIES.GBP;
  }
  if (lower.includes('usa') || lower.includes('united states') || lower.includes('new york') || lower.includes('california') || lower.includes('hawaii')) {
    return SUPPORTED_CURRENCIES.USD;
  }
  if (lower.includes('singapore')) {
    return SUPPORTED_CURRENCIES.SGD;
  }
  if (lower.includes('bali') || lower.includes('indonesia')) {
    return SUPPORTED_CURRENCIES.IDR;
  }
  if (lower.includes('switzerland') || lower.includes('swiss') || lower.includes('zurich')) {
    return SUPPORTED_CURRENCIES.CHF;
  }
  if (lower.includes('australia') || lower.includes('sydney') || lower.includes('melbourne')) {
    return SUPPORTED_CURRENCIES.AUD;
  }
  if (lower.includes('vietnam') || lower.includes('hanoi') || lower.includes('da nang')) {
    return SUPPORTED_CURRENCIES.VND;
  }
  if (
    lower.includes('goa') ||
    lower.includes('india') ||
    lower.includes('jaipur') ||
    lower.includes('kerala') ||
    lower.includes('delhi') ||
    lower.includes('manali') ||
    lower.includes('mumbai')
  ) {
    return SUPPORTED_CURRENCIES.INR;
  }

  return SUPPORTED_CURRENCIES.USD;
}

/**
 * Converts an amount from one currency to another using their INR conversion base
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string
): number {
  if (fromCode === toCode || !amount) return amount;
  const from = SUPPORTED_CURRENCIES[fromCode] || SUPPORTED_CURRENCIES.INR;
  const to = SUPPORTED_CURRENCIES[toCode] || SUPPORTED_CURRENCIES.INR;

  // Convert to INR first
  const inrValue = amount * from.rateToINR;
  // Then convert from INR to target currency
  const targetValue = inrValue / to.rateToINR;
  return targetValue;
}

/**
 * Formats a currency amount with symbol, locale grouping, and appropriate decimal points
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string
): string {
  const info = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.INR;
  const decimals = info.decimalPlaces;

  let formattedNumber: string;
  if (currencyCode === 'INR') {
    formattedNumber = Math.round(amount).toLocaleString('en-IN');
  } else if (decimals === 0) {
    formattedNumber = Math.round(amount).toLocaleString('en-US');
  } else {
    formattedNumber = amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return `${info.symbol}${formattedNumber}`;
}
