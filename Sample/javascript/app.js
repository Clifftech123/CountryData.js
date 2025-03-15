// To get this input you need to build the project using the following command:
// npm run build  : This will generate the dist folder with the index.js file.
// Then you can import the CountryHelper class from the dist/index.js file.
// But when you install it from npm, you can directly import the CountryHelper class from the src/index.js file.

import { CountryHelper } from '../../dist/index.js';

// Create an instance of CountryHelper
const countryHelper = new CountryHelper();

/**
 * Gets and logs all countries.
 */
const getCountries = () => {
  const allCountries = countryHelper.getCountries();
  // Only log a few countries to avoid console flooding
  console.log(JSON.stringify(allCountries.slice(0, 3), null, 2));
  console.log(`Total countries: ${allCountries.length}`);
};

/**
 * Gets and logs a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
const getCountryByShortCode = (shortCode) => {
  const country = countryHelper.getCountryByShortCode(shortCode);
  console.log(country);
};

/**
 * Gets and logs the regions of a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
const getRegionsByCountryShortCode = (shortCode) => {
  const regions = countryHelper.getRegionsByCountryShortCode(shortCode);
  console.log(regions);
};

/**
 * Gets and logs the flag emoji of a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
const getCountryFlag = (shortCode) => {
  const country = countryHelper.getCountryByShortCode(shortCode);
  console.log(country?.countryFlag);
};

/**
 * Gets and logs a country by its phone code.
 * @param {string} phoneCode - The phone code of the country (e.g., "1" for the US).
 */
const getCountryByPhoneCode = (phoneCode) => {
  const country = countryHelper.getCountryByPhoneCode(phoneCode);
  console.log(country);
};

/**
 * Gets and logs the phone code of a country by its short code.
 * @param {string} shortCode - The short code of the country (e.g., "US").
 */
const getCountryPhoneCodeByShortCode = (shortCode) => {
  const phoneCode = countryHelper.getCountryPhoneCodeByShortCode(shortCode);
  console.log(phoneCode);
};

// Run examples with clear section headers
console.log('\n===== ALL COUNTRIES (SAMPLE) =====');
getCountries();

console.log('\n===== COUNTRY BY SHORT CODE (US) =====');
getCountryByShortCode('US');

console.log('\n===== REGIONS IN GHANA (GH) =====');
getRegionsByCountryShortCode('GH');

console.log('\n===== US FLAG EMOJI =====');
getCountryFlag('US');

console.log('\n===== COUNTRY BY PHONE CODE (+233) =====');
getCountryByPhoneCode('+233');

console.log('\n===== PHONE CODE FOR US =====');
getCountryPhoneCodeByShortCode('US');
