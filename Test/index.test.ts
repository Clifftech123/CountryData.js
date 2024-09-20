/**
 * @file index.test.ts
 * @description Unit tests for the CountryHelper class.
 */

import CountryHelper from '../src/index';
import * as fs from 'fs';

jest.mock('fs');

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
      {
        Name: "Föglö",
        ShortCode: "FG"
      },
      {
        Name: "Geta",
        ShortCode: "GT"
      },
      {
        Name: "Hammarland",
        ShortCode: "HM"
      },
      {
        Name: "Jomala",
        ShortCode: "JM"
      },
      {
        Name: "Kumlinge",
        ShortCode: "KM"
      },
      {
        Name: "Kökar",
        ShortCode: "KK"
      },
      {
        Name: "Lemland",
        ShortCode: "LE"
      },
      {
        Name: "Lumparland",
        ShortCode: "LU"
      },
      {
        Name: "Mariehamn",
        ShortCode: "MH"
      },
      {
        Name: "Saltvik",
        ShortCode: "SV"
      },
      {
        Name: "Sottunga",
        ShortCode: "ST"
      },
      {
        Name: "Sund",
        ShortCode: "SD"
      },
      {
        Name: "Vårdö",
        ShortCode: "VR"
      }
    ]
  }
]);

/**
 * Mock the fs.readFile method to return mock data.
 */
beforeAll(() => {
  (fs.readFile as unknown as jest.Mock).mockImplementation((_, __, callback) => {
    callback(null, mockData);
  });
});

let countryHelper: CountryHelper;

/**
 * Initialize a new instance of CountryHelper before each test.
 */
beforeEach(() => {
  countryHelper = new CountryHelper();
});

/**
 * Clear all timers after each test.
 */
afterEach(() => {
  jest.clearAllTimers();
});

describe('CountryHelper', () => {
  /**
   * Test the getCountries method.
   */
  test('getCountries should return all countries', async () => {
    const countries = await countryHelper.getCountries();
    expect(countries).toHaveLength(1);
    expect(countries[0]?.countryName).toBe('Åland Islands');
  });

  /**
   * Test the getCountryByShortCode method.
   */
  test('getCountryByShortCode should return the correct country', async () => {
    const country = await countryHelper.getCountryByShortCode('AX');
    expect(country).toBeDefined();
    expect(country?.countryName).toBe('Åland Islands');
  });

  /**
   * Test the getRegionsByCountryShortCode method.
   */
  test('getRegionsByCountryShortCode should return the correct regions', async () => {
    const regions = await countryHelper.getRegionsByCountryShortCode('AX');
    expect(regions).toHaveLength(16);
    expect(regions[0]?.Name).toBe('Brändö');
    expect(regions[0]?.ShortCode).toBe('BR');
  });

  /**
   * Test the getCountryByPhoneCode method.
   */
  test('getCountryByPhoneCode should return the correct country', async () => {
    const country = await countryHelper.getCountryByPhoneCode('+358');
    expect(country).toBeDefined();
    expect(country?.countryName).toBe('Åland Islands');
  });

  /**
   * Test the getCountryPhoneCodeByShortCode method.
   */
  test('getCountryPhoneCodeByShortCode should return the correct phone code', async () => {
    const phoneCode = await countryHelper.getCountryPhoneCodeByShortCode('AX');
    expect(phoneCode).toBe('+358');
  });
});