# CountryData.js ![NPM Downloads](https://img.shields.io/npm/d18m/countrydata.js)


| CI Status                                                                                                                                                               | Code Coverage                                                                                                                                               | Quality Gate Status                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![CI](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml/badge.svg)](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml) | [![codecov](https://codecov.io/github/Clifftech123/CountryData.js/graph/badge.svg?token=42Y3GT9MKN)](https://codecov.io/github/Clifftech123/CountryData.js) | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Clifftech123_CountryData.js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Clifftech123_CountryData.js) |






CountryData.js is a comprehensive Node.js package designed to provide easy access to detailed country information. It supports both JavaScript and TypeScript, making it versatile for various project needs. Whether you're building a web application, API, or any other project that requires country data, this package offers a simple and efficient solution.

Make sure to compile TypeScript files to JavaScript before running the code.


## Features

- **Comprehensive Country Data**: Access detailed information including `country names`, `short codes`, `phone codes`,  `regions`, and  `flags`.
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


```

### TypeScript Version

```typescript

import { CountryHelper } from 'countrydata.js';

(async () => {
  const countryHelper = new CountryHelper();
  const allCountries = await countryHelper.getCountries();
  console.log(JSON.stringify(allCountries, null, 2));
})();

// Get country by short code
(async () => {
  const countryHelper = new CountryHelper();
  const countryData = await countryHelper.getCountryByShortCode('US');
  console.log(countryData);
})();

```

You can check the sample code in the [example folder](https://github.com/Clifftech123/CountryData.js/tree/main/Sample).
With this sample code, you can see how to use the package in your project both in JavaScript and TypeScript.

Make sure to check how the Sample has been implemented .

## API

### `CountryHelper`

The main class that provides access to country data. It works the same way in both JavaScript and TypeScript.

#### Methods


| Method | Description |
|--------|-------------|
| `getCountries(): Promise<Country[]>` | Fetches and returns a promise that resolves to an array of all countries. |
| `getCountryByShortCode(shortCode: string): Promise<Country` | null>` | Fetches and returns a promise that resolves to a country object based on the provided country short code (e.g., "US"). Returns `null` if the country is not found. |
| `getRegionsByCountryShortCode(shortCode: string): Promise<Region[]>` | Fetches and returns a promise that resolves to an array of regions for the specified country short code (e.g., "US"). |
| `getCountryByPhoneCode(phoneCode: string): Promise<Country` | null> | Fetches and returns a promise that resolves to a country object based on the provided phone code (e.g., "1" for the US). Returns `null` if the country is not found. |
| `getCountryPhoneCodeByShortCode(shortCode: string): Promise<string` | null>` | Fetches and returns a promise that resolves to the phone code of a country based on the provided country short code (e.g., "US"). Returns `null` if the country is not found. |

## Contributing

We welcome contributions to CountryData.js! Please read our [contributing guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, or request features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions about using CountryData.js, please open an issue on our GitHub repository or contact us directly through our support channels.


