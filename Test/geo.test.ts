import { describe, test, expect, vi } from 'vitest';
import { Geo } from '../src/index.js';

// vi.mock() is hoisted above imports, so fixture data must be pulled in via a
// dynamic import inside the factory rather than referenced from a top-level import.
vi.mock('fs', async () => {
  const f = await import('./fixtures.js');
  const countries = [f.COUNTRY_ALAND, f.COUNTRY_GHANA, f.COUNTRY_GERMANY, f.COUNTRY_TOGO];
  const states = [f.STATE_BRANDO, f.STATE_ECKERO, f.STATE_ASHANTI_REGION, f.STATE_GREATER_ACCRA];
  const cities = [f.CITY_BRANDO_VILLAGE, f.CITY_ECKERO_VILLAGE, f.CITY_KUMASI, f.CITY_ACCRA];
  return { readFileSync: f.mockFsReader(countries, states, cities) };
});

// ─── haversineDistanceKm ────────────────────────────────────────────────────

describe('Geo.haversineDistanceKm', () => {
  test('returns 0 for identical points', () => {
    expect(Geo.haversineDistanceKm(5.6, -0.2, 5.6, -0.2)).toBe(0);
  });

  test('computes a known distance along the equator', () => {
    // 1° of longitude at the equator is ≈ 111.19 km on a sphere of Earth's mean radius.
    expect(Geo.haversineDistanceKm(0, 0, 0, 1)).toBeCloseTo(111.19, 1);
  });

  test('is symmetric', () => {
    const a = Geo.haversineDistanceKm(8, -2, 51, 9);
    const b = Geo.haversineDistanceKm(51, 9, 8, -2);
    expect(a).toBeCloseTo(b, 10);
  });
});

// ─── getNearestCountry ──────────────────────────────────────────────────────

describe('Geo.getNearestCountry', () => {
  test('finds the nearest country to a coordinate', () => {
    // Close to Ghana (8, -2), far from Togo/Germany/Åland Islands.
    expect(Geo.getNearestCountry(7.5, -1.5)?.countryShortCode).toBe('GH');
  });

  test('finds a different nearest country for a different coordinate', () => {
    // Close to Åland Islands (60.11667, 19.9).
    expect(Geo.getNearestCountry(60.1, 20.0)?.countryShortCode).toBe('AX');
  });
});

// ─── getNearestCity ─────────────────────────────────────────────────────────

describe('Geo.getNearestCity', () => {
  test('finds the nearest city to a coordinate across all cities', () => {
    expect(Geo.getNearestCity(6.7, -1.6)?.name).toBe('Kumasi');
  });

  test('scopes the search to a country', () => {
    const nearest = Geo.getNearestCity(60.3, 20.0, { countryCode: 'AX' });
    expect(nearest?.countryCode).toBe('AX');
  });

  test('scopes the search to a state within a country', () => {
    const nearest = Geo.getNearestCity(60.3, 20.0, { countryCode: 'AX', stateCode: 'BR' });
    expect(nearest?.name).toBe('Brändö Village');
  });

  test('returns undefined when scoped to a country with no cities', () => {
    expect(Geo.getNearestCity(0, 0, { countryCode: 'ZZ' })).toBeUndefined();
  });
});
