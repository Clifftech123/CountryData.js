# countrydata.js

## 2.0.0

### Major Changes

- **State & Province support**: Added `getAllStates()`, `getStatesOfCountry(countryCode)`, `getStateByCodeAndCountry(stateCode, countryCode)`, and `sortStates()` — covering 4 963 states and provinces worldwide.
- **City support**: Added `getAllCities()`, `getCitiesOfCountry(countryCode)`, `getCitiesOfState(countryCode, stateCode)`, and `sortCities()` — covering 148 000+ cities, lazily loaded on first use.
- **Enriched country data**: Countries now include `latitude`, `longitude`, `currencyCode`, and `timezones` (full timezone objects with GMT offset, abbreviation, and zone name).
- **New types exported**: `State`, `City`, and `Timezone` are now exported from the package.
- **Sort helpers**: `sortCountries()`, `sortStates()`, and `sortCities()` added for alphabetical ordering.
- **Data folder**: Source data reorganised into a per-country `data/` folder (one directory per country, one per state) to make community contributions easy. Two scripts added — `npm run generate:data` and `npm run build:data` — to convert between the source folder and compiled `src/*.json` files.
- **Data files renamed**: `src/data.json` → `src/countries.json`, new `src/states.json` and `src/cities.json`.

## 1.1.0

### Minor Changes

- 1f397b6: Enhanced the flag emoji functionality by renaming the method from getCountryEmoji to getCountryFlag, implementing proper string manipulation techniques, and optimizing performance.

## 1.0.5

### Patch Changes

- 227b2df: Fix: Fixed TypeScript types for Country and Region. Fixed the TypeScript compilation error.
- 3683b6d: Stable release for general use. Fixed all TypeScript issues and ensured compatibility with both JavaScript and TypeScript environments. Updated README to align with npm standards.
- 47916f4: Fix: Resolved the GitHub repository connection problem with npm and added a sample index.js.
- 83710eb: Updated build configuration to exclusively use ES Modules (ESM). Fixed the error our data.json not found. Updated the package.json to include the `type` field set to `module`.
- 10f9d39: Fix: Fixed TypeScript types for Country and Region. Fixed the TypeScript compilation error.

## 1.0.4

### Patch Changes

- 10f9d39: Fix: Fixed TypeScript types for Country and Region. Fixed the TypeScript compilation error.

## 1.0.3

### Patch Changes

- 83710eb: Updated build configuration to exclusively use ES Modules (ESM). Fixed the error our data.json not found. Updated the package.json to include the `type` field set to `module`.

## 1.0.2

### Patch Changes

- def97ba: Updated the GitHub Actions workflow to use Vitest for running tests and collecting coverage. Installed the `@vitest/coverage-v8` dependency to ensure coverage reports are generated correctly. Updated the `vitest.config.ts` to specify the `v8` coverage provider.

## 1.0.1

### Patch Changes

- 19a4fd5: Fix JavaScript and TypeScript compatibility issues

## 1.0.1

### Patch Changes

- 19a4fd5: Fix JavaScript and TypeScript compatibility issues

## 1.0.0

### Major Changes

- 071426c: Initial release of CountryData.js. This package provides comprehensive country data for Node.js developers, allowing easy integration with any Node.js framework. It includes features such as retrieving country information by code and listing all countries.
