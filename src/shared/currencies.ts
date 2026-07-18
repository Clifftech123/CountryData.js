import currenciesData from './currencies.json' with { type: 'json' };

/**
 * ISO 4217 currency code → name/symbol lookup.
 * Hand-maintained from the public ISO 4217 standard (facts, not copyrightable) —
 * no external fetch needed. Covers every currencyCode value present in data/countries.json.
 */
export interface ICurrencyInfo {
  name: string;
  symbol: string;
}

export const CURRENCIES: Record<string, ICurrencyInfo> = currenciesData;
