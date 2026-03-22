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
  latitude?: string;
  longitude?: string;
  timezones?: ITimezone[];
  regions: IRegion[];
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
