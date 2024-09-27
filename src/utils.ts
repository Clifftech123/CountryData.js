import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Country } from '../types/Country.js';
import type { Region } from '../types/Region.js';

/**
 * Class to manage and retrieve country data.
 */
export class CountryHelper {
  private countries: Country[] = [];
  private loadingPromise: Promise<void> | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  // Determine the file path based on the module system
  private static readonly fileName = (() => {
    if (typeof __dirname !== 'undefined') {
      // CommonJS
      return path.join(__dirname, '..', 'src', 'data.json');
    } else {
      // ESM
      return path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        '..',
        'src',
        'data.json',
      );
    }
  })();

  /**
   * Initializes the CountryHelper instance and starts loading the country data.
   */
  constructor() {
    this.loadCountries(CountryHelper.fileName);
  }

  /**
   * Loads country data from a JSON file.
   * @param fileName - The path to the JSON file containing country data.
   */
  private loadCountries(fileName: string): void {
    fs.readFile(
      fileName,
      'utf8',
      (err: NodeJS.ErrnoException | null, jsonString: string) => {
        if (err) {
          console.error('File read failed:', err);
          return;
        }
        try {
          const data: Country[] = JSON.parse(jsonString);
          data.forEach((country) => {
            country.countryFlag = this.getCountryEmojiFlag(
              country.countryShortCode,
            );
          });
          this.countries = data;
        } catch (err) {
          console.error('Error parsing JSON:', err);
        }
      },
    );
  }

  /**
   * Ensures that the country data is loaded before proceeding.
   * @returns A promise that resolves when the country data is loaded.
   */
  public async ensureCountriesLoaded(): Promise<void> {
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
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns The emoji flag of the country.
   */
  private getCountryEmojiFlag(countryShortCode: string): string {
    return countryShortCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0)),
      );
  }

  /**
   * Retrieves the list of all countries.
   * @returns A promise that resolves to an array of Country objects.
   */
  public async getCountries(): Promise<Country[]> {
    await this.ensureCountriesLoaded();
    return this.countries;
  }

  /**
   * Retrieves a country by its short code.
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns A promise that resolves to the Country object or null if not found.
   */
  public async getCountryByShortCode(
    countryShortCode: string,
  ): Promise<Country | null> {
    await this.ensureCountriesLoaded();
    return (
      this.countries.find(
        (country) => country.countryShortCode === countryShortCode,
      ) || null
    );
  }

  /**
   * Retrieves the regions of a country by its short code.
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns A promise that resolves to an array of Region objects.
   */
  public async getRegionsByCountryShortCode(
    countryShortCode: string,
  ): Promise<Region[]> {
    const country = await this.getCountryByShortCode(countryShortCode);
    return country ? country.regions : [];
  }

  /**
   * Retrieves a country by its phone code.
   * @param phoneCode - The phone code of the country (e.g., "1" for the US).
   * @returns A promise that resolves to the Country object or null if not found.
   */
  public async getCountryByPhoneCode(
    phoneCode: string,
  ): Promise<Country | null> {
    await this.ensureCountriesLoaded();
    return (
      this.countries.find((country) => country.phoneCode === phoneCode) || null
    );
  }

  /**
   * Retrieves the phone code of a country by its short code.
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns A promise that resolves to the phone code as a string or null if not found.
   */
  public async getCountryPhoneCodeByShortCode(
    countryShortCode: string,
  ): Promise<string | null> {
    const country = await this.getCountryByShortCode(countryShortCode);
    return country ? country.phoneCode : null;
  }
}

export default CountryHelper;
