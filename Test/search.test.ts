import { describe, test, expect, vi } from 'vitest';
import { Search } from '../src/index.js';

const MOCK_COUNTRIES = [
  {
    countryName: 'Ghana', countryShortCode: 'GH', phoneCode: '+233',
    currencyCode: 'GHS', latitude: '8.00000000', longitude: '-2.00000000',
    timezones: [], regions: [],
  },
  {
    countryName: 'Afghanistan', countryShortCode: 'AF', phoneCode: '+93',
    currencyCode: 'AFN', latitude: '33.00000000', longitude: '65.00000000',
    timezones: [], regions: [],
  },
  {
    countryName: 'Germany', countryShortCode: 'DE', phoneCode: '+49',
    currencyCode: 'EUR', latitude: '51.00000000', longitude: '9.00000000',
    timezones: [], regions: [],
  },
];

const MOCK_STATES = [
  { name: 'Ashanti Region', isoCode: 'AH', countryCode: 'GH', latitude: '6.74700', longitude: '-1.52000' },
  { name: 'Greater Accra',  isoCode: 'AA', countryCode: 'GH', latitude: '5.60000', longitude: '-0.20000' },
  { name: 'Bavaria',        isoCode: 'BY', countryCode: 'DE', latitude: '48.79000', longitude: '11.50000' },
];

const MOCK_CITIES: string[][] = [
  ['Accra',   'GH', 'AA', '5.55600',  '-0.20000'],
  ['Kumasi',  'GH', 'AH', '6.68848',  '-1.62443'],
  ['Munich',  'DE', 'BY', '48.13500', '11.58200'],
  ['Brändö',  'DE', 'BY', '60.41667', '21.05000'],
  ['São Paulo', 'DE', 'BY', '-23.5505', '-46.6333'],
];

vi.mock('fs', () => ({
  readFileSync: (filePath: string) => {
    const p = String(filePath);
    if (p.includes('states.json'))    return JSON.stringify(MOCK_STATES);
    if (p.includes('cities.json'))    return JSON.stringify(MOCK_CITIES);
    if (p.includes('countries.json')) return JSON.stringify(MOCK_COUNTRIES);
    return '[]';
  },
}));

// ─── searchCountries ────────────────────────────────────────────────────────

describe('Search.searchCountries', () => {
  test('finds an exact match', () => {
    const results = Search.searchCountries('Ghana');
    expect(results).toHaveLength(1);
    expect(results[0]!.countryName).toBe('Ghana');
  });

  test('is case-insensitive', () => {
    expect(Search.searchCountries('ghana')).toHaveLength(1);
    expect(Search.searchCountries('GHANA')).toHaveLength(1);
  });

  test('ranks prefix matches above substring-only matches', () => {
    // "Ghana" starts with "gh"; "Afghanistan" only contains "gh" mid-string.
    const results = Search.searchCountries('gh');
    expect(results.map((c) => c.countryName)).toEqual(['Ghana', 'Afghanistan']);
  });

  test('matches substrings that are not prefixes', () => {
    const results = Search.searchCountries('man');
    expect(results.map((c) => c.countryName)).toEqual(['Germany']);
  });

  test('returns empty array for no match', () => {
    expect(Search.searchCountries('xyz')).toHaveLength(0);
  });

  test('returns empty array for empty query', () => {
    expect(Search.searchCountries('')).toHaveLength(0);
  });

  test('caps results with the limit option', () => {
    // "Afghanistan" (prefix), then "Germany"/"Ghana" (substring, alphabetical) all match "a"
    const results = Search.searchCountries('a', { limit: 1 });
    expect(results).toHaveLength(1);
    expect(results[0]!.countryName).toBe('Afghanistan');
  });

  test('returns all matches when limit is omitted', () => {
    expect(Search.searchCountries('a')).toHaveLength(3);
  });
});

// ─── searchStates ───────────────────────────────────────────────────────────

describe('Search.searchStates', () => {
  test('finds states by partial name', () => {
    const results = Search.searchStates('accra');
    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe('Greater Accra');
  });

  test('ranks prefix matches first', () => {
    const results = Search.searchStates('ba');
    expect(results.map((s) => s.name)).toEqual(['Bavaria']);
  });

  test('returns empty array for no match', () => {
    expect(Search.searchStates('zzz')).toHaveLength(0);
  });
});

// ─── searchCities ───────────────────────────────────────────────────────────

describe('Search.searchCities', () => {
  test('finds cities by partial name', () => {
    const results = Search.searchCities('kum');
    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe('Kumasi');
  });

  test('is case-insensitive', () => {
    expect(Search.searchCities('MUNICH')).toHaveLength(1);
  });

  test('returns empty array for no match', () => {
    expect(Search.searchCities('zzz')).toHaveLength(0);
  });

  test('returns empty array for empty query', () => {
    expect(Search.searchCities('')).toHaveLength(0);
  });

  test('matches accented names when the query has no diacritics', () => {
    expect(Search.searchCities('brando')).toHaveLength(1);
    expect(Search.searchCities('brando')[0]!.name).toBe('Brändö');

    expect(Search.searchCities('sao paulo')).toHaveLength(1);
    expect(Search.searchCities('sao paulo')[0]!.name).toBe('São Paulo');
  });

  test('matches accented query against accented data too', () => {
    expect(Search.searchCities('Brändö')).toHaveLength(1);
  });

  test('caps results with the limit option', () => {
    expect(Search.searchCities('a', { limit: 2 })).toHaveLength(2);
  });
});
