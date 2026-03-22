import { describe, test, expect, vi, beforeAll } from 'vitest';
import { CountryHelper } from '../src/index.js';

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
      { name: 'Brändö',   shortCode: 'BR' },
      { name: 'Eckerö',   shortCode: 'EC' },
      { name: 'Finström', shortCode: 'FN' },
    ],
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
    regions: [
      { name: 'Ashanti',      shortCode: 'AH' },
      { name: 'Greater Accra',shortCode: 'AA' },
    ],
  },
];

const MOCK_STATES = [
  { name: 'Brändö',        isoCode: 'BR', countryCode: 'AX', latitude: '60.41667', longitude: '21.05000' },
  { name: 'Eckerö',        isoCode: 'EC', countryCode: 'AX', latitude: '60.22500', longitude: '19.55000' },
  { name: 'Ashanti Region',isoCode: 'AH', countryCode: 'GH', latitude: '6.74700',  longitude: '-1.52000' },
];

const MOCK_CITIES: string[][] = [
  ['Brändö Village', 'AX', 'BR', '60.41667', '21.05000'],
  ['Eckerö Village', 'AX', 'EC', '60.22500', '19.55000'],
  ['Kumasi',         'GH', 'AH', '6.68848',  '-1.62443'],
  ['Accra',          'GH', 'AA', '5.55602',  '-0.19690'],
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

let helper: CountryHelper;
beforeAll(() => { helper = new CountryHelper(); });

// ─── Country ──────────────────────────────────────────────────────────────────

describe('CountryHelper — country methods', () => {
  test('getCountries returns all countries', () => {
    expect(helper.getCountries()).toHaveLength(2);
  });

  test('getCountryByShortCode returns the correct country', () => {
    expect(helper.getCountryByShortCode('AX')!.countryName).toBe('Åland Islands');
  });

  test('getCountryByShortCode returns null for unknown code', () => {
    expect(helper.getCountryByShortCode('XX')).toBeNull();
  });

  test('getCountryByPhoneCode returns the correct country', () => {
    expect(helper.getCountryByPhoneCode('+233')!.countryShortCode).toBe('GH');
  });

  test('getCountryByPhoneCode returns null for unknown code', () => {
    expect(helper.getCountryByPhoneCode('+000')).toBeNull();
  });

  test('getCountryPhoneCodeByShortCode returns the phone code', () => {
    expect(helper.getCountryPhoneCodeByShortCode('GH')).toBe('+233');
  });

  test('getCountryPhoneCodeByShortCode returns null for unknown country', () => {
    expect(helper.getCountryPhoneCodeByShortCode('XX')).toBeNull();
  });

  test('getCountryFlag returns emoji flag', () => {
    expect(helper.getCountryFlag('GH')).toBe('🇬🇭');
    expect(helper.getCountryFlag('AX')).toBe('🇦🇽');
  });

  test('sortCountries sorts alphabetically', () => {
    const sorted = helper.sortCountries();
    expect(sorted[0]!.countryName).toBe('Ghana');
    expect(sorted[1]!.countryName).toBe('Åland Islands');
  });
});

// ─── Region ───────────────────────────────────────────────────────────────────

describe('CountryHelper — region methods', () => {
  test('getRegionsByCountryShortCode returns regions', () => {
    const regions = helper.getRegionsByCountryShortCode('AX');
    expect(regions).toHaveLength(3);
  });

  test('getRegionsByCountryShortCode returns empty array for unknown country', () => {
    expect(helper.getRegionsByCountryShortCode('XX')).toHaveLength(0);
  });

  test('getRegionByShortCode returns the correct region', () => {
    expect(helper.getRegionByShortCode('AX', 'BR')!.name).toBe('Brändö');
  });

  test('getRegionByShortCode returns undefined for unknown code', () => {
    expect(helper.getRegionByShortCode('AX', 'ZZ')).toBeUndefined();
  });

  test('sortRegions sorts alphabetically', () => {
    const sorted = helper.sortRegions(helper.getRegionsByCountryShortCode('AX'));
    expect(sorted[0]!.name).toBe('Brändö');
    expect(sorted[1]!.name).toBe('Eckerö');
    expect(sorted[2]!.name).toBe('Finström');
  });
});

// ─── Timezone ─────────────────────────────────────────────────────────────────

describe('CountryHelper — timezone methods', () => {
  test('getAllTimezones returns all unique timezones', () => {
    expect(helper.getAllTimezones()).toHaveLength(2);
  });

  test('getTimezonesByCountryCode returns timezones for a country', () => {
    const tzs = helper.getTimezonesByCountryCode('GH');
    expect(tzs).toHaveLength(1);
    expect(tzs[0]!.zoneName).toBe('Africa/Accra');
  });

  test('getTimezonesByCountryCode returns empty array for unknown country', () => {
    expect(helper.getTimezonesByCountryCode('XX')).toHaveLength(0);
  });

  test('getCountriesByTimezone returns countries observing that timezone', () => {
    const countries = helper.getCountriesByTimezone('Europe/Mariehamn');
    expect(countries).toHaveLength(1);
    expect(countries[0]!.countryShortCode).toBe('AX');
  });

  test('getCountriesByTimezone returns empty array for unknown timezone', () => {
    expect(helper.getCountriesByTimezone('Unknown/Zone')).toHaveLength(0);
  });
});

// ─── State ────────────────────────────────────────────────────────────────────

describe('CountryHelper — state methods', () => {
  test('getAllStates returns all states', () => {
    expect(helper.getAllStates()).toHaveLength(3);
  });

  test('getStatesOfCountry returns states for a country', () => {
    expect(helper.getStatesOfCountry('AX')).toHaveLength(2);
  });

  test('getStatesOfCountry returns empty array for unknown country', () => {
    expect(helper.getStatesOfCountry('XX')).toHaveLength(0);
  });

  test('getStateByCodeAndCountry returns the correct state', () => {
    expect(helper.getStateByCodeAndCountry('BR', 'AX')!.name).toBe('Brändö');
  });

  test('getStateByCodeAndCountry returns undefined for unknown state', () => {
    expect(helper.getStateByCodeAndCountry('ZZ', 'AX')).toBeUndefined();
  });

  test('sortStates sorts alphabetically', () => {
    const sorted = helper.sortStates();
    expect(sorted[0]!.name).toBe('Ashanti Region');
  });
});

// ─── City ─────────────────────────────────────────────────────────────────────

describe('CountryHelper — city methods', () => {
  test('getAllCities returns all cities', () => {
    expect(helper.getAllCities()).toHaveLength(4);
  });

  test('getCitiesOfCountry returns cities for a country', () => {
    expect(helper.getCitiesOfCountry('AX')).toHaveLength(2);
  });

  test('getCitiesOfCountry returns empty array for unknown country', () => {
    expect(helper.getCitiesOfCountry('XX')).toHaveLength(0);
  });

  test('getCitiesOfState returns cities for a state', () => {
    const cities = helper.getCitiesOfState('AX', 'BR');
    expect(cities).toHaveLength(1);
    expect(cities[0]!.name).toBe('Brändö Village');
  });

  test('getCitiesOfState returns empty array for unknown state', () => {
    expect(helper.getCitiesOfState('AX', 'ZZ')).toHaveLength(0);
  });

  test('sortCities sorts by countryCode → stateCode → name', () => {
    const sorted = helper.sortCities();
    expect(sorted[0]!.name).toBe('Brändö Village');  // AX-BR
    expect(sorted[2]!.name).toBe('Accra');            // GH-AA
    expect(sorted[3]!.name).toBe('Kumasi');           // GH-AH
  });
});
