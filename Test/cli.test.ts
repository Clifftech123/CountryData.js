import { describe, test, expect } from 'vitest';
import {
  parseArgs,
  csvEscape,
  toCsv,
  sqlEscape,
  toSql,
  flattenCountry,
  flattenState,
  flattenCity,
} from '../src/cli.js';

// ─── parseArgs ──────────────────────────────────────────────────────────────

describe('parseArgs', () => {
  test('parses --key value pairs', () => {
    expect(parseArgs(['--entity', 'countries', '--format', 'csv'])).toEqual({
      entity: 'countries',
      format: 'csv',
    });
  });

  test('treats a flag with no following value as boolean-ish "true"', () => {
    expect(parseArgs(['--help'])).toEqual({ help: 'true' });
  });

  test('does not consume the next flag as a value', () => {
    expect(parseArgs(['--entity', '--format', 'csv'])).toEqual({
      entity: 'true',
      format: 'csv',
    });
  });

  test('returns an empty object for no args', () => {
    expect(parseArgs([])).toEqual({});
  });
});

// ─── CSV ────────────────────────────────────────────────────────────────────

describe('csvEscape', () => {
  test('leaves plain values untouched', () => {
    expect(csvEscape('Ghana')).toBe('Ghana');
    expect(csvEscape(42)).toBe('42');
  });

  test('quotes values containing commas', () => {
    expect(csvEscape('Congo, Republic of the')).toBe('"Congo, Republic of the"');
  });

  test('escapes embedded quotes by doubling them', () => {
    expect(csvEscape('Côte d\'Ivoire "CIV"')).toBe('"Côte d\'Ivoire ""CIV"""');
  });

  test('quotes values containing newlines', () => {
    expect(csvEscape('line1\nline2')).toBe('"line1\nline2"');
  });

  test('renders undefined/null as an empty string', () => {
    expect(csvEscape(undefined)).toBe('');
    expect(csvEscape(null)).toBe('');
  });
});

describe('toCsv', () => {
  test('returns empty string for no rows', () => {
    expect(toCsv([])).toBe('');
  });

  test('renders a header row followed by data rows', () => {
    const csv = toCsv([{ name: 'Ghana', code: 'GH' }, { name: 'Togo', code: 'TG' }]);
    expect(csv).toBe('name,code\nGhana,GH\nTogo,TG\n');
  });
});

// ─── SQL ────────────────────────────────────────────────────────────────────

describe('sqlEscape', () => {
  test('quotes strings and escapes embedded quotes', () => {
    expect(sqlEscape("O'Brien")).toBe("'O''Brien'");
  });

  test('leaves numbers and booleans unquoted', () => {
    expect(sqlEscape(42)).toBe('42');
    expect(sqlEscape(true)).toBe('true');
  });

  test('renders undefined/null as SQL NULL', () => {
    expect(sqlEscape(undefined)).toBe('NULL');
    expect(sqlEscape(null)).toBe('NULL');
  });
});

describe('toSql', () => {
  test('returns empty string for no rows', () => {
    expect(toSql('countries', [])).toBe('');
  });

  test('emits a CREATE TABLE followed by one INSERT per row', () => {
    const sql = toSql('countries', [{ name: 'Ghana', code: 'GH' }]);
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `countries`');
    expect(sql).toContain('`name` TEXT');
    expect(sql).toContain('`code` TEXT');
    expect(sql).toContain("INSERT INTO `countries` (`name`, `code`) VALUES ('Ghana', 'GH');");
  });
});

// ─── flatteners ─────────────────────────────────────────────────────────────

describe('flattenCountry', () => {
  test('joins array fields with "|" and drops functions/nested arrays', () => {
    const flat = flattenCountry({
      countryName: 'Ghana',
      countryShortCode: 'GH',
      phoneCode: '+233',
      countryFlag: '🇬🇭',
      regions: [{ name: 'Ashanti', shortCode: 'AH' }],
      languages: ['English'],
      borders: ['TG', 'BF', 'CI'],
      tld: ['.gh'],
      getStates: () => [],
      getCities: () => [],
    } as never);

    expect(flat.languages).toBe('English');
    expect(flat.borders).toBe('TG|BF|CI');
    expect(flat.tld).toBe('.gh');
    expect(flat).not.toHaveProperty('regions');
    expect(flat).not.toHaveProperty('timezones');
    expect(flat).not.toHaveProperty('getStates');
    expect(flat).not.toHaveProperty('getCities');
  });
});

describe('flattenState', () => {
  test('passes through scalar fields, drops getCities', () => {
    const flat = flattenState({
      name: 'Ashanti Region',
      isoCode: 'AH',
      countryCode: 'GH',
      latitude: '6.74700',
      longitude: '-1.52000',
      getCities: () => [],
    } as never);

    expect(flat).toEqual({
      name: 'Ashanti Region',
      isoCode: 'AH',
      countryCode: 'GH',
      latitude: '6.74700',
      longitude: '-1.52000',
    });
  });
});

describe('flattenCity', () => {
  test('passes through all fields as-is', () => {
    const flat = flattenCity({
      name: 'Kumasi',
      countryCode: 'GH',
      stateCode: 'AH',
      latitude: '6.68848',
      longitude: '-1.62443',
    });

    expect(flat).toEqual({
      name: 'Kumasi',
      countryCode: 'GH',
      stateCode: 'AH',
      latitude: '6.68848',
      longitude: '-1.62443',
    });
  });
});
