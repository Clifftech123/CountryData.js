import { describe, test, expect, vi } from 'vitest';
import { Country } from '../src/index.js';

const MOCK_COUNTRIES = [
  {
    countryName: 'Åland Islands',
    countryShortCode: 'AX',
    phoneCode: '+358',
    currencyCode: 'EUR',
    latitude: '60.11666700',
    longitude: '19.90000000',
    timezones: [
      { zoneName: 'Europe/Mariehamn', gmtOffset: 7200, gmtOffsetName: 'UTC+02:00', abbreviation: 'EEST', tzName: 'Eastern European Summer Time' },
    ],
    regions: [
      { name: 'Brändö', shortCode: 'BR' },
      { name: 'Eckerö', shortCode: 'EC' },
    ],
    capital: 'Mariehamn',
    population: 30836,
    area: 1582.93,
    nativeName: 'Åland',
    languages: ['Swedish'],
    tld: ['.ax'],
    unMember: false,
    independent: false,
  },
  {
    countryName: 'Ghana',
    countryShortCode: 'GH',
    phoneCode: '+233',
    currencyCode: 'GHS',
    latitude: '8.00000000',
    longitude: '-2.00000000',
    timezones: [
      { zoneName: 'Africa/Accra', gmtOffset: 0, gmtOffsetName: 'UTC+00:00', abbreviation: 'GMT', tzName: 'Greenwich Mean Time' },
    ],
    regions: [{ name: 'Ashanti', shortCode: 'AH' }],
    capital: 'Accra',
    population: 32833031,
    area: 238535,
    continent: 'Africa',
    demonym: 'Ghanaian',
    languages: ['English'],
    borders: ['TG', 'BF', 'CI'],
    tld: ['.gh'],
    unMember: true,
    independent: true,
  },
];

const MOCK_STATES = [
  { name: 'Brändö', isoCode: 'BR', countryCode: 'AX', latitude: '60.41667', longitude: '21.05000' },
  { name: 'Eckerö', isoCode: 'EC', countryCode: 'AX', latitude: '60.22500', longitude: '19.55000' },
  { name: 'Ashanti Region', isoCode: 'AH', countryCode: 'GH', latitude: '6.74700', longitude: '-1.52000' },
];

