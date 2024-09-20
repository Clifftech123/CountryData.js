/**
 * @module CountryHelper
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Country, Region } from './types/Country';

/**
 * Class representing a helper for country-related operations.
 */
class CountryHelper {
  private countries: Country[] = [];
  private loadingPromise: Promise<void> | null = null;
  private static readonly fileName = path.resolve(__dirname, '../src/data.json');
  private timeoutId: NodeJS.Timeout | null = null;

  /**
   * Creates an instance of CountryHelper and initiates loading of countries.
   */
  constructor() {
    this.loadCountries(CountryHelper.fileName);
  }

  /**
   * Loads countries from a JSON file.
   * @private
   * @param {string} fileName - The path to the JSON file containing country data.
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
   * Ensures that countries are loaded before proceeding.
   * @returns {Promise<void>} A promise that resolves when countries are loaded.
   */
  ensureCountriesLoaded(): Promise<void> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise<void>((resolve) => {
      const checkCountries = () => {
        if (this.countries.length > 0) {
          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
          }
          resolve();
        } else {
          this.timeoutId = setTimeout(checkCountries, 100);
        }
      };
      checkCountries();
    });

    return this.loadingPromise;
  }

  /**
   * Converts a country short code to its corresponding emoji flag.
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
   * Gets the list of countries.
   * @returns {Promise<Country[]>} A promise that resolves to an array of countries.
   */
  public async getCountries(): Promise<Country[]> {
    await this.ensureCountriesLoaded();
    return this.countries;
  }

  /**
   * Gets a country by its short code.
   * @param {string} countryShortCode - The short code of the country.
   * @returns {Promise<Country | undefined>} A promise that resolves to the country or undefined if not found.
   */
  public async getCountryByShortCode(countryShortCode: string): Promise<Country | undefined> {
    await this.ensureCountriesLoaded();
    return this.countries.find(country => country.countryShortCode === countryShortCode);
  }

  /**
   * Gets the regions of a country by its short code.
   * @param {string} countryShortCode - The short code of the country.
   * @returns {Promise<Region[]>} A promise that resolves to an array of regions.
   */
  public async getRegionsByCountryShortCode(countryShortCode: string): Promise<Region[]> {
    const country = await this.getCountryByShortCode(countryShortCode);
    return country ? country.regions : [];
  }

  /**
   * Gets a country by its phone code.
   * @param {string} phoneCode - The phone code of the country.
   * @returns {Promise<Country | undefined>} A promise that resolves to the country or undefined if not found.
   */
  public async getCountryByPhoneCode(phoneCode: string): Promise<Country | undefined> {
    await this.ensureCountriesLoaded();
    return this.countries.find(country => country.phoneCode === phoneCode);
  }

  /**
   * Gets the phone code of a country by its short code.
   * @param {string} countryShortCode - The short code of the country.
   * @returns {Promise<string | undefined>} A promise that resolves to the phone code or undefined if not found.
   */
  public async getCountryPhoneCodeByShortCode(countryShortCode: string): Promise<string | undefined> {
    const country = await this.getCountryByShortCode(countryShortCode);
    return country ? country.phoneCode : undefined;
  }
}

export default CountryHelper;