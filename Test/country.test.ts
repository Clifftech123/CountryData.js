import { describe, test, expect, vi } from 'vitest';
import { Country } from '../src/index.js';

// vi.mock() is hoisted above imports, so fixture data must be pulled in via a
// dynamic import inside the factory rather than referenced from a top-level import.
vi.mock('fs', async () => {
  const f = await import('./fixtures.js');
  const countries = [f.COUNTRY_ALAND, f.COUNTRY_GHANA, f.COUNTRY_GERMANY, f.COUNTRY_TOGO];
  const states = [f.STATE_BRANDO, f.STATE_ECKERO, f.STATE_ASHANTI_REGION];
  const cities = [f.CITY_BRANDO_VILLAGE, f.CITY_ECKERO_VILLAGE, f.CITY_KUMASI];
  return { readFileSync: f.mockFsReader(countries, states, cities) };
});

// ─── getAllCountries ──────────────────────────────────────────────────────────

describe('Country.getAllCountries', () => {
  test('returns all countries', () => {
    expect(Country.getAllCountries()).toHaveLength(4);
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
    expect(sorted.map((c) => c.countryName)).toEqual([
      'Germany',
      'Ghana',
      'Togo',
      'Åland Islands',
    ]);
  });

  test('sorts a provided array without mutating the original', () => {
    const original = Country.getAllCountries();
    const sorted = Country.sortCountries([...original]);
    expect(sorted[0]!.countryName).toBe('Germany');
    expect(original[0]!.countryName).toBe('Åland Islands');
  });
});

// ─── cross-entity filters ──────────────────────────────────────────────────────

describe('Country.getCountriesByCurrency', () => {
  test('returns all countries sharing a currency', () => {
    const results = Country.getCountriesByCurrency('EUR');
    expect(results.map((c) => c.countryShortCode).sort()).toEqual(['AX', 'DE']);
  });

  test('is case-insensitive', () => {
    expect(Country.getCountriesByCurrency('eur')).toHaveLength(2);
  });

  test('returns empty array for unknown currency', () => {
    expect(Country.getCountriesByCurrency('XXX')).toHaveLength(0);
  });

  test('returns empty array for empty string', () => {
    expect(Country.getCountriesByCurrency('')).toHaveLength(0);
  });
});

describe('Country.getCountriesByContinent', () => {
  test('returns all countries on a continent', () => {
    const results = Country.getCountriesByContinent('Africa');
    expect(results.map((c) => c.countryShortCode).sort()).toEqual(['GH', 'TG']);
  });

  test('is case-insensitive', () => {
    expect(Country.getCountriesByContinent('africa')).toHaveLength(2);
  });

  test('returns empty array for a continent with no matches', () => {
    expect(Country.getCountriesByContinent('Antarctica')).toHaveLength(0);
  });
});

describe('Country.getCountriesByLanguage', () => {
  test('returns countries speaking a language', () => {
    const results = Country.getCountriesByLanguage('English');
    expect(results.map((c) => c.countryShortCode)).toEqual(['GH']);
  });

  test('is case-insensitive', () => {
    expect(Country.getCountriesByLanguage('french')).toHaveLength(1);
  });

  test('returns empty array for an unspoken language', () => {
    expect(Country.getCountriesByLanguage('Klingon')).toHaveLength(0);
  });
});

describe('Country.getCountriesByRegion', () => {
  test('returns the country containing a named administrative region', () => {
    const results = Country.getCountriesByRegion('Ashanti');
    expect(results.map((c) => c.countryShortCode)).toEqual(['GH']);
  });

  test('is case-insensitive', () => {
    expect(Country.getCountriesByRegion('bavaria')).toHaveLength(1);
  });

  test('returns empty array for an unknown region name', () => {
    expect(Country.getCountriesByRegion('Nonexistent')).toHaveLength(0);
  });
});

// ─── validation ─────────────────────────────────────────────────────────────

describe('Country.isValidCountryCode', () => {
  test('returns true for a known code', () => {
    expect(Country.isValidCountryCode('GH')).toBe(true);
  });

  test('returns false for an unknown code', () => {
    expect(Country.isValidCountryCode('XX')).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(Country.isValidCountryCode('')).toBe(false);
  });
});

describe('Country.isValidPhoneCode', () => {
  test('returns true for a known phone code', () => {
    expect(Country.isValidPhoneCode('+233')).toBe(true);
  });

  test('returns false for an unknown phone code', () => {
    expect(Country.isValidPhoneCode('+000')).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(Country.isValidPhoneCode('')).toBe(false);
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
