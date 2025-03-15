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
