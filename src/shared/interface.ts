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
