import { describe, test, expect, vi } from 'vitest';
import { Timezone } from '../src/index.js';

const MOCK_COUNTRIES = [
  {
    countryName: 'Åland Islands', countryShortCode: 'AX', phoneCode: '+358',
    regions: [],
    timezones: [
      { zoneName: 'Europe/Mariehamn', gmtOffset: 7200, gmtOffsetName: 'UTC+02:00', abbreviation: 'EEST', tzName: 'Eastern European Summer Time' },
    ],
  },
  {
    countryName: 'Ghana', countryShortCode: 'GH', phoneCode: '+233',
    regions: [],
    timezones: [
      { zoneName: 'Africa/Accra', gmtOffset: 0, gmtOffsetName: 'UTC+00:00', abbreviation: 'GMT', tzName: 'Greenwich Mean Time' },
    ],
  },
  {
    countryName: 'Burkina Faso', countryShortCode: 'BF', phoneCode: '+226',
    regions: [],
    timezones: [
      { zoneName: 'Africa/Accra', gmtOffset: 0, gmtOffsetName: 'UTC+00:00', abbreviation: 'GMT', tzName: 'Greenwich Mean Time' },
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

// ─── getAllTimezones ──────────────────────────────────────────────────────────

describe('Timezone.getAllTimezones', () => {
  test('returns all unique timezones', () => {
    // 3 countries but Africa/Accra appears twice — expect 2 unique
    expect(Timezone.getAllTimezones()).toHaveLength(2);
  });

  test('deduplicates timezones shared by multiple countries', () => {
    const zones = Timezone.getAllTimezones().map((t) => t.zoneName);
    expect(new Set(zones).size).toBe(zones.length);
  });

  test('timezone shape has all required fields', () => {
    const tz = Timezone.getAllTimezones()[0]!;
    expect(tz).toHaveProperty('zoneName');
    expect(tz).toHaveProperty('gmtOffset');
    expect(tz).toHaveProperty('gmtOffsetName');
    expect(tz).toHaveProperty('abbreviation');
    expect(tz).toHaveProperty('tzName');
  });
});

// ─── getTimezonesByCountryCode ────────────────────────────────────────────────

describe('Timezone.getTimezonesByCountryCode', () => {
  test('returns timezones for a valid country', () => {
    const tzs = Timezone.getTimezonesByCountryCode('AX');
    expect(tzs).toHaveLength(1);
    expect(tzs[0]!.zoneName).toBe('Europe/Mariehamn');
  });

  test('returns correct timezone data fields', () => {
    const tz = Timezone.getTimezonesByCountryCode('AX')[0]!;
    expect(tz.gmtOffset).toBe(7200);
    expect(tz.gmtOffsetName).toBe('UTC+02:00');
    expect(tz.abbreviation).toBe('EEST');
    expect(tz.tzName).toBe('Eastern European Summer Time');
  });

  test('returns empty array for unknown country code', () => {
    expect(Timezone.getTimezonesByCountryCode('XX')).toHaveLength(0);
  });

  test('returns empty array for empty string', () => {
    expect(Timezone.getTimezonesByCountryCode('')).toHaveLength(0);
  });
});

// ─── getCountriesByTimezone ───────────────────────────────────────────────────

describe('Timezone.getCountriesByTimezone', () => {
  test('returns countries that observe the given timezone', () => {
    const countries = Timezone.getCountriesByTimezone('Africa/Accra');
    expect(countries).toHaveLength(2);
    const codes = countries.map((c) => c.countryShortCode);
    expect(codes).toContain('GH');
    expect(codes).toContain('BF');
  });

  test('returns a single country for a unique timezone', () => {
    const countries = Timezone.getCountriesByTimezone('Europe/Mariehamn');
    expect(countries).toHaveLength(1);
    expect(countries[0]!.countryShortCode).toBe('AX');
  });

  test('returns empty array for unknown timezone', () => {
    expect(Timezone.getCountriesByTimezone('Unknown/Zone')).toHaveLength(0);
  });

  test('returns empty array for empty string', () => {
    expect(Timezone.getCountriesByTimezone('')).toHaveLength(0);
  });
});
