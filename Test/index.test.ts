import { describe, beforeAll, beforeEach, afterEach, afterAll, test, expect, vi } from 'vitest';
import { CountryHelper } from '../src/index.js';
import * as fs from 'fs';

// Mock data representing a JSON structure of countries and their regions
const mockData = JSON.stringify([
  {
    countryName: "Åland Islands",
    countryShortCode: "AX",
    phoneCode: "+358",
    currency: [
      {
        code: "EUR",
        name: "European euro"
      }
    ],
    regions: [
      {
        Name: "Brändö",
        ShortCode: "BR"
      },
      {
        Name: "Eckerö",
        ShortCode: "EC"
      },
      {
        Name: "Finström",
        ShortCode: "FN"
      },
    ]
  }
]);

// Mock the 'fs' module to simulate file reading
vi.mock('fs');

describe('CountryHelper', () => {
  let countryHelper: CountryHelper;

  // Mock the fs.readFile method to return the mock data before all tests
  beforeAll(() => {
    vi.spyOn(fs, 'readFile').mockImplementation(((path: fs.PathOrFileDescriptor, options: { encoding?: BufferEncoding | null; flag?: string; } | BufferEncoding | null, callback: (err: NodeJS.ErrnoException | null, data: string | Buffer) => void) => {
      if (typeof options === 'function') {
        callback = options;
        options = 'utf8';
      }
      callback(null, mockData);
    }) as typeof fs.readFile);
  });

  // Initialize a new instance of CountryHelper before each test
  beforeEach(() => {
    countryHelper = new CountryHelper();
  });

  // Clear all mocks after each test
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Restore all mocks after all tests
  afterAll(() => {
    vi.restoreAllMocks();
  });

  // Test the getCountries method to ensure it returns all countries
  test('getCountries should return all countries', async () => {
    const countries = await countryHelper.getCountries();
    expect(countries).toHaveLength(1);
    expect(countries[0]?.countryName).toBe('Åland Islands');
  });

  // Test the getCountryByShortCode method to ensure it returns the correct country
  test('getCountryByShortCode should return the correct country', async () => {
    const country = await countryHelper.getCountryByShortCode('AX');
    expect(country).toBeDefined();
    expect(country?.countryName).toBe('Åland Islands');
  });

  // Test the getRegionsByCountryShortCode method to ensure it returns the correct regions
  test('getRegionsByCountryShortCode should return the correct regions', async () => {
    const regions = await countryHelper.getRegionsByCountryShortCode('AX');
    expect(regions).toHaveLength(3); // Update to expect 3 regions
    expect(regions[0]?.Name).toBe('Brändö');
    expect(regions[0]?.ShortCode).toBe('BR');
  });

  // Test the getCountryByPhoneCode method to ensure it returns the correct country
  test('getCountryByPhoneCode should return the correct country', async () => {
    const country = await countryHelper.getCountryByPhoneCode('+358');
    expect(country).toBeDefined();
    expect(country?.countryName).toBe('Åland Islands');
  });

  // Test the getCountryPhoneCodeByShortCode method to ensure it returns the correct phone code
  test('getCountryPhoneCodeByShortCode should return the correct phone code', async () => {
    const phoneCode = await countryHelper.getCountryPhoneCodeByShortCode('AX');
    expect(phoneCode).toBe('+358');
  });
});