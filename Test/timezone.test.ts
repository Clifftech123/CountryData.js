import { describe, test, expect, vi } from 'vitest';
import { Timezone } from '../src/index.js';

// vi.mock() is hoisted above imports, so fixture data must be pulled in via a
// dynamic import inside the factory rather than referenced from a top-level import.
vi.mock('fs', async () => {
  const f = await import('./fixtures.js');
  const countries = [f.COUNTRY_ALAND, f.COUNTRY_GHANA, f.COUNTRY_BURKINA_FASO];
  return { readFileSync: f.mockFsReader(countries, [], []) };
});

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
