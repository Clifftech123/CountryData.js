import type {
  ICountry,
  IState,
  ICity,
  IRegion,
  ITimezone,
} from './shared/interface.js';
import {
  getAllCountries,
  getCountryByCode,
  getCountryByPhoneCode,
  getCountryFlag,
  sortCountries,
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
}

export default CountryHelper;
