// Import from the built local package instead of npm — run `npm run build` at the repo
// root first (same convention as the javascript/ and express/ samples).
import { Country, State, City, Search, Geo, CountryHelper } from '../../dist/index.js';

// Create a single instance to use for all operations
const countryHelper = new CountryHelper();

// Log all countries
console.log('All Countries:');
const allCountries = countryHelper.getCountries();
console.log(JSON.stringify(allCountries.slice(0, 2), null, 2));

// Get country by short code
console.log('\nCountry by Short Code (US):');
const countryByCode = countryHelper.getCountryByShortCode('US');
console.log(countryByCode);

// Get regions in a particular country
console.log('\nRegions in Ghana (GH):');
const regionsData = countryHelper.getRegionsByCountryShortCode('GH');
console.log(regionsData);

// Get country flag
console.log('\nUS Country Flag:');
const countryWithFlag = countryHelper.getCountryByShortCode('US');
console.log(countryWithFlag?.countryFlag);

// Get country by phone code
console.log('\nCountry by Phone Code (+233):');
const countryByPhone = countryHelper.getCountryByPhoneCode('+233');
console.log(countryByPhone);

// Get country phone code by short code
console.log('\nPhone Code for US:');
const phoneCode = countryHelper.getCountryPhoneCodeByShortCode('US');
console.log(phoneCode);

// ─── Enriched country data (capital, population, currency name/symbol, etc.) ──

console.log('\nEnriched fields for Ghana:');
const ghana = countryHelper.getCountryByShortCode('GH');
console.log({
  capital: ghana?.capital,
  population: ghana?.population,
  area: ghana?.area,
  continent: ghana?.continent,
  currencyName: ghana?.currencyName,
  currencySymbol: ghana?.currencySymbol,
  languages: ghana?.languages,
});

// ─── Cross-entity filters ──────────────────────────────────────────────────────

console.log('\nCountries using EUR:');
console.log(countryHelper.getCountriesByCurrency('EUR').map((c) => c.countryName));

console.log('\nCountries in Africa:');
console.log(countryHelper.getCountriesByContinent('Africa').length, 'countries');

console.log('\nCountries speaking French:');
console.log(countryHelper.getCountriesByLanguage('French').length, 'countries');

console.log('\nCountry containing the "California" region:');
console.log(countryHelper.getCountriesByRegion('California').map((c) => c.countryName));

// ─── Validation ─────────────────────────────────────────────────────────────

console.log('\nValidation checks:');
console.log('isValidCountryCode("GH"):', countryHelper.isValidCountryCode('GH'));
console.log('isValidPhoneCode("+233"):', countryHelper.isValidPhoneCode('+233'));
console.log('isValidStateCode("CA", "US"):', countryHelper.isValidStateCode('CA', 'US'));

// ─── i18n ───────────────────────────────────────────────────────────────────

console.log('\nGhana in other locales:');
console.log('fr:', countryHelper.getCountryName('GH', 'fr'));
console.log('ar:', countryHelper.getCountryName('GH', 'ar'));
console.log('de:', countryHelper.getCountryName('GH', 'de'));

// ─── Fuzzy search ───────────────────────────────────────────────────────────

console.log('\nSearch countries matching "ghan":');
console.log(Search.searchCountries('ghan').map((c) => c.countryName));

console.log('\nSearch cities matching "sao paulo" (diacritic-insensitive):');
console.log(Search.searchCities('sao paulo', { limit: 3 }).map((c) => c.name));

// ─── Geo distance ───────────────────────────────────────────────────────────

console.log('\nDistance from New York City to London (km):');
console.log(Geo.haversineDistanceKm(40.7128, -74.006, 51.5074, -0.1278).toFixed(1));

console.log('\nNearest city to NYC, scoped to the US:');
console.log(Geo.getNearestCity(40.7128, -74.006, { countryCode: 'US' })?.name);

// ─── City pagination ────────────────────────────────────────────────────────

console.log('\nFirst page of US cities (pageSize 5):');
const page = City.getCitiesPaginated({ countryCode: 'US', page: 1, pageSize: 5 });
console.log(page.items.map((c) => c.name), `(total: ${page.total}, hasMore: ${page.hasMore})`);

// Module-style access works the same way as the class API, e.g.:
console.log('\nStates of Ghana (module API):', State.getStatesOfCountry('GH').length);
console.log('Country module getAllCountries():', Country.getAllCountries().length);
