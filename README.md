# CountryData.js

## Overview

`CountryData.js` is a comprehensive Node.js package designed to provide easy access to detailed country information. It supports both JavaScript and TypeScript, making it versatile for various project needs. Whether you're building a web application, API, or any other project that requires country data, this package offers a simple and efficient solution.

## Features

- 🌍 **Comprehensive Country Data**: Access detailed information, including `country names`, `short codes`, `phone codes`, `regions`, and `flags`.
- ⚡ **JavaScript and TypeScript Support**: Use the package seamlessly in both JavaScript and TypeScript projects.
- 🔄 **Asynchronous Operations**: All methods return promises for efficient data handling.
- 📦 **Lightweight & Efficient**: Minimal dependencies to keep your project lean.
- 🏗️ **Easy Integration**: Seamlessly integrates with any Node.js project using ES modules and commonJS

## Status & Quality

| 🔄 CI Status                                                                                                                                                            | 📊 Code Coverage                                                                                                                                            | 🏆 Quality Gate Status                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![CI](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml/badge.svg)](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml) | [![codecov](https://codecov.io/github/Clifftech123/CountryData.js/graph/badge.svg?token=42Y3GT9MKN)](https://codecov.io/github/Clifftech123/CountryData.js) | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Clifftech123_CountryData.js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Clifftech123_CountryData.js) |

![NPM Downloads](https://img.shields.io/npm/d18m/countrydata.js)

## Installation

```sh
npm install countrydata.js
```

## Usage

### JavaScript Example

```javascript
import { CountryHelper } from 'countrydata.js';

const countryHelper = new CountryHelper();

// Get all countries
countryHelper.getCountries().then(console.log);

// Get country by short code
countryHelper.getCountryByShortCode('US').then(console.log);
```

### TypeScript Example

```typescript
import { CountryHelper } from 'countrydata.js';

const countryHelper = new CountryHelper();

// Get all countries
const allCountries = await countryHelper.getCountries();
console.log(allCountries);

// Get country by short code
const countryByCode = await countryHelper.getCountryByShortCode('US');
console.log(countryByCode);
```

## Sample Implementation

If you want to see a sample implementation of this package further in both javascript and typescript , you can check out the [Sample](https://github.com/Clifftech123/CountryData.js/tree/main/Sample) folder.

### Usage with Express.js

This package can be used in an Express.js application to create a REST API for country data. Check the [example folder](https://github.com/Clifftech123/CountryData.js/tree/main/Sample) for sample implementations in both JavaScript and TypeScript.

## API Reference

### `CountryHelper` Methods

| Method                                                                           | Description                                                                                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **`getCountries(): Promise<Country[]>`**                                         | Returns an array of all countries.                                                                |
| **`getCountryByShortCode(shortCode: string): Promise<Country \| null>`**         | Returns a country object based on the short code (e.g., "US"), or `null` if not found.            |
| **`getRegionsByCountryShortCode(shortCode: string): Promise<Region[]>`**         | Returns an array of regions for the specified country short code (e.g., "US").                    |
| **`getCountryByPhoneCode(phoneCode: string): Promise<Country \| null>`**         | Returns a country object based on the phone code (e.g., "1" for the US), or `null` if not found.  |
| **`getCountryPhoneCodeByShortCode(shortCode: string): Promise<string \| null>`** | Returns the phone code of a country based on the short code (e.g., "US"), or `null` if not found. |

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, or request features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on our GitHub repository or contact us directly through our support channels.

🚀 Get started today with `CountryData.js` and simplify your country data management!
