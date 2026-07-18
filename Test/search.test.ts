import { describe, test, expect, vi } from 'vitest';
import { Search } from '../src/index.js';

// vi.mock() is hoisted above imports, so fixture data must be pulled in via a
// dynamic import inside the factory rather than referenced from a top-level import.
vi.mock('fs', async () => {
  const f = await import('./fixtures.js');
  const countries = [f.COUNTRY_GHANA, f.COUNTRY_AFGHANISTAN, f.COUNTRY_GERMANY];
  const states = [f.STATE_ASHANTI_REGION, f.STATE_GREATER_ACCRA, f.STATE_BAVARIA];
  const cities = [f.CITY_ACCRA, f.CITY_KUMASI, f.CITY_MUNICH, f.CITY_BRANDO, f.CITY_SAO_PAULO];
  return { readFileSync: f.mockFsReader(countries, states, cities) };
});

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
