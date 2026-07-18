# CountryData.js Express Sample

This sample demonstrates how to use CountryData.js in an Express.js application to create a REST API for country data. This sample uses a direct reference to the local CountryData.js source code.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

3. The server will start at http://localhost:3000

## Available Endpoints

- `GET /` - API documentation
- `GET /api/countries` - Get all countries
- `GET /api/countries/:shortCode` - Get country by short code (e.g., US, GB)
- `GET /api/countries/:shortCode/regions` - Get regions by country short code
- `GET /api/phone-code/:phoneCode` - Get country by phone code (e.g., +1, +44)
- `GET /api/countries/:shortCode/phone-code` - Get country phone code by short code
- `GET /api/countries/:shortCode/flag` - Get country flag emoji by short code
- `GET /api/countries/currency/:code` - Get countries sharing a currency code (e.g. EUR)
- `GET /api/countries/continent/:name` - Get countries on a continent (e.g. Africa)
- `GET /api/countries/:shortCode/name/:locale` - Get a translated country name (ar, zh, fr, ru, es, pt, de)
- `GET /api/validate/country/:code` - Check whether a country ISO code is valid
- `GET /api/search/countries?q=` - Fuzzy search countries by name
- `GET /api/geo/distance?lat1=&lon1=&lat2=&lon2=` - Great-circle distance in km between two coordinates
- `GET /api/cities?countryCode=&stateCode=&page=&pageSize=` - Paginated city listing

## Example Requests

### Get all countries

```
GET http://localhost:3000/api/countries
```

### Get country by short code

```
GET http://localhost:3000/api/countries/US
```

### Get regions for a country

```
GET http://localhost:3000/api/countries/US/regions
```

### Get country by phone code

```
GET http://localhost:3000/api/phone-code/+1
```

### Get phone code for a country

```
GET http://localhost:3000/api/countries/US/phone-code
```

### Get flag for a country

```
GET http://localhost:3000/api/countries/US/flag
```

### Get countries sharing a currency

```
GET http://localhost:3000/api/countries/currency/EUR
```

### Get a translated country name

```
GET http://localhost:3000/api/countries/GH/name/fr
```

### Validate a country code

```
GET http://localhost:3000/api/validate/country/GH
```

### Search countries

```
GET http://localhost:3000/api/search/countries?q=ghan
```

### Great-circle distance between two coordinates

```
GET http://localhost:3000/api/geo/distance?lat1=40.7128&lon1=-74.0060&lat2=51.5074&lon2=-0.1278
```

### Paginated cities

```
GET http://localhost:3000/api/cities?countryCode=US&page=1&pageSize=25
```
