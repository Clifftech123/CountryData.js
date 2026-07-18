# countrydata.js

## 2.1.0

### Minor Changes

- ff24940: Add `City.getCitiesPaginated({ countryCode?, stateCode?, page?, pageSize? })` returning `{ items, page, pageSize, total, hasMore }` — a paged slice for browser/memory-constrained environments instead of loading all ~148k cities at once. Pass `countryCode`/`stateCode` to scope before paginating. Also available as a `CountryHelper` instance method.
- ff24940: Add a `countrydata-export` CLI (via `npx countrydata-export`) that dumps countries/states/cities as CSV or SQL for non-JS consumers: `--entity <countries|states|cities>`, `--format csv|sql`, `--out <path>`. No new dependency — pure Node built-ins.
- 798f23e: Add cross-entity country filters: `getCountriesByCurrency(code)`, `getCountriesByContinent(name)`, `getCountriesByLanguage(name)`, and `getCountriesByRegion(name)` (matches a country's administrative region, e.g. `"Bavaria"` → Germany). All case-insensitive, all O(1)/O(n) lookups backed by Maps built at load time. Also available as `CountryHelper` instance methods.
- b3f77f4: Add geo distance utilities: `Geo.haversineDistanceKm(lat1, lon1, lat2, lon2)`, `Geo.getNearestCountry(lat, lon)`, and `Geo.getNearestCity(lat, lon, options?)` (accepts `{ countryCode, stateCode }` to scope the search instead of scanning all ~148k cities). Also available as `CountryHelper` instance methods. No new dependency.
- ff24940: Add translated country names: `Country.getCountryName(code, locale?)` falls back to the English `countryName` when the locale is omitted or has no translation. Adds a new optional `translations?: Record<string, string>` field to `ICountry` covering `ar`, `zh`, `fr`, `ru`, `es`, `pt`, `de` (99-100% coverage across all 250 countries), sourced from Wikidata (CC0) via `scripts/fetch-wikidata.cjs`. Also available as a `CountryHelper` instance method.
- 3a5b8b0: Add `Search.searchCountries()`, `Search.searchStates()`, and `Search.searchCities()` — case-insensitive and diacritic-insensitive substring search (e.g. `"sao paulo"` matches `"São Paulo"`), with exact/prefix matches ranked first. Accepts an optional `{ limit }` to cap result count. Also available as `CountryHelper` instance methods. No new dependency.
- b3f77f4: Add validation helpers: `Country.isValidCountryCode(code)`, `Country.isValidPhoneCode(code)`, and `State.isValidStateCode(stateCode, countryCode)`. Also available as `CountryHelper` instance methods.
- 83bf8f9: Add capital, population, area, continent, official/native name, demonym, languages, borders, TLDs, UN membership/independence flags, and currency name/symbol to every country record. Sourced from Wikidata (CC0) and a hand-maintained ISO 4217 currency table via a new one-time build script (`npm run build:data:fetch`) — no runtime dependency added, the library stays fully offline.

## 2.0.0

### Major Changes

- 22cd3be: Add states/provinces (4963), cities (148k+), timezones, and regions support. New functional module API — Country, State, City, Region, Timezone — with O(1) Map-based lookups. Enriched country data with currency code, coordinates, timezones, and flag emoji. Lazy loading for city data, pre-sorted JSON files, and full TypeScript types for all interfaces.

  ## Breaking Changes

  ### What changed
  - `IRegion` fields renamed from `Name`/`ShortCode` to `name`/`shortCode` (lowercase)
  - Data files moved from `src/*.json` to `data/*.json`

  ### Why

  Standardised all interfaces to use consistent lowercase field names matching the rest of the data model.

  ### How to update

  **Before (v1.x):**

  ```ts
  import { CountryHelper } from 'countrydata.js';
  const helper = new CountryHelper();
  const regions = helper.getRegionsByCountryShortCode('US');
  regions[0].Name; // old
  regions[0].ShortCode; // old
  ```

  **After (v2.x):**

  ```ts
  import {
    CountryHelper,
    Country,
    State,
    City,
    Region,
    Timezone,
  } from 'countrydata.js';

  // Class API (still works)
  const helper = new CountryHelper();
  const regions = helper.getRegionsByCountryShortCode('US');
  regions[0].name; // updated
  regions[0].shortCode; // updated

  // New module API
  const us = Country.getCountryByCode('US');
  const states = State.getStatesOfCountry('US');
  const cities = City.getCitiesOfState('US', 'CA');
  const tzs = Timezone.getTimezonesByCountryCode('US');
  ```

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
