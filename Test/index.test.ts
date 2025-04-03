import { describe, test, expect, vi, beforeAll } from 'vitest';
import { CountryHelper } from '../src/index.js';

// Move the mock declaration before any imports that use it
vi.mock('fs', () => ({
  readFileSync: () =>
    JSON.stringify([
      {
        countryName: 'Åland Islands',
        countryShortCode: 'AX',
        phoneCode: '+358',
        currency: [
          {
            code: 'EUR',
            name: 'European euro',
            symbol: '€',
          },
        ],
        regions: [
          {
            Name: 'Brändö',
            ShortCode: 'BR',
          },
          {
            Name: 'Eckerö',
            ShortCode: 'EC',
          },
          {
            Name: 'Finström',
            ShortCode: 'FN',
          },
        ],
      },
    ]),
}));

describe('CountryHelper', () => {
  let countryHelper: CountryHelper;

  beforeAll(() => {
    countryHelper = new CountryHelper();
  });

  test('getCountries should return all countries', () => {
    const countries = countryHelper.getCountries();
    expect(countries).toHaveLength(1);
    expect(countries[0]!.countryName).toBe('Åland Islands');
  });

  test('getCountryByShortCode should return the correct country', () => {
    const country = countryHelper.getCountryByShortCode('AX');
    expect(country).toBeDefined();
    expect(country!.countryName).toBe('Åland Islands');
  });

  test('getRegionsByCountryShortCode should return the correct regions', () => {
    const regions = countryHelper.getRegionsByCountryShortCode('AX');
    expect(regions).toHaveLength(3);
    expect(regions[0]!.Name).toBe('Brändö');
    expect(regions[0]!.ShortCode).toBe('BR');
  });

  test('getCountryByPhoneCode should return the correct country', () => {
    const country = countryHelper.getCountryByPhoneCode('+358');
    expect(country).toBeDefined();
    expect(country!.countryName).toBe('Åland Islands');
  });

  test('getCountryPhoneCodeByShortCode should return the correct phone code', () => {
    const phoneCode = countryHelper.getCountryPhoneCodeByShortCode('AX');
    expect(phoneCode).toBe('+358');
  });
});
