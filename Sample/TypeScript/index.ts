import { CountryHelper } from '../../dist/index.cjs';

(async () => {
  const countryHelper = new CountryHelper();
  const allCountries = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2));
})();

// Get country by short code
(async () => {
  const countryHelper = new CountryHelper();
  const countryData = await countryHelper.getCountryByShortCode('US');
  console.log(countryData);
})();

// Get regions in a particular country
(async () => {
  const countryHelper = new CountryHelper();
  const regionsData = await countryHelper.getRegionsByCountryShortCode('GH');
  console.log(regionsData);
})();

// Get country Country Flag
(async () => {
  const countryHelper = new CountryHelper();
  const countryData = await countryHelper.getCountryByShortCode('US');
  console.log(countryData?.countryFlag);
})();

// Get country by phone code
(async () => {
  const countryHelper = new CountryHelper();
  const countryData = await countryHelper.getCountryByPhoneCode('+233');
  console.log(countryData);
})();

// Get country phone code by short code
(async () => {
  const countryHelper = new CountryHelper();
  const phoneCode = await countryHelper.getCountryPhoneCodeByShortCode('US');
  console.log(phoneCode);
})();


