// types/countrydata.js.d.ts
declare module 'countrydata.js' {
    export class CountryHelper {
      getCountries(): Promise<any>;
      getCountryByShortCode(shortCode: string): Promise<any>;
      getRegionsByCountryShortCode(shortCode: string): Promise<any>;
      getCountryByPhoneCode(phoneCode: string): Promise<any>;
      getCountryPhoneCodeByShortCode(shortCode: string): Promise<any>;
    }
  }