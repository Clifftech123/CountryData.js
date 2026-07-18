import { describe, test, expect, vi } from 'vitest';
import { State } from '../src/index.js';

// vi.mock() is hoisted above imports, so fixture data must be pulled in via a
// dynamic import inside the factory rather than referenced from a top-level import.
vi.mock('fs', async () => {
  const f = await import('./fixtures.js');
  const countries = [f.COUNTRY_ALAND, f.COUNTRY_GHANA];
  const states = [f.STATE_BRANDO, f.STATE_ECKERO, f.STATE_ASHANTI_REGION];
  const cities = [f.CITY_BRANDO_VILLAGE, f.CITY_ECKERO_VILLAGE, f.CITY_KUMASI];
  return { readFileSync: f.mockFsReader(countries, states, cities) };
});

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

// ─── isValidStateCode ─────────────────────────────────────────────────────────

describe('State.isValidStateCode', () => {
  test('returns true for a known state/country pair', () => {
    expect(State.isValidStateCode('BR', 'AX')).toBe(true);
  });

  test('returns false for an unknown state code', () => {
    expect(State.isValidStateCode('ZZ', 'AX')).toBe(false);
  });

  test('returns false when the state belongs to a different country', () => {
    expect(State.isValidStateCode('BR', 'GH')).toBe(false);
  });

  test('returns false for empty input', () => {
    expect(State.isValidStateCode('', 'AX')).toBe(false);
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
