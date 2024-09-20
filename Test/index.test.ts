/**
 * @file index.test.ts
 * @description This file contains unit tests for the CountryHelper class using Jest.
 */

import CountryHelper from '../src/index';
import * as fs from 'fs';

jest.mock('fs');

/**
 * @description Mock data representing countries and their regions.
 */
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
 * @description Mock implementation of fs.readFile to return mock data.
 */
beforeAll(() => {
  (fs.readFile as unknown as jest.Mock).mockImplementation((_, __, callback) => {
    callback(null, mockData);
  });
});

let countryHelper: CountryHelper;

/**
 * @description Initialize a new instance of CountryHelper before each test.
 */
beforeEach(() => {
  countryHelper = new CountryHelper();
});

describe('CountryHelper', () => {
  /**
   * @test
   * @description Test if getCountries method returns all countries.
   */
  test('getCountries should return all countries', async () => {
    const countries = await countryHelper.getCountries();
    expect(countries).toHaveLength(1);
    expect(countries[0]?.countryName).toBe('Åland Islands');
  });

  /**
   * @test
   * @description Test if getCountryByShortCode method returns the correct country.
   */
  test('getCountryByShortCode should return the correct country', async () => {
    const country = await countryHelper.getCountryByShortCode('AX');
    expect(country).toBeDefined();
    expect(country?.countryName).toBe('Åland Islands');
  });

  /**
   * @test
   * @description Test if getRegionsByCountryShortCode method returns the correct regions.
   */
  test('getRegionsByCountryShortCode should return the correct regions', async () => {
    const regions = await countryHelper.getRegionsByCountryShortCode('AX');
    expect(regions).toHaveLength(16);
    expect(regions[0]?.Name).toBe('Brändö');
    expect(regions[0]?.ShortCode).toBe('BR');
  });

  /**
   * @test
   * @description Test if getCountryByPhoneCode method returns the correct country.
   */
  test('getCountryByPhoneCode should return the correct country', async () => {
    const country = await countryHelper.getCountryByPhoneCode('+358');
    expect(country).toBeDefined();
    expect(country?.countryName).toBe('Åland Islands');
  });

  /**
   * @test
   * @description Test if getCountryPhoneCodeByShortCode method returns the correct phone code.
   */
  test('getCountryPhoneCodeByShortCode should return the correct phone code', async () => {
    const phoneCode = await countryHelper.getCountryPhoneCodeByShortCode('AX');
    expect(phoneCode).toBe('+358');
  });
});