export interface ITimezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

export interface IRegion {
  name: string;
  shortCode: string;
}

export interface ICountry {
  countryName: string;
  countryShortCode: string;
  phoneCode: string;
  countryFlag: string;
  currencyCode?: string;
  currencyName?: string;
  currencySymbol?: string;
  latitude?: string;
  longitude?: string;
  timezones?: ITimezone[];
  regions: IRegion[];
  capital?: string;
  population?: number;
  area?: number;
  continent?: string;
  officialName?: string;
  nativeName?: string;
  demonym?: string;
  languages?: string[];
  borders?: string[];
  tld?: string[];
  unMember?: boolean;
  independent?: boolean;
  /** Translated country names keyed by ISO 639-1 locale (e.g. "fr", "ar"). English is
   *  covered by countryName, not repeated here. Use Country.getCountryName() for lookups
   *  with a fallback to countryName when a locale is missing. */
  translations?: Record<string, string>;
  /** Get all states/provinces for this country */
  getStates?(): IState[];
  /** Get all cities for this country */
  getCities?(): ICity[];
}

export interface IState {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude?: string | null;
  longitude?: string | null;
  /** Get all cities for this state */
  getCities?(): ICity[];
}

export interface ICity {
  name: string;
  countryCode: string;
  stateCode: string;
  latitude?: string | null;
  longitude?: string | null;
}

export interface ISearchOptions {
  /** Cap the number of results returned (after ranking). Unlimited if omitted. */
  limit?: number;
}

export interface INearestCityOptions {
  /** Restrict the search to one country instead of scanning all ~148k cities. */
  countryCode?: string;
  /** Restrict further to one state — requires countryCode to also be set. */
  stateCode?: string;
}

export interface ICityPaginationOptions {
  /** Restrict to one country before paginating. */
  countryCode?: string;
  /** Restrict further to one state — requires countryCode to also be set. */
  stateCode?: string;
  /** 1-indexed page number. Defaults to 1. */
  page?: number;
  /** Items per page. Defaults to 50. */
  pageSize?: number;
}

export interface IPaginatedCities {
  items: ICity[];
  page: number;
  pageSize: number;
  /** Total matching cities across all pages (after countryCode/stateCode filtering). */
  total: number;
  hasMore: boolean;
}
