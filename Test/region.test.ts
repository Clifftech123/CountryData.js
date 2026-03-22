import { describe, test, expect, vi } from 'vitest';
import { Region } from '../src/index.js';

const MOCK_COUNTRIES = [
  {
    countryName: 'Åland Islands', countryShortCode: 'AX', phoneCode: '+358',
    timezones: [],
    regions: [
      { name: 'Brändö',   shortCode: 'BR' },
      { name: 'Finström', shortCode: 'FN' },
      { name: 'Eckerö',   shortCode: 'EC' },
    ],
  },
  {
    countryName: 'Ghana', countryShortCode: 'GH', phoneCode: '+233',
    timezones: [],
    regions: [
      { name: 'Ashanti',      shortCode: 'AH' },
      { name: 'Greater Accra',shortCode: 'AA' },
    ],
  },
];

const MOCK_STATES: unknown[] = [];
const MOCK_CITIES: string[][] = [];

vi.mock('fs', () => ({
  readFileSync: (filePath: string) => {
    const p = String(filePath);
    if (p.includes('states.json'))    return JSON.stringify(MOCK_STATES);
    if (p.includes('cities.json'))    return JSON.stringify(MOCK_CITIES);
    if (p.includes('countries.json')) return JSON.stringify(MOCK_COUNTRIES);
    return '[]';
  },
}));

// ─── getRegionsByCountryCode ──────────────────────────────────────────────────

describe('Region.getRegionsByCountryCode', () => {
  test('returns all regions for a country', () => {
    const regions = Region.getRegionsByCountryCode('AX');
    expect(regions).toHaveLength(3);
  });

  test('region shape has name and shortCode', () => {
    const r = Region.getRegionsByCountryCode('AX')[0]!;
    expect(r).toHaveProperty('name');
    expect(r).toHaveProperty('shortCode');
  });

  test('returns regions for another country', () => {
    expect(Region.getRegionsByCountryCode('GH')).toHaveLength(2);
  });

  test('returns empty array for unknown country', () => {
    expect(Region.getRegionsByCountryCode('XX')).toHaveLength(0);
  });

  test('returns empty array for empty string', () => {
    expect(Region.getRegionsByCountryCode('')).toHaveLength(0);
  });
});

// ─── getRegionByShortCode ─────────────────────────────────────────────────────

describe('Region.getRegionByShortCode', () => {
  test('returns the correct region', () => {
    const r = Region.getRegionByShortCode('AX', 'BR')!;
    expect(r.name).toBe('Brändö');
    expect(r.shortCode).toBe('BR');
  });

  test('returns correct region from another country', () => {
    expect(Region.getRegionByShortCode('GH', 'AA')!.name).toBe('Greater Accra');
  });

  test('returns undefined for unknown short code', () => {
    expect(Region.getRegionByShortCode('AX', 'ZZ')).toBeUndefined();
  });

  test('returns undefined for empty country code', () => {
    expect(Region.getRegionByShortCode('', 'BR')).toBeUndefined();
  });

  test('returns undefined for empty short code', () => {
    expect(Region.getRegionByShortCode('AX', '')).toBeUndefined();
  });
});

// ─── sortRegions ──────────────────────────────────────────────────────────────

describe('Region.sortRegions', () => {
  test('sorts regions alphabetically by name', () => {
    const regions = Region.getRegionsByCountryCode('AX');
    const sorted = Region.sortRegions(regions);
    expect(sorted[0]!.name).toBe('Brändö');
    expect(sorted[1]!.name).toBe('Eckerö');
    expect(sorted[2]!.name).toBe('Finström');
  });

  test('does not mutate the original array', () => {
    const regions = Region.getRegionsByCountryCode('AX');
    const originalFirst = regions[0]!.name;
    Region.sortRegions([...regions]);
    expect(regions[0]!.name).toBe(originalFirst);
  });
});