const MOCK_CITIES: string[][] = [
  ['Brändö Village', 'AX', 'BR', '60.41667', '21.05000'],
  ['Eckerö Village', 'AX', 'EC', '60.22500', '19.55000'],
  ['Kumasi', 'GH', 'AH', '6.68848', '-1.62443'],
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

// ─── getAllCountries ──────────────────────────────────────────────────────────

describe('Country.getAllCountries', () => {
  test('returns all countries', () => {
    expect(Country.getAllCountries()).toHaveLength(2);
  });

  test('attaches countryFlag emoji to each country', () => {
    const ax = Country.getAllCountries().find((c) => c.countryShortCode === 'AX');
    expect(ax?.countryFlag).toBe('🇦🇽');
  });

  test('attaches getStates method', () => {
    const c = Country.getAllCountries()[0]!;
    expect(typeof c.getStates).toBe('function');
  });

  test('attaches getCities method', () => {
    const c = Country.getAllCountries()[0]!;
    expect(typeof c.getCities).toBe('function');
  });
});

// ─── getCountryByCode ─────────────────────────────────────────────────────────

describe('Country.getCountryByCode', () => {
  test('returns the correct country', () => {
    const c = Country.getCountryByCode('AX')!;
    expect(c.countryName).toBe('Åland Islands');
    expect(c.countryShortCode).toBe('AX');
    expect(c.phoneCode).toBe('+358');
    expect(c.currencyCode).toBe('EUR');
    expect(c.latitude).toBe('60.11666700');
    expect(c.longitude).toBe('19.90000000');
  });

  test('returns undefined for unknown code', () => {
    expect(Country.getCountryByCode('XX')).toBeUndefined();
  });

  test('returns undefined for empty string', () => {
    expect(Country.getCountryByCode('')).toBeUndefined();
  });
});

// ─── enriched country fields ──────────────────────────────────────────────────

describe('Country.getCountryByCode enriched fields', () => {
  test('exposes currency name/symbol', () => {
    const gh = Country.getCountryByCode('GH')!;
    expect(gh.currencyName).toBe('Ghanaian Cedi');
    expect(gh.currencySymbol).toBe('₵');
  });

  test('exposes capital, population, area, continent', () => {
    const gh = Country.getCountryByCode('GH')!;
    expect(gh.capital).toBe('Accra');
    expect(gh.population).toBe(32833031);
    expect(gh.area).toBe(238535);
    expect(gh.continent).toBe('Africa');
  });

  test('exposes demonym, languages, borders, tld', () => {
    const gh = Country.getCountryByCode('GH')!;
    expect(gh.demonym).toBe('Ghanaian');
    expect(gh.languages).toEqual(['English']);
    expect(gh.borders).toEqual(['TG', 'BF', 'CI']);
    expect(gh.tld).toEqual(['.gh']);
  });

  test('exposes unMember and independent flags', () => {
    const gh = Country.getCountryByCode('GH')!;
    expect(gh.unMember).toBe(true);
    expect(gh.independent).toBe(true);

    const ax = Country.getCountryByCode('AX')!;
    expect(ax.unMember).toBe(false);
    expect(ax.independent).toBe(false);
  });

  test('leaves sparse fields undefined rather than null/empty', () => {
    const ax = Country.getCountryByCode('AX')!;
    expect(ax.continent).toBeUndefined();
    expect(ax.demonym).toBeUndefined();
    expect(ax.borders).toBeUndefined();
  });
});

// ─── getCountryByPhoneCode ────────────────────────────────────────────────────

describe('Country.getCountryByPhoneCode', () => {
  test('returns the correct country', () => {
    expect(Country.getCountryByPhoneCode('+233')!.countryShortCode).toBe('GH');
  });

  test('returns undefined for unknown phone code', () => {
    expect(Country.getCountryByPhoneCode('+000')).toBeUndefined();
  });

  test('returns undefined for empty string', () => {
    expect(Country.getCountryByPhoneCode('')).toBeUndefined();
  });
});

// ─── getCountryFlag ───────────────────────────────────────────────────────────

describe('Country.getCountryFlag', () => {
  test('returns correct flag emoji for AX', () => {
    expect(Country.getCountryFlag('AX')).toBe('🇦🇽');
  });

  test('returns correct flag emoji for GH', () => {
    expect(Country.getCountryFlag('GH')).toBe('🇬🇭');
  });

  test('works with lowercase input', () => {
    expect(Country.getCountryFlag('gh')).toBe('🇬🇭');
  });
});

// ─── sortCountries ────────────────────────────────────────────────────────────

describe('Country.sortCountries', () => {
  test('sorts all countries alphabetically when called with no args', () => {
    const sorted = Country.sortCountries();
    expect(sorted[0]!.countryName).toBe('Ghana');
    expect(sorted[1]!.countryName).toBe('Åland Islands');
  });

  test('sorts a provided array without mutating the original', () => {
    const original = Country.getAllCountries();
    const sorted = Country.sortCountries([...original]);
    expect(sorted[0]!.countryName).toBe('Ghana');
    expect(original[0]!.countryName).toBe('Åland Islands');
  });
});

// ─── method chaining ──────────────────────────────────────────────────────────

describe('Country object method chaining', () => {
  test('getStates() returns states for that country', () => {
    const ax = Country.getCountryByCode('AX')!;
    const states = ax.getStates!();
    expect(states).toHaveLength(2);
    expect(states[0]!.countryCode).toBe('AX');
  });

  test('getCities() returns cities for that country', () => {
    const ax = Country.getCountryByCode('AX')!;
    const cities = ax.getCities!();
    expect(cities).toHaveLength(2);
    expect(cities[0]!.countryCode).toBe('AX');
  });
});
