import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  detectedCountry = signal<string>('');
  detectedCurrency = signal<string>('');
  detectedCountryCode = signal<string>('');
  locationReady = signal<boolean>(false);

  private readonly currencyMap: Record<string, string> = {
    'KE': 'KES', 'US': 'USD', 'GB': 'GBP',
    'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR',
    'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR',
    'PT': 'EUR', 'AT': 'EUR', 'FI': 'EUR',
    'GR': 'EUR', 'IE': 'EUR', 'LU': 'EUR',
    'IN': 'INR', 'CN': 'CNY', 'JP': 'JPY',
    'ZA': 'ZAR', 'NG': 'NGN', 'UG': 'UGX',
    'TZ': 'TZS', 'AU': 'AUD', 'CA': 'CAD',
    'AE': 'AED', 'CH': 'CHF', 'BR': 'BRL',
    'MX': 'MXN', 'SG': 'SGD', 'RW': 'RWF',
    'ET': 'ETB', 'GH': 'GHS', 'EG': 'EGP',
    'MA': 'MAD', 'DZ': 'DZD', 'SD': 'SDG',
    'KR': 'KRW',  'PK': 'PKR',
    'BD': 'BDT', 'ID': 'IDR', 'MY': 'MYR',
    'TH': 'THB', 'PH': 'PHP', 'SA': 'SAR',
    'QA': 'QAR', 'KW': 'KWD', 'RU': 'RUB',
    'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK',
    'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF',
    'NZ': 'NZD', 'TR': 'TRY', 'AR': 'ARS',
    'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN',
  };

  getCurrencyFromCode(code: string): string {
    return this.currencyMap[code.toUpperCase()] || 'USD';
  }

  setLocation(country: string, countryCode: string) {
    const currency = this.getCurrencyFromCode(countryCode);
    this.detectedCountry.set(country);
    this.detectedCountryCode.set(countryCode);
    this.detectedCurrency.set(currency);
    this.locationReady.set(true);
  }
}