// To get this input you need to build the project using the following command:
// npm run build  : This will generate the dist folder with the index.js file.
// Then you can import the CountryHelper class from the dist/index.js file.
// But when you install it from npm, you can directly import the CountryHelper class from the src/index.js file.
// Take note of the import from teh local and production use . If you want to test the local version, you need to build the project firs but for production you can directly import the CountryHelper class from the index.js file.

import { CountryHelper, Search, Geo, City } from '../../dist/index.js';

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

/**
 * Gets and logs enriched fields (capital, population, currency, etc.) for a country.
 * @param {string} shortCode - The short code of the country (e.g., "GH").
 */
const getEnrichedFields = (shortCode) => {
  const country = countryHelper.getCountryByShortCode(shortCode);
  console.log({
    capital: country?.capital,
    population: country?.population,
    area: country?.area,
    continent: country?.continent,
    currencyName: country?.currencyName,
    currencySymbol: country?.currencySymbol,
    languages: country?.languages,
  });
};

/**
 * Gets and logs countries sharing a currency code.
 * @param {string} currencyCode - The currency code (e.g., "EUR").
 */
const getCountriesByCurrency = (currencyCode) => {
  const countries = countryHelper.getCountriesByCurrency(currencyCode);
  console.log(countries.map((c) => c.countryName));
};

/**
 * Validates a country code, phone code, and state code.
 */
const runValidationChecks = () => {
  console.log('isValidCountryCode("GH"):', countryHelper.isValidCountryCode('GH'));
  console.log('isValidPhoneCode("+233"):', countryHelper.isValidPhoneCode('+233'));
  console.log('isValidStateCode("CA", "US"):', countryHelper.isValidStateCode('CA', 'US'));
};

/**
 * Gets and logs a country's name translated into another locale.
 * @param {string} shortCode - The short code of the country (e.g., "GH").
 * @param {string} locale - The locale code (e.g., "fr").
 */
const getCountryName = (shortCode, locale) => {
  console.log(`${locale}:`, countryHelper.getCountryName(shortCode, locale));
};

/**
 * Searches countries by a fuzzy, case-insensitive query.
 * @param {string} query - The search text.
 */
const searchCountries = (query) => {
  console.log(Search.searchCountries(query).map((c) => c.countryName));
};

/**
 * Logs the great-circle distance between two coordinates and the nearest US city to one of them.
 */
const runGeoExamples = () => {
  const distance = Geo.haversineDistanceKm(40.7128, -74.006, 51.5074, -0.1278);
  console.log(`NYC to London: ${distance.toFixed(1)} km`);

  const nearest = Geo.getNearestCity(40.7128, -74.006, { countryCode: 'US' });
  console.log('Nearest US city to NYC coordinates:', nearest?.name);
};

/**
 * Gets and logs one page of cities for a country.
 */
const runPaginationExample = () => {
  const page = City.getCitiesPaginated({ countryCode: 'US', page: 1, pageSize: 5 });
  console.log(page.items.map((c) => c.name), `(total: ${page.total}, hasMore: ${page.hasMore})`);
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

console.log('\n===== ENRICHED FIELDS FOR GHANA (GH) =====');
getEnrichedFields('GH');

console.log('\n===== COUNTRIES USING EUR =====');
getCountriesByCurrency('EUR');

console.log('\n===== VALIDATION CHECKS =====');
runValidationChecks();

console.log('\n===== GHANA NAME IN OTHER LOCALES =====');
getCountryName('GH', 'fr');
getCountryName('GH', 'ar');
getCountryName('GH', 'de');

console.log('\n===== SEARCH COUNTRIES MATCHING "ghan" =====');
searchCountries('ghan');

console.log('\n===== GEO DISTANCE & NEAREST CITY =====');
runGeoExamples();

console.log('\n===== PAGINATED US CITIES (PAGE 1) =====');
runPaginationExample();
