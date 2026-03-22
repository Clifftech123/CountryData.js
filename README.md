# CountryData.js

`CountryData.js` is an offline Node.js library that gives you instant access to world country, state/province, and city data  with no API calls, no network required, and full TypeScript support.

## Status & Quality

| 🔄 CI Status                                                                                                                                                            | 📊 Code Coverage                                                                                                                                            | 🏆 Quality Gate                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![CI](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml/badge.svg)](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml) | [![codecov](https://codecov.io/github/Clifftech123/CountryData.js/graph/badge.svg?token=42Y3GT9MKN)](https://codecov.io/github/Clifftech123/CountryData.js) | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Clifftech123_CountryData.js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Clifftech123_CountryData.js) |

[![NPM Downloads](https://img.shields.io/npm/d18m/countrydata.js)](https://www.npmjs.com/package/countrydata.js)

## Features

- **250 countries** name, ISO code, phone code, flag emoji, currency code, latitude/longitude, timezones, and regions
- **4 963 states & provinces** with ISO codes and coordinates
- **148 000+ cities** linked to their country and state, lazily loaded
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
import { Country, State, City, Region, Timezone } from 'countrydata.js';

// Countries
const all = Country.getAllCountries();
const us = Country.getCountryByCode('US');
const byPhone = Country.getCountryByPhoneCode('+233');
const flag = Country.getCountryFlag('GH'); // '🇬🇭'
const sorted = Country.sortCountries();

// States / Provinces
const states = State.getStatesOfCountry('US');
const ca = State.getStateByCodeAndCountry('CA', 'US');
const sorted = State.sortStates(states);

// Cities (lazily loaded on first call)
const cities = City.getCitiesOfState('US', 'CA');
const ghCities = City.getCitiesOfCountry('GH');

// Regions
const regions = Region.getRegionsByCountryCode('US');
const region = Region.getRegionByShortCode('US', 'CA');

// Timezones
const tzList = Timezone.getTimezonesByCountryCode('US');
const allTz = Timezone.getAllTimezones();
const countries = Timezone.getCountriesByTimezone('America/New_York');
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

### `State`

| Method                                             | Returns               | Description                         |
| -------------------------------------------------- | --------------------- | ----------------------------------- |
| `getAllStates()`                                   | `IState[]`            | All 4 963 states worldwide          |
| `getStatesOfCountry(countryCode)`                  | `IState[]`            | States for one country              |
| `getStateByCodeAndCountry(stateCode, countryCode)` | `IState \| undefined` | Single state lookup                 |
| `sortStates(states?)`                              | `IState[]`            | Alphabetical copy (defaults to all) |

### `City`

> Cities are lazily loaded on first call (~148 000 entries).

| Method                                     | Returns   | Description                      |
| ------------------------------------------ | --------- | -------------------------------- |
| `getAllCities()`                           | `ICity[]` | Every city in the dataset        |
| `getCitiesOfCountry(countryCode)`          | `ICity[]` | Cities for one country           |
| `getCitiesOfState(countryCode, stateCode)` | `ICity[]` | Cities for one state             |
| `sortCities(cities?)`                      | `ICity[]` | Sorted by country → state → name |

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
  latitude?: string;
  longitude?: string;
  timezones?: ITimezone[];
  regions: IRegion[];
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
//   latitude: '8.00000000',
//   longitude: '-2.00000000',
//   timezones: [{ zoneName: 'Africa/Accra', gmtOffset: 0, ... }],
//   regions: [...]
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
