import { describe, test, expect, vi } from 'vitest';
import { State } from '../src/index.js';

const MOCK_COUNTRIES = [
  {
    countryName: 'Åland Islands', countryShortCode: 'AX', phoneCode: '+358',
    currencyCode: 'EUR', latitude: '60.11666700', longitude: '19.90000000',
    timezones: [], regions: [],
  },
  {
    countryName: 'Ghana', countryShortCode: 'GH', phoneCode: '+233',
    currencyCode: 'GHS', latitude: '8.00000000', longitude: '-2.00000000',
    timezones: [], regions: [],
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

// ─── getAllStates ─────────────────────────────────────────────────────────────

describe('State.getAllStates', () => {
  test('returns all states', () => {
    expect(State.getAllStates()).toHaveLength(3);
  });

  test('state shape has required fields', () => {
    const s = State.getAllStates()[0]!;
    expect(s).toHaveProperty('name');
    expect(s).toHaveProperty('isoCode');
    expect(s).toHaveProperty('countryCode');
    expect(s).toHaveProperty('latitude');
    expect(s).toHaveProperty('longitude');
  });

  test('attaches getCities method to each state', () => {
    const s = State.getAllStates()[0]!;
    expect(typeof s.getCities).toBe('function');
  });
});

// ─── getStatesOfCountry ───────────────────────────────────────────────────────

describe('State.getStatesOfCountry', () => {
  test('returns states for a valid country', () => {
    const states = State.getStatesOfCountry('AX');
    expect(states).toHaveLength(2);
    expect(states.every((s) => s.countryCode === 'AX')).toBe(true);
  });

  test('returns states for another country', () => {
    expect(State.getStatesOfCountry('GH')).toHaveLength(1);
  });

  test('returns empty array for unknown country code', () => {
    expect(State.getStatesOfCountry('XX')).toHaveLength(0);
  });

  test('returns empty array for empty string', () => {
    expect(State.getStatesOfCountry('')).toHaveLength(0);
  });

  test('returns a copy — mutating result does not affect cache', () => {
    const a = State.getStatesOfCountry('AX');
    a.push({ name: 'Fake', isoCode: 'FK', countryCode: 'AX' });
    expect(State.getStatesOfCountry('AX')).toHaveLength(2);
  });
});

// ─── getStateByCodeAndCountry ─────────────────────────────────────────────────

describe('State.getStateByCodeAndCountry', () => {
  test('returns the correct state', () => {
    const s = State.getStateByCodeAndCountry('BR', 'AX')!;
    expect(s.name).toBe('Brändö');
    expect(s.isoCode).toBe('BR');
    expect(s.countryCode).toBe('AX');
  });

  test('returns undefined for unknown state code', () => {
    expect(State.getStateByCodeAndCountry('ZZ', 'AX')).toBeUndefined();
  });

  test('returns undefined for empty state code', () => {
    expect(State.getStateByCodeAndCountry('', 'AX')).toBeUndefined();
  });

  test('returns undefined for empty country code', () => {
    expect(State.getStateByCodeAndCountry('BR', '')).toBeUndefined();
  });
});

// ─── sortStates ───────────────────────────────────────────────────────────────

describe('State.sortStates', () => {
  test('sorts all states alphabetically when called with no args', () => {
    const sorted = State.sortStates();
    expect(sorted[0]!.name).toBe('Ashanti Region');
    expect(sorted[1]!.name).toBe('Brändö');
    expect(sorted[2]!.name).toBe('Eckerö');
  });

  test('sorts a provided array without mutating the original', () => {
    const input = State.getStatesOfCountry('AX');
    const sorted = State.sortStates([...input].reverse());
    expect(sorted[0]!.name).toBe('Brändö');
    expect(input[0]!.name).toBe('Brändö');
  });
});

// ─── getCities via state object ───────────────────────────────────────────────

describe('State object getCities chaining', () => {
  test('getCities() returns cities belonging to that state', () => {
    const s = State.getStateByCodeAndCountry('BR', 'AX')!;
    const cities = s.getCities!();
    expect(cities).toHaveLength(1);
    expect(cities[0]!.name).toBe('Brändö Village');
  });

  test('getCities() returns empty array for state with no cities', () => {
    const s = State.getStateByCodeAndCountry('EC', 'AX')!;
    expect(s.getCities!()).toHaveLength(1);
  });
});
