/**
 * @module CountryHelper
 * @description This module provides a class to load and manage country data from a JSON file.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Country, Region } from './types/Country';

/**
 * Class representing a helper for country data.
 */
class CountryHelper {
  private countries: Country[] = [];
  private static readonly fileName = path.resolve(__dirname, '../src/data.json');


  /**
   * Create a CountryHelper.
   * @constructor
   */
  constructor() {
    this.loadCountries(CountryHelper.fileName);
  }

  /**
   * Load countries from a JSON file.
   * @private
   * @param {string} fileName - The path to the JSON file.
   */
  private loadCountries(fileName: string): void {
    fs.readFile(fileName, 'utf8', (err, jsonString) => {
      if (err) {
        console.error("File read failed:", err);
        return;
      }
      try {
        const data = JSON.parse(jsonString) as Country[];
        data.forEach(country => {
          country.countryFlag = this.getCountryEmojiFlag(country.countryShortCode);
        });
        this.countries = data;
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }
    });
  }

  /**
   * Ensure countries are loaded before use.
   * @private
   * @returns {Promise<void>} A promise that resolves when countries are loaded.
   */
  private ensureCountriesLoaded(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.countries.length > 0) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.countries.length > 0) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

  /**
   * Get the emoji flag for a country by its short code.
   * @private
   * @param {string} countryShortCode - The short code of the country.
   * @returns {string} The emoji flag of the country.
   */
  private getCountryEmojiFlag(countryShortCode: string): string {
    return countryShortCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  }

  /**
   * Get all countries.
   * @public
   * @async
   * @returns {Promise<Country[]>} A promise that resolves to an array of countries.
   */
  public async getCountries(): Promise<Country[]> {
    await this.ensureCountriesLoaded();
    return this.countries;
  }

  /**
   * Get a single country by its short code.
   * @public
   * @async
   * @param {string} countryShortCode - The short code of the country.
   * @returns {Promise<Country | undefined>} A promise that resolves to the country or undefined if not found.
   */
  public async getCountryByShortCode(countryShortCode: string): Promise<Country | undefined> {
    await this.ensureCountriesLoaded();
    return this.countries.find(country => country.countryShortCode === countryShortCode);
  }

  /**
   * Get regions in a particular country by its short code.
   * @public
   * @async
   * @param {string} countryShortCode - The short code of the country.
   * @returns {Promise<Region[]>} A promise that resolves to an array of regions.
   */
  public async getRegionsByCountryShortCode(countryShortCode: string): Promise<Region[]> {
    const country = await this.getCountryByShortCode(countryShortCode);
    return country ? country.regions : [];
  }

  /**
   * Get a single country by its phone code.
   * @public
   * @async
   * @param {string} phoneCode - The phone code of the country.
   * @returns {Promise<Country | undefined>} A promise that resolves to the country or undefined if not found.
   */
  public async getCountryByPhoneCode(phoneCode: string): Promise<Country | undefined> {
    await this.ensureCountriesLoaded();
    return this.countries.find(country => country.phoneCode === phoneCode);
  }

  /**
   * Get a country's phone code by its short code.
   * @public
   * @async
   * @param {string} countryShortCode - The short code of the country.
   * @returns {Promise<string | undefined>} A promise that resolves to the phone code or undefined if not found.
   */
  public async getCountryPhoneCodeByShortCode(countryShortCode: string): Promise<string | undefined> {
    const country = await this.getCountryByShortCode(countryShortCode);
    return country ? country.phoneCode : undefined;
  }
}

// Example usage
(async () => {
  const countryHelper = new CountryHelper();
  const allCountries = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2)); 
})();

// Export the CountryHelper class
export default CountryHelper;