# CountryData.js

`CountryData.js` is an offline Node.js library that gives you instant access to world country, state/province, and city data  with no API calls, no network required, and full TypeScript support.

## Status & Quality

| 🔄 CI Status                                                                                                                                                            | 📊 Code Coverage                                                                                                                                            | 🏆 Quality Gate                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![CI](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml/badge.svg)](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml) | [![codecov](https://codecov.io/github/Clifftech123/CountryData.js/graph/badge.svg?token=42Y3GT9MKN)](https://codecov.io/github/Clifftech123/CountryData.js) | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Clifftech123_CountryData.js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Clifftech123_CountryData.js) |

[![npm version](https://img.shields.io/npm/v/countrydata.js)](https://www.npmjs.com/package/countrydata.js)
[![NPM Downloads](https://img.shields.io/npm/d18m/countrydata.js)](https://www.npmjs.com/package/countrydata.js)
[![License: MIT](https://img.shields.io/npm/l/countrydata.js)](./LICENSE)

## Features

- **250 countries** — name, ISO code, phone code, flag emoji, currency (code/name/symbol),
  capital, population, area, continent, native/official name, demonym, languages, bordering
  countries, TLD, UN membership, latitude/longitude, timezones, and regions
- **4 963 states & provinces** with ISO codes and coordinates
- **148 000+ cities** linked to their country and state, lazily loaded, with paginated access
- **Fuzzy search** — case- and diacritic-insensitive (`Search.searchCountries()`, `searchStates()`, `searchCities()`)
- **Cross-entity filters** — by currency, continent, language, or admin region
- **Validation helpers** — `isValidCountryCode()`, `isValidPhoneCode()`, `isValidStateCode()`
- **Geo utilities** — Haversine distance, nearest country/city lookups
- **i18n** — translated country names in 7 locales via `getCountryName(code, locale)`
- **CLI** — `npx countrydata-export` dumps any dataset as CSV or SQL
- Synchronous API with O(1) lookups via Map indexes
- Works in both **ESM** and **CommonJS** environments
- Full **TypeScript** types included

## Installation

```sh
npm install countrydata.js
```

## Quick Start

### Module API (recommended)

```typescript
import { Country, State, City, Region, Timezone, Search, Geo } from 'countrydata.js';

// Countries
const all = Country.getAllCountries();
const us = Country.getCountryByCode('US');
const byPhone = Country.getCountryByPhoneCode('+233');
const flag = Country.getCountryFlag('GH'); // '🇬🇭'
const sorted = Country.sortCountries();
const eurCountries = Country.getCountriesByCurrency('EUR');
const african = Country.getCountriesByContinent('Africa');
const englishSpeaking = Country.getCountriesByLanguage('English');
const owner = Country.getCountriesByRegion('Bavaria'); // → [Germany]
const validCode = Country.isValidCountryCode('GH'); // true
const validPhone = Country.isValidPhoneCode('+233'); // true
const nameInFrench = Country.getCountryName('GH', 'fr'); // 'Ghana'

// States / Provinces
const states = State.getStatesOfCountry('US');
const ca = State.getStateByCodeAndCountry('CA', 'US');
const sorted = State.sortStates(states);
const validState = State.isValidStateCode('CA', 'US'); // true

// Cities (lazily loaded on first call)
const cities = City.getCitiesOfState('US', 'CA');
const ghCities = City.getCitiesOfCountry('GH');
const page = City.getCitiesPaginated({ countryCode: 'US', page: 1, pageSize: 25 });

// Regions
const regions = Region.getRegionsByCountryCode('US');
const region = Region.getRegionByShortCode('US', 'CA');

// Timezones
const tzList = Timezone.getTimezonesByCountryCode('US');
const allTz = Timezone.getAllTimezones();
const countries = Timezone.getCountriesByTimezone('America/New_York');

// Search (case-insensitive, prefix matches ranked first)
const countryMatches = Search.searchCountries('ghan'); // → [Ghana]
const stateMatches = Search.searchStates('accra');
const cityMatches = Search.searchCities('kum');

// Geo (distance in km, nearest lookups)
const distance = Geo.haversineDistanceKm(40.7128, -74.0060, 51.5074, -0.1278);
const nearestCity = Geo.getNearestCity(40.7128, -74.0060, { countryCode: 'US' });
```

### Class API

```typescript
import { CountryHelper } from 'countrydata.js';

const helper = new CountryHelper();

const us = helper.getCountryByShortCode('US');
const flag = helper.getCountryFlag('GH'); // '🇬🇭'
const code = helper.getCountryPhoneCodeByShortCode('GH'); // '+233'
const states = helper.getStatesOfCountry('US');
const cities = helper.getCitiesOfState('US', 'CA');
const regions = helper.getRegionsByCountryShortCode('US');
```

### Method chaining via model objects

```typescript
const us = Country.getCountryByCode('US');

const states = us?.getStates?.(); // IState[] for the US
const cities = us?.getCities?.(); // ICity[]  for the US

const ca = State.getStateByCodeAndCountry('CA', 'US');
const caCities = ca?.getCities?.(); // ICity[] for California
```

## API Reference

All methods are **synchronous** and return data directly no `await`, no `.then()`.

### `Country`

| Method                        | Returns                 | Description                         |
| ----------------------------- | ----------------------- | ----------------------------------- |
| `getAllCountries()`           | `ICountry[]`            | All 250 countries                   |
| `getCountryByCode(code)`      | `ICountry \| undefined` | Find by ISO code (e.g. `"US"`)      |
| `getCountryByPhoneCode(code)` | `ICountry \| undefined` | Find by phone code (e.g. `"+1"`)    |
| `getCountryFlag(code)`        | `string`                | Emoji flag (e.g. `"🇺🇸"`)            |
| `sortCountries(countries?)`   | `ICountry[]`            | Alphabetical copy (defaults to all) |
| `getCountriesByCurrency(code)`   | `ICountry[]` | Countries sharing a currency code (e.g. `"EUR"`)         |
| `getCountriesByContinent(name)`  | `ICountry[]` | Countries on a continent (e.g. `"Africa"`)               |
| `getCountriesByLanguage(name)`   | `ICountry[]` | Countries with a given official language                |
| `getCountriesByRegion(name)`     | `ICountry[]` | Country containing a named admin region (e.g. `"Bavaria"`) |
| `isValidCountryCode(code)`       | `boolean`    | Whether an ISO code exists in the dataset                |
| `isValidPhoneCode(code)`         | `boolean`    | Whether a phone code exists in the dataset               |
| `getCountryName(code, locale?)`  | `string \| undefined` | Translated name; falls back to English if the locale is missing |

Supported `locale` codes: `ar`, `zh`, `fr`, `ru`, `es`, `pt`, `de` (plus `en`/omitted → `countryName`). Coverage is 99–100% across all 250 countries for every locale. Raw translations are also available on `country.translations` (`Record<string, string>`).

### `State`

| Method                                             | Returns               | Description                         |
| -------------------------------------------------- | --------------------- | ----------------------------------- |
| `getAllStates()`                                   | `IState[]`            | All 4 963 states worldwide          |
| `getStatesOfCountry(countryCode)`                  | `IState[]`            | States for one country              |
| `getStateByCodeAndCountry(stateCode, countryCode)` | `IState \| undefined` | Single state lookup                 |
| `sortStates(states?)`                              | `IState[]`            | Alphabetical copy (defaults to all) |
| `isValidStateCode(stateCode, countryCode)`         | `boolean`              | Whether that state exists for that country |

### `City`

> Cities are lazily loaded on first call (~148 000 entries).

| Method                                     | Returns   | Description                      |
| ------------------------------------------ | --------- | -------------------------------- |
| `getAllCities()`                           | `ICity[]` | Every city in the dataset        |
| `getCitiesOfCountry(countryCode)`          | `ICity[]` | Cities for one country           |
| `getCitiesOfState(countryCode, stateCode)` | `ICity[]` | Cities for one state             |
| `sortCities(cities?)`                      | `ICity[]` | Sorted by country → state → name |
| `getCitiesPaginated(options?)`             | `{ items, page, pageSize, total, hasMore }` | Paged slice; pass `countryCode`/`stateCode` to scope before paginating |

### `Region`

| Method                                         | Returns                | Description               |
| ---------------------------------------------- | ---------------------- | ------------------------- |
| `getRegionsByCountryCode(countryCode)`         | `IRegion[]`            | All regions for a country |
| `getRegionByShortCode(countryCode, shortCode)` | `IRegion \| undefined` | Single region lookup      |
| `sortRegions(regions)`                         | `IRegion[]`            | Alphabetical copy         |

### `Timezone`

| Method                                   | Returns       | Description                             |
| ---------------------------------------- | ------------- | --------------------------------------- |
| `getAllTimezones()`                      | `ITimezone[]` | Every unique timezone in the dataset    |
| `getTimezonesByCountryCode(countryCode)` | `ITimezone[]` | Timezones for one country               |
| `getCountriesByTimezone(zoneName)`       | `ICountry[]`  | Countries that observe a given timezone |

### `Search`

Case-insensitive, diacritic-insensitive substring matching (`"sao paulo"` matches `"São Paulo"`), with exact matches ranked first, then prefix matches, then other substring matches. No fuzzy-matching dependency. Pass `{ limit }` to cap the number of results — useful for city search, which can otherwise return thousands of matches.

| Method                            | Returns      | Description                            |
| ---------------------------------- | ------------ | --------------------------------------- |
| `searchCountries(query, options?)` | `ICountry[]` | Countries whose `countryName` matches   |
| `searchStates(query, options?)`    | `IState[]`   | States whose `name` matches             |
| `searchCities(query, options?)`    | `ICity[]`    | Cities whose `name` matches             |

```typescript
Search.searchCities('sao paulo');            // finds "São Paulo" despite no accents in the query
Search.searchCountries('a', { limit: 10 });   // top 10 matches only
```

### `Geo`

Country/state/city coordinates are single points (typically a geographic centroid), not borders — so "nearest country" means nearest *centroid*, which can be counterintuitive for large countries (e.g. a point in New York City is nearer Bermuda's centroid than the continental US's). `getNearestCity()` scans the whole ~148k-city dataset if no `countryCode`/`stateCode` is given (~100ms); pass one to scope the search to an already-indexed subset (~3ms).

| Method                                          | Returns              | Description                                  |
| ------------------------------------------------ | --------------------- | --------------------------------------------- |
| `haversineDistanceKm(lat1, lon1, lat2, lon2)`     | `number`              | Great-circle distance between two coordinates |
| `getNearestCountry(lat, lon)`                     | `ICountry \| undefined` | Nearest country by centroid distance         |
| `getNearestCity(lat, lon, options?)`              | `ICity \| undefined`  | Nearest city; `options.countryCode`/`stateCode` narrow the search |

```typescript
Geo.haversineDistanceKm(40.7128, -74.0060, 51.5074, -0.1278); // NYC → London, ≈5570 km
Geo.getNearestCity(40.7128, -74.0060, { countryCode: 'US' }); // scoped — fast
```

### `CountryHelper` class

Wraps the module functions above into a class. All module methods are available as instance methods with equivalent names.

## TypeScript Types

```typescript
import type {
  ICountry,
  IState,
  ICity,
  IRegion,
  ITimezone,
} from 'countrydata.js';

interface ICountry {
  countryName: string;
  countryShortCode: string;
  phoneCode: string;
  countryFlag: string;
  currencyCode?: string;
  currencyName?: string;
  currencySymbol?: string;
  latitude?: string;
  longitude?: string;
  timezones?: ITimezone[];
  regions: IRegion[];
  capital?: string;
  population?: number;
  area?: number;
  continent?: string;
  officialName?: string;
  nativeName?: string;
  demonym?: string;
  languages?: string[];
  borders?: string[];
  tld?: string[];
  unMember?: boolean;
  independent?: boolean;
  translations?: Record<string, string>;
  getStates?(): IState[];
  getCities?(): ICity[];
}

interface IState {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude?: string | null;
  longitude?: string | null;
  getCities?(): ICity[];
}

interface ICity {
  name: string;
  countryCode: string;
  stateCode: string;
  latitude?: string | null;
  longitude?: string | null;
}

interface IRegion {
  name: string;
  shortCode: string;
}

interface ITimezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}
```

## Examples

### Country details

```typescript
const gh = Country.getCountryByCode('GH');
// {
//   countryName: 'Ghana',
//   countryShortCode: 'GH',
//   phoneCode: '+233',
//   countryFlag: '🇬🇭',
//   currencyCode: 'GHS',
//   currencyName: 'Ghanaian Cedi',
//   currencySymbol: '₵',
//   latitude: '8.00000000',
//   longitude: '-2.00000000',
//   timezones: [{ zoneName: 'Africa/Accra', gmtOffset: 0, ... }],
//   regions: [...],
//   capital: 'Accra',
//   population: 32833031,
//   area: 238535,
//   continent: 'Africa',
//   demonym: 'Ghanaian',
//   languages: ['English'],
//   borders: ['TG', 'BF', 'CI'],
//   tld: ['.gh'],
//   unMember: true,
//   independent: true
// }
```

### Country → States → Cities

```typescript
const states = State.getStatesOfCountry('GH');
// [{ name: 'Ashanti Region', isoCode: 'AH', countryCode: 'GH', ... }, ...]

const cities = City.getCitiesOfState('GH', 'AH');
// [{ name: 'Kumasi', countryCode: 'GH', stateCode: 'AH', ... }, ...]
```

### Use with Express.js

```typescript
import express from 'express';
import { Country, State, City } from 'countrydata.js';

const app = express();

app.get('/countries', (_, res) => res.json(Country.getAllCountries()));
app.get('/states/:code', (req, res) =>
  res.json(State.getStatesOfCountry(req.params.code)),
);
app.get('/cities/:cc/:state', (req, res) =>
  res.json(City.getCitiesOfState(req.params.cc, req.params.state)),
);

app.listen(3000);
```

See the [Sample](https://github.com/Clifftech123/CountryData.js/tree/main/Sample) folder for more complete examples.

## CLI

For non-JS consumers, `countrydata-export` dumps any of the three datasets as CSV or SQL:

```bash
npx countrydata-export --entity countries --format csv --out countries.csv
npx countrydata-export --entity cities --format sql > cities.sql
npx countrydata-export --help
```

| Flag        | Required | Description                                    |
| ----------- | -------- | ----------------------------------------------- |
| `--entity`  | yes      | `countries`, `states`, or `cities`               |
| `--format`  | no       | `csv` (default) or `sql`                         |
| `--out`     | no       | Output file path (defaults to stdout)            |

Nested fields (`timezones`, `regions`) are dropped from the export since they don't fit a flat row; array fields (`languages`, `borders`, `tld`) are joined with `|`.

## Contributing

Contributions are welcome! The data lives in three flat JSON files in the `data/` folder:

- `data/countries.json` country records
- `data/states.json` state/province records
- `data/cities.json` city records (array-of-arrays format)

**To update data or fix an entry:**

1. Edit the relevant file in `data/`
2. Run `npm run build:data` to re-sort and minify
3. Run `npm test` to verify nothing broke
4. Submit a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

## License

MIT — see [LICENSE](LICENSE) for details.
