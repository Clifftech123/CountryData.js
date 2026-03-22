import { describe, test, expect, vi } from 'vitest';
import { City } from '../src/index.js';

const MOCK_COUNTRIES = [
  { countryName: 'Åland Islands', countryShortCode: 'AX', phoneCode: '+358', timezones: [], regions: [] },
  { countryName: 'Ghana',         countryShortCode: 'GH', phoneCode: '+233', timezones: [], regions: [] },
];

const MOCK_STATES = [
  { name: 'Brändö',        isoCode: 'BR', countryCode: 'AX' },
  { name: 'Eckerö',        isoCode: 'EC', countryCode: 'AX' },
  { name: 'Ashanti Region',isoCode: 'AH', countryCode: 'GH' },
  { name: 'Greater Accra', isoCode: 'AA', countryCode: 'GH' },
];

const MOCK_CITIES: string[][] = [
  ['Brändö Village', 'AX', 'BR', '60.41667',  '21.05000'],
  ['Eckerö Village', 'AX', 'EC', '60.22500',  '19.55000'],
  ['Kumasi',         'GH', 'AH', '6.68848',   '-1.62443'],
  ['Accra',          'GH', 'AA', '5.55602',   '-0.19690'],
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
    const input = [MOCK_CITIES[3], MOCK_CITIES[0]] as string[][];
    const cities = City.getCitiesOfCountry('AX');
    const sorted = City.sortCities([...cities].reverse());
    expect(sorted[0]!.name).toBe('Brändö Village');
    expect(cities[0]!.name).toBe('Brändö Village');
  });
});
