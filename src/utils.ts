import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Country } from '../types/Country.js';
import type { Region } from '../types/Region.js';

/**
 * Class to manage and retrieve country data efficiently.
 */
export class CountryHelper {
  private readonly countries: Country[];
  private readonly countryByShortCode: Map<string, Country>;
  private readonly countryByPhoneCode: Map<string, Country>;

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
   * Initializes the CountryHelper instance with indexed data structures for fast lookups.
   */
  constructor() {
    try {
      const jsonString = fs.readFileSync(CountryHelper.fileName, 'utf8');
      const data: Country[] = JSON.parse(jsonString);
      this.countries = data.map((country) => ({
        ...country,
        countryFlag: this.getCountryFlag(country.countryShortCode),
      }));

      // Initialize lookup maps
      this.countryByShortCode = new Map(
        this.countries.map((country) => [country.countryShortCode, country]),
      );
      this.countryByPhoneCode = new Map(
        this.countries.map((country) => [country.phoneCode, country]),
      );
    } catch (err) {
      console.error('Failed to load country data:', err);
      this.countries = [];
      this.countryByShortCode = new Map();
      this.countryByPhoneCode = new Map();
    }
  }

  /**
   * Converts a country short code to its corresponding emoji flag.
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns The emoji flag of the country.
   */
  public getCountryFlag(countryShortCode: string): string {
    return countryShortCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0)),
      );
  }

  /**
   * Retrieves the list of all countries.
   * @returns Array of Country objects.
   */
  public getCountries(): Country[] {
    return this.countries;
  }

  /**
   * Retrieves a country by its short code.
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns The Country object or null if not found.
   */
  public getCountryByShortCode(countryShortCode: string): Country | null {
    return this.countryByShortCode.get(countryShortCode) || null;
  }

  /**
   * Retrieves the regions of a country by its short code.
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns Array of Region objects.
   */
  public getRegionsByCountryShortCode(countryShortCode: string): Region[] {
    const country = this.getCountryByShortCode(countryShortCode);
    return country?.regions ?? [];
  }

  /**
   * Retrieves a country by its phone code.
   * @param phoneCode - The phone code of the country (e.g., "1" for the US).
   * @returns The Country object or null if not found.
   */
  public getCountryByPhoneCode(phoneCode: string): Country | null {
    return this.countryByPhoneCode.get(phoneCode) || null;
  }

  /**
   * Retrieves the phone code of a country by its short code.
   * @param countryShortCode - The short code of the country (e.g., "US").
   * @returns The phone code as a string or null if not found.
   */
  public getCountryPhoneCodeByShortCode(
    countryShortCode: string,
  ): string | null {
    return this.getCountryByShortCode(countryShortCode)?.phoneCode ?? null;
  }
}

export default CountryHelper;
