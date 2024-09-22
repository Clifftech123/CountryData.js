import CountryHelper from 'countrydata.js';

(async () => {
  const countryHelper = new CountryHelper();
  const allCountries = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2));
})();

// Get country by short code
(async () => {
  const countryHelper = new CountryHelper();
  const country = await countryHelper.getCountryByShortCode('US');
  console.log(country);
})();

// Get regions in a particular country
(async () => {
  const countryHelper = new CountryHelper();
  const regions = await countryHelper.getRegionsByCountryShortCode('GH');
  console.log(regions);
})();

// Get country Country Flag
(async () => {
  const countryHelper = new CountryHelper();
  const country = await countryHelper.getCountryByShortCode('US');
  console.log(country?.countryFlag);
})();

// Get country by phone code
(async () => {
  const countryHelper = new CountryHelper();
  const country = await countryHelper.getCountryByPhoneCode('+233');
  console.log(country);
})();

// Get country phone code by short code
(async () => {
  const countryHelper = new CountryHelper();
  const phoneCode = await countryHelper.getCountryPhoneCodeByShortCode('US');
  console.log(phoneCode);
})();