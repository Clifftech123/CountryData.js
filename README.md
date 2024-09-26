# CountryData.js

| CI Status                                                                                                                                                               | Code Coverage                                                                                                                                               | Quality Gate Status                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![CI](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml/badge.svg)](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml) | [![codecov](https://codecov.io/github/Clifftech123/CountryData.js/graph/badge.svg?token=42Y3GT9MKN)](https://codecov.io/github/Clifftech123/CountryData.js) | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Clifftech123_CountryData.js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Clifftech123_CountryData.js) |




# CountryData.js

CountryData.js is a comprehensive Node.js package designed to provide easy access to detailed country information. It supports both JavaScript and TypeScript, making it versatile for various project needs. Whether you're building a web application, API, or any other project that requires country data, this package offers a simple and efficient solution.

## Features

- **Comprehensive Country Data**: Access detailed information including country names, short codes, phone codes, currencies, regions, and emoji flags.
- **JavaScript and TypeScript Support**: Use the package in both JavaScript and TypeScript projects.
- **Easy Integration**: Seamlessly integrate with any Node.js project using ES modules.
- **Asynchronous Operations**: All methods return promises for efficient data handling.
- **Lightweight**: Minimal dependencies to keep your project lean.

## Installation

Install CountryData.js using npm:

```sh
npm install countrydata.js
```

## Usage

### JavaScript Version

```javascript
import { CountryHelper } from "countrydata.js";

const countryHelper = new CountryHelper();

// Get all countries
(async () => {
  const allCountries = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2));
})();

// Get country by short code
(async () => {
  const country = await countryHelper.getCountryByShortCode('US');
  console.log(country);
})();

// More examples...
```

### TypeScript Version

```typescript
import { CountryHelper } from "countrydata.js";
import type { Country, Region } from "countrydata.js";

const countryHelper = new CountryHelper();

// Get all countries
(async () => {
  const allCountries: Country[] = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2));
})();

// Get regions in a particular country
(async () => {
  const regions: Region[] = await countryHelper.getRegionsByCountryShortCode('GH');
  console.log(regions);
})();

// More examples...
```

## API

### `CountryHelper`

The main class that provides access to country data. It works the same way in both JavaScript and TypeScript.

#### Methods

- `getCountries(): Promise<Country[]>`
- `getCountryByShortCode(shortCode: string): Promise<Country | null>`
- `getRegionsByCountryShortCode(shortCode: string): Promise<Region[]>`
- `getCountryByPhoneCode(phoneCode: string): Promise<Country | null>`
- `getCountryPhoneCodeByShortCode(shortCode: string): Promise<string | null>`

### Data Types

#### `Country`

An object representing a country with the following properties:

- `countryName: string`
- `countryShortCode: string`
- `phoneCode: string`
- `currency: Array<{ code: string, name: string }>`
- `regions: Region[]`
- `countryFlag: string`

#### `Region`

An object representing a region or administrative division of a country:

- `Name: string`
- `ShortCode: string`

## TypeScript Support

For TypeScript users, CountryData.js comes with built-in type definitions. You can import types directly from the package:

```typescript
import { CountryHelper, Country, Region } from "countrydata.js";
```

This allows for better type checking and autocompletion in TypeScript projects.

## Contributing

We welcome contributions to CountryData.js! Please read our [contributing guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, or request features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions about using CountryData.js, please open an issue on our GitHub repository or contact us directly through our support channels.

