
# CountryData.js
| CI Status                                                                                                                                           | Code Coverage                                                                                                                                    | Quality Gate Status                                                                                                                                                                                                 |
|------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [![CI](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml/badge.svg)](https://github.com/Clifftech123/CountryData.js/actions/workflows/main.yml) | [![codecov](https://codecov.io/github/Clifftech123/CountryData.js/graph/badge.svg?token=42Y3GT9MKN)](https://codecov.io/github/Clifftech123/CountryData.js) | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Clifftech123_CountryData.js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Clifftech123_CountryData.js) |




CountryData.js is a Node.js package designed to help developers easily access and use country data. Whether you're building a web API or any other application, this package provides a simple and efficient way to retrieve country information.

## Features

- **Easy Integration**: Seamlessly integrate with any Node.js framework.
- **Comprehensive Data**: Access detailed information about countries, including names, codes, and other relevant data.
- **Lightweight**: Minimal dependencies to keep your project lean.

## Installation

To install CountryData.js, use npm:

```sh
npm install countrydata.js
```

## Usage

Here's a quick example of how to use CountryData.js in your Node.js application:

```javascript
const countryData = require('countrydata.js');

// Get data for a specific country
const country = countryData.getCountry('US');
console.log(country);

// List all countries
const allCountries = countryData.getAllCountries();
console.log(allCountries);
```

## API

### `getCountry(code)`

Retrieve data for a specific country by its code.

- **Parameters**: `code` (string) - The country code (e.g., 'US' for the United States).
- **Returns**: An object containing country data.

### `getAllCountries()`

Retrieve data for all countries.

- **Returns**: An array of objects, each containing data for a country.

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## Support

If you encounter any issues or have questions, feel free to open an issue on GitHub or contact us directly.

