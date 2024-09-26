import { CountryHelper } from 'countrydata.js';

const countryHelper = new CountryHelper();

const getCountries = async () => {
  const allCountries = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2));
};

const getCountryByShortCode = async (shortCode) => {
  const country = await countryHelper.getCountryByShortCode(shortCode);
  console.log(country);
};

const getRegionsByCountryShortCode = async (shortCode) => {
  const regions = await countryHelper.getRegionsByCountryShortCode(shortCode);
  console.log(regions);
};

const getCountryFlag = async (shortCode) => {
  const country = await countryHelper.getCountryByShortCode(shortCode);
  console.log(country?.countryFlag);
};

const getCountryByPhoneCode = async (phoneCode) => {
  const country = await countryHelper.getCountryByPhoneCode(phoneCode);
  console.log(country);
};

const getCountryPhoneCodeByShortCode = async (shortCode) => {
  const phoneCode = await countryHelper.getCountryPhoneCodeByShortCode(shortCode);
  console.log(phoneCode);
};

// Example usage
(async () => {
  await getCountries();
  await getCountryByShortCode('US');
  await getRegionsByCountryShortCode('GH');
  await getCountryFlag('US');
  await getCountryByPhoneCode('+233');
  await getCountryPhoneCodeByShortCode('US');
})();