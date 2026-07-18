import type {
  ICountry,
  IState,
  ICity,
  IRegion,
  ITimezone,
  ISearchOptions,
} from './shared/interface.js';
import {
  getAllCountries,
  getCountryByCode,
  getCountryByPhoneCode,
  getCountryFlag,
  sortCountries,
  getCountriesByCurrency,
  getCountriesByContinent,
  getCountriesByLanguage,
  getCountriesByRegion,
} from './modules/country.js';
import {
  getAllStates,
  getStatesOfCountry,
  getStateByCodeAndCountry,
  sortStates,
} from './modules/state.js';
import {
  getAllCities,
  getCitiesOfCountry,
  getCitiesOfState,
  sortCities,
} from './modules/city.js';
import {
  getRegionsByCountryCode,
  getRegionByShortCode,
  sortRegions,
} from './modules/regions.js';
import {
  getTimezonesByCountryCode,
  getCountriesByTimezone,
  getAllTimezones,
} from './modules/timezone.js';
import {
  searchCountries,
  searchStates,
  searchCities,
} from './modules/search.js';

export class CountryHelper {
  // ─── Country flag ─────────────────────────────────────────────────────────

  public getCountryFlag(countryShortCode: string): string {
    return getCountryFlag(countryShortCode);
  }

  // ─── Country methods ──────────────────────────────────────────────────────

  public getCountries(): ICountry[] {
    return getAllCountries();
  }

  public getCountryByShortCode(countryShortCode: string): ICountry | null {
    return getCountryByCode(countryShortCode) ?? null;
  }

  public getCountryByPhoneCode(phoneCode: string): ICountry | null {
    return getCountryByPhoneCode(phoneCode) ?? null;
  }

  public getCountryPhoneCodeByShortCode(
    countryShortCode: string,
  ): string | null {
    return getCountryByCode(countryShortCode)?.phoneCode ?? null;
  }

  public sortCountries(countries?: ICountry[]): ICountry[] {
    return sortCountries(countries);
  }

  // ─── Cross-entity filter methods ─────────────────────────────────────────

  public getCountriesByCurrency(currencyCode: string): ICountry[] {
    return getCountriesByCurrency(currencyCode);
  }

  public getCountriesByContinent(continent: string): ICountry[] {
    return getCountriesByContinent(continent);
  }

  public getCountriesByLanguage(language: string): ICountry[] {
    return getCountriesByLanguage(language);
  }

  public getCountriesByRegion(regionName: string): ICountry[] {
    return getCountriesByRegion(regionName);
  }

  // ─── Region methods ───────────────────────────────────────────────────────

  public getRegionsByCountryShortCode(countryShortCode: string): IRegion[] {
    return getRegionsByCountryCode(countryShortCode);
  }

  public getRegionByShortCode(
    countryShortCode: string,
    shortCode: string,
  ): IRegion | undefined {
    return getRegionByShortCode(countryShortCode, shortCode);
  }

  public sortRegions(regions: IRegion[]): IRegion[] {
    return sortRegions(regions);
  }

  // ─── Timezone methods ─────────────────────────────────────────────────────

  public getTimezonesByCountryCode(countryCode: string): ITimezone[] {
    return getTimezonesByCountryCode(countryCode);
  }

  public getCountriesByTimezone(zoneName: string): ICountry[] {
    return getCountriesByTimezone(zoneName);
  }

  public getAllTimezones(): ITimezone[] {
    return getAllTimezones();
  }

  // ─── State methods ────────────────────────────────────────────────────────

  public getAllStates(): IState[] {
    return getAllStates();
  }

  public getStatesOfCountry(countryCode: string): IState[] {
    return getStatesOfCountry(countryCode);
  }

  public getStateByCodeAndCountry(
    stateCode: string,
    countryCode: string,
  ): IState | undefined {
    return getStateByCodeAndCountry(stateCode, countryCode);
  }

  public sortStates(states?: IState[]): IState[] {
    return sortStates(states);
  }

  // ─── City methods ─────────────────────────────────────────────────────────

  public getAllCities(): ICity[] {
    return getAllCities();
  }

  public getCitiesOfCountry(countryCode: string): ICity[] {
    return getCitiesOfCountry(countryCode);
  }

  public getCitiesOfState(countryCode: string, stateCode: string): ICity[] {
    return getCitiesOfState(countryCode, stateCode);
  }

  public sortCities(cities?: ICity[]): ICity[] {
    return sortCities(cities);
  }

  // ─── Search methods ───────────────────────────────────────────────────────

  public searchCountries(query: string, options?: ISearchOptions): ICountry[] {
    return searchCountries(query, options);
  }

  public searchStates(query: string, options?: ISearchOptions): IState[] {
    return searchStates(query, options);
  }

  public searchCities(query: string, options?: ISearchOptions): ICity[] {
    return searchCities(query, options);
  }
}

export default CountryHelper;
