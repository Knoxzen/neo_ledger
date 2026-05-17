export function getCurrencySymbol(currencyCode: string): string {
  switch (currencyCode.toUpperCase()) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'JPY':
      return '¥';
    case 'INR':
      return '₹';
    default:
      return '$'; // Fallback
  }
}

export function formatCurrency(amount: number, currencyCode: string = 'USD', options?: Intl.NumberFormatOptions): string {
  const code = currencyCode.toUpperCase();
  let locale = 'en-US';

  switch (code) {
    case 'INR':
      locale = 'en-IN';
      break;
    case 'EUR':
      locale = 'de-DE'; // common european format
      break;
    case 'GBP':
      locale = 'en-GB';
      break;
    case 'JPY':
      locale = 'ja-JP';
      break;
    case 'USD':
    default:
      locale = 'en-US';
      break;
  }
  
  return getCurrencySymbol(code) + amount.toLocaleString(locale, options);
}
