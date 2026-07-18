import { describe, test, expect, vi, beforeAll } from 'vitest';
import { CountryHelper } from '../src/index.js';

// vi.mock() is hoisted above imports, so fixture data must be pulled in via a
// dynamic import inside the factory rather than referenced from a top-level import.
vi.mock('fs', async () => {
  const f = await import('./fixtures.js');
  const countries = [f.COUNTRY_ALAND, f.COUNTRY_GHANA];
  const states = [f.STATE_BRANDO, f.STATE_ECKERO, f.STATE_ASHANTI_REGION];
  const cities = [f.CITY_BRANDO_VILLAGE, f.CITY_ECKERO_VILLAGE, f.CITY_KUMASI, f.CITY_ACCRA];
  return { readFileSync: f.mockFsReader(countries, states, cities) };
});

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

// ─── Search ───────────────────────────────────────────────────────────────────

describe('CountryHelper — search methods', () => {
  test('searchCountries finds by partial name', () => {
    expect(helper.searchCountries('ghan')).toHaveLength(1);
  });

  test('searchStates finds by partial name', () => {
    expect(helper.searchStates('ashanti')).toHaveLength(1);
  });

  test('searchCities finds by partial name', () => {
    expect(helper.searchCities('kum')).toHaveLength(1);
  });

  test('search methods accept a limit option', () => {
    expect(helper.searchCities('a', { limit: 1 })).toHaveLength(1);
  });
});
