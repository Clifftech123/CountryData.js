// Import from local source instead of npm package
import { CountryHelper } from '../.././src/index.js';

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
