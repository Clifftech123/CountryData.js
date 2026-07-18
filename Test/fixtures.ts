/**
 * Shared mock data for tests. Individual test files compose their own
 * MOCK_COUNTRIES / MOCK_STATES / MOCK_CITIES arrays from these building blocks
 * rather than redefining the same countries from scratch in every file.
 *
 * `vi.mock('fs', ...)` itself must still be written in each test file — Vitest
 * only hoists literal `vi.mock()` calls found directly in that file, so the
 * registration can't live here. Use `mockFsReader()` below to keep that
 * per-file block to one line.
 */

// ─── timezones ───────────────────────────────────────────────────────────────

export const TIMEZONE_MARIEHAMN = {
  zoneName: 'Europe/Mariehamn',
  gmtOffset: 7200,
  gmtOffsetName: 'UTC+02:00',
  abbreviation: 'EEST',
  tzName: 'Eastern European Summer Time',
};

export const TIMEZONE_ACCRA = {
  zoneName: 'Africa/Accra',
  gmtOffset: 0,
  gmtOffsetName: 'UTC+00:00',
  abbreviation: 'GMT',
  tzName: 'Greenwich Mean Time',
};

// ─── countries ───────────────────────────────────────────────────────────────

export const COUNTRY_ALAND = {
  countryName: 'Åland Islands',
  countryShortCode: 'AX',
  phoneCode: '+358',
  currencyCode: 'EUR',
  latitude: '60.11666700',
  longitude: '19.90000000',
  timezones: [TIMEZONE_MARIEHAMN],
  // Deliberately unsorted — region.test.ts relies on this to prove sortRegions() reorders.
  regions: [
    { name: 'Brändö', shortCode: 'BR' },
    { name: 'Finström', shortCode: 'FN' },
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
};

export const COUNTRY_GHANA = {
  countryName: 'Ghana',
  countryShortCode: 'GH',
  phoneCode: '+233',
  currencyCode: 'GHS',
  latitude: '8.00000000',
  longitude: '-2.00000000',
  timezones: [TIMEZONE_ACCRA],
  regions: [
    { name: 'Ashanti', shortCode: 'AH' },
    { name: 'Greater Accra', shortCode: 'AA' },
  ],
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
};

export const COUNTRY_GERMANY = {
  countryName: 'Germany',
  countryShortCode: 'DE',
  phoneCode: '+49',
  currencyCode: 'EUR',
  latitude: '51.00000000',
  longitude: '9.00000000',
  timezones: [],
  regions: [{ name: 'Bavaria', shortCode: 'BY' }],
  continent: 'Europe',
  languages: ['German'],
};

export const COUNTRY_TOGO = {
  countryName: 'Togo',
  countryShortCode: 'TG',
  phoneCode: '+228',
  currencyCode: 'XOF',
  latitude: '8.00000000',
  longitude: '1.16667000',
  timezones: [],
  regions: [{ name: 'Maritime', shortCode: 'MA' }],
  continent: 'Africa',
  languages: ['French'],
};

export const COUNTRY_BURKINA_FASO = {
  countryName: 'Burkina Faso',
  countryShortCode: 'BF',
  phoneCode: '+226',
  regions: [],
  timezones: [TIMEZONE_ACCRA],
};

export const COUNTRY_AFGHANISTAN = {
  countryName: 'Afghanistan',
  countryShortCode: 'AF',
  phoneCode: '+93',
  currencyCode: 'AFN',
  latitude: '33.00000000',
  longitude: '65.00000000',
  timezones: [],
  regions: [],
};

// ─── states ──────────────────────────────────────────────────────────────────

export const STATE_BRANDO = {
  name: 'Brändö', isoCode: 'BR', countryCode: 'AX', latitude: '60.41667', longitude: '21.05000',
};

export const STATE_ECKERO = {
  name: 'Eckerö', isoCode: 'EC', countryCode: 'AX', latitude: '60.22500', longitude: '19.55000',
};

export const STATE_ASHANTI_REGION = {
  name: 'Ashanti Region', isoCode: 'AH', countryCode: 'GH', latitude: '6.74700', longitude: '-1.52000',
};

export const STATE_GREATER_ACCRA = {
  name: 'Greater Accra', isoCode: 'AA', countryCode: 'GH', latitude: '5.60000', longitude: '-0.20000',
};

export const STATE_BAVARIA = {
  name: 'Bavaria', isoCode: 'BY', countryCode: 'DE', latitude: '48.79000', longitude: '11.50000',
};

// ─── cities ──────────────────────────────────────────────────────────────────
// On-disk shape: [name, countryCode, stateCode, latitude, longitude]

export const CITY_BRANDO_VILLAGE = ['Brändö Village', 'AX', 'BR', '60.41667', '21.05000'];
export const CITY_ECKERO_VILLAGE = ['Eckerö Village', 'AX', 'EC', '60.22500', '19.55000'];
export const CITY_KUMASI = ['Kumasi', 'GH', 'AH', '6.68848', '-1.62443'];
export const CITY_ACCRA = ['Accra', 'GH', 'AA', '5.55602', '-0.19690'];
export const CITY_MUNICH = ['Munich', 'DE', 'BY', '48.13500', '11.58200'];
// Diacritic-only fixtures for search.test.ts's normalization tests — not tied to a
// "real" country/state pairing, just needs *some* valid countryCode/stateCode.
export const CITY_BRANDO = ['Brändö', 'DE', 'BY', '60.41667', '21.05000'];
export const CITY_SAO_PAULO = ['São Paulo', 'DE', 'BY', '-23.5505', '-46.6333'];

// ─── fs mock factory ─────────────────────────────────────────────────────────

export function mockFsReader(countries: unknown[], states: unknown[], cities: unknown[]) {
  return (filePath: string): string => {
    const p = String(filePath);
    if (p.includes('states.json')) return JSON.stringify(states);
    if (p.includes('cities.json')) return JSON.stringify(cities);
    if (p.includes('countries.json')) return JSON.stringify(countries);
    return '[]';
  };
}
