import { describe, test, expect, vi } from 'vitest';
import { City } from '../src/index.js';

// vi.mock() is hoisted above imports, so fixture data must be pulled in via a
// dynamic import inside the factory rather than referenced from a top-level import.
vi.mock('fs', async () => {
  const f = await import('./fixtures.js');
  const countries = [f.COUNTRY_ALAND, f.COUNTRY_GHANA];
  const states = [f.STATE_BRANDO, f.STATE_ECKERO, f.STATE_ASHANTI_REGION, f.STATE_GREATER_ACCRA];
  const cities = [f.CITY_BRANDO_VILLAGE, f.CITY_ECKERO_VILLAGE, f.CITY_KUMASI, f.CITY_ACCRA];
  return { readFileSync: f.mockFsReader(countries, states, cities) };
});

// ─── getAllCities ─────────────────────────────────────────────────────────────

describe('City.getAllCities', () => {
  test('returns all cities', () => {
    expect(City.getAllCities()).toHaveLength(4);
  });

  test('city shape has required fields', () => {
    const c = City.getAllCities()[0]!;
    expect(c).toHaveProperty('name');
    expect(c).toHaveProperty('countryCode');
    expect(c).toHaveProperty('stateCode');
    expect(c).toHaveProperty('latitude');
    expect(c).toHaveProperty('longitude');
  });

  test('converts array-of-arrays to objects correctly', () => {
    const kumasi = City.getAllCities().find((c) => c.name === 'Kumasi');
    expect(kumasi?.countryCode).toBe('GH');
    expect(kumasi?.stateCode).toBe('AH');
    expect(kumasi?.latitude).toBe('6.68848');
    expect(kumasi?.longitude).toBe('-1.62443');
  });
});

// ─── getCitiesOfCountry ───────────────────────────────────────────────────────

describe('City.getCitiesOfCountry', () => {
  test('returns all cities for a country', () => {
    const cities = City.getCitiesOfCountry('AX');
    expect(cities).toHaveLength(2);
    expect(cities.every((c) => c.countryCode === 'AX')).toBe(true);
  });

  test('returns cities for another country', () => {
    expect(City.getCitiesOfCountry('GH')).toHaveLength(2);
  });

  test('returns empty array for unknown country', () => {
    expect(City.getCitiesOfCountry('XX')).toHaveLength(0);
  });

  test('returns empty array for empty string', () => {
    expect(City.getCitiesOfCountry('')).toHaveLength(0);
  });
});

// ─── getCitiesOfState ─────────────────────────────────────────────────────────

describe('City.getCitiesOfState', () => {
  test('returns cities for the given state', () => {
    const cities = City.getCitiesOfState('AX', 'BR');
    expect(cities).toHaveLength(1);
    expect(cities[0]!.name).toBe('Brändö Village');
  });

  test('returns cities for another state', () => {
    const cities = City.getCitiesOfState('GH', 'AH');
    expect(cities).toHaveLength(1);
    expect(cities[0]!.name).toBe('Kumasi');
  });

  test('returns empty array for unknown state', () => {
    expect(City.getCitiesOfState('AX', 'ZZ')).toHaveLength(0);
  });

  test('returns empty array for empty country code', () => {
    expect(City.getCitiesOfState('', 'BR')).toHaveLength(0);
  });

  test('returns empty array for empty state code', () => {
    expect(City.getCitiesOfState('AX', '')).toHaveLength(0);
  });
});

// ─── sortCities ───────────────────────────────────────────────────────────────

describe('City.sortCities', () => {
  test('sorts all cities by countryCode → stateCode → name when called with no args', () => {
    const sorted = City.sortCities();
    expect(sorted[0]!.name).toBe('Brändö Village');  // AX-BR
    expect(sorted[1]!.name).toBe('Eckerö Village');  // AX-EC
    expect(sorted[2]!.name).toBe('Accra');            // GH-AA
    expect(sorted[3]!.name).toBe('Kumasi');           // GH-AH
  });

  test('sorts a provided array without mutating the original', () => {
    const cities = City.getCitiesOfCountry('AX');
    const sorted = City.sortCities([...cities].reverse());
    expect(sorted[0]!.name).toBe('Brändö Village');
    expect(cities[0]!.name).toBe('Brändö Village');
  });
});

// ─── getCitiesPaginated ───────────────────────────────────────────────────────

describe('City.getCitiesPaginated', () => {
  test('returns all cities on one page when pageSize exceeds total', () => {
    const result = City.getCitiesPaginated();
    expect(result.items).toHaveLength(4);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(50);
    expect(result.total).toBe(4);
    expect(result.hasMore).toBe(false);
  });

  test('paginates with a custom pageSize', () => {
    const page1 = City.getCitiesPaginated({ pageSize: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.total).toBe(4);
    expect(page1.hasMore).toBe(true);

    const page2 = City.getCitiesPaginated({ pageSize: 2, page: 2 });
    expect(page2.items).toHaveLength(2);
    expect(page2.hasMore).toBe(false);

    const namesPage1 = page1.items.map((c) => c.name);
    const namesPage2 = page2.items.map((c) => c.name);
    expect(namesPage1).not.toEqual(namesPage2);
  });

  test('scopes to a country before paginating', () => {
    const result = City.getCitiesPaginated({ countryCode: 'AX', pageSize: 10 });
    expect(result.items).toHaveLength(2);
    expect(result.items.every((c) => c.countryCode === 'AX')).toBe(true);
    expect(result.total).toBe(2);
  });

  test('scopes to a state within a country', () => {
    const result = City.getCitiesPaginated({ countryCode: 'AX', stateCode: 'BR', pageSize: 10 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.name).toBe('Brändö Village');
  });

  test('clamps page numbers below 1', () => {
    expect(City.getCitiesPaginated({ page: 0, pageSize: 2 }).page).toBe(1);
    expect(City.getCitiesPaginated({ page: -5, pageSize: 2 }).page).toBe(1);
  });

  test('returns empty items for a page beyond the last', () => {
    const result = City.getCitiesPaginated({ pageSize: 2, page: 10 });
    expect(result.items).toHaveLength(0);
    expect(result.hasMore).toBe(false);
    expect(result.total).toBe(4);
  });
});
