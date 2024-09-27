import { CountryHelper } from '.'; // Import the CountryHelper class

// Create an instance of CountryHelper
const countryHelper = new CountryHelper();

/**
 * Fetches and logs all countries.
 */
const getCountries = async () => {
  const allCountries = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2));
};

/**
 * Fetches and logs a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
const getCountryByShortCode = async (shortCode) => {
  const country = await countryHelper.getCountryByShortCode(shortCode);
  console.log(country);
};

/**
 * Fetches and logs the regions of a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
const getRegionsByCountryShortCode = async (shortCode) => {
  const regions = await countryHelper.getRegionsByCountryShortCode(shortCode);
  console.log(regions);
};

/**
 * Fetches and logs the flag emoji of a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
const getCountryFlag = async (shortCode) => {
  const country = await countryHelper.getCountryByShortCode(shortCode);
  console.log(country?.countryFlag);
};

/**
 * Fetches and logs a country by its phone code.
 * @param {string} phoneCode - The phone code of the country (e.g., "1" for the US).
 */
const getCountryByPhoneCode = async (phoneCode) => {
  const country = await countryHelper.getCountryByPhoneCode(phoneCode);
  console.log(country);
};

/**
 * Fetches and logs the phone code of a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
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