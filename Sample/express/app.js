import express from 'express';
import cors from 'cors';

// Import the CountryHelper class from the dist/index.js file.
// But when you install it from npm, you can directly import the CountryHelper class from the index.js file.

import { CountryHelper, Search, Geo, City } from '../../dist/index.js';

const app = express();
app.disable('x-powered-by');
const port = process.env.PORT || 8000;
const countryHelper = new CountryHelper();

// SECURITY NOTE: CORS is configured for local development only
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
  }),
);

app.use(express.json());

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'CountryData.js API Sample',
    endpoints: [
      {
        method: 'GET',
        path: '/api/countries',
        description: 'Get all countries',
      },
      {
        method: 'GET',
        path: '/api/countries/:shortCode',
        description: 'Get country by short code',
      },
      {
        method: 'GET',
        path: '/api/countries/:shortCode/regions',
        description: 'Get regions by country short code',
      },
      {
        method: 'GET',
        path: '/api/phone-code/:phoneCode',
        description: 'Get country by phone code',
      },
      {
        method: 'GET',
        path: '/api/countries/:shortCode/phone-code',
        description: 'Get country phone code by short code',
      },

      {
        method: 'GET',
        path: '/api/countries/:shortCode/flag',
        description: 'Get country flag by short code',
      },
      {
        method: 'GET',
        path: '/api/countries/currency/:code',
        description: 'Get countries sharing a currency code (e.g. EUR)',
      },
      {
        method: 'GET',
        path: '/api/countries/continent/:name',
        description: 'Get countries on a continent (e.g. Africa)',
      },
      {
        method: 'GET',
        path: '/api/countries/:shortCode/name/:locale',
        description:
          'Get a country name translated into a locale (ar, zh, fr, ru, es, pt, de)',
      },
      {
        method: 'GET',
        path: '/api/validate/country/:code',
        description: 'Check whether a country ISO code is valid',
      },
      {
        method: 'GET',
        path: '/api/search/countries?q=',
        description: 'Fuzzy search countries by name',
      },
      {
        method: 'GET',
        path: '/api/geo/distance?lat1=&lon1=&lat2=&lon2=',
        description: 'Great-circle distance in km between two coordinates',
      },
      {
        method: 'GET',
        path: '/api/cities?countryCode=&stateCode=&page=&pageSize=',
        description:
          'Paginated city listing, optionally scoped to a country/state',
      },
    ],
  });
});

// Get all countries
app.get('/api/countries', (_req, res) => {
  try {
    const countries = countryHelper.getCountries();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get country by short code
app.get('/api/countries/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const country = countryHelper.getCountryByShortCode(shortCode);

    if (!country) {
      return res
        .status(404)
        .json({ error: `Country with short code '${shortCode}' not found` });
    }

    res.json(country);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get regions by country short code
app.get('/api/countries/:shortCode/regions', (req, res) => {
  try {
    const { shortCode } = req.params;
    const regions = countryHelper.getRegionsByCountryShortCode(shortCode);

    if (!regions || regions.length === 0) {
      return res.status(404).json({
        error: `No regions found for country with short code '${shortCode}'`,
      });
    }

    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get country by phone code
app.get('/api/phone-code/:phoneCode', (req, res) => {
  try {
    const { phoneCode } = req.params;
    const country = countryHelper.getCountryByPhoneCode(phoneCode);

    if (!country) {
      return res
        .status(404)
        .json({ error: `Country with phone code '${phoneCode}' not found` });
    }

    res.json(country);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get country phone code by short code
app.get('/api/countries/:shortCode/phone-code', (req, res) => {
  try {
    const { shortCode } = req.params;
    const phoneCode = countryHelper.getCountryPhoneCodeByShortCode(shortCode);

    if (!phoneCode) {
      return res.status(404).json({
        error: `Phone code for country with short code '${shortCode}' not found`,
      });
    }

    res.json({ shortCode, phoneCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get country flag by short code

app.get('/api/countries/:shortCode/flag', (req, res) => {
  try {
    const { shortCode } = req.params;
    const flag = countryHelper.getCountryFlag(shortCode);
    res.json({ flag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get countries sharing a currency code
app.get('/api/countries/currency/:code', (req, res) => {
  try {
    const countries = countryHelper.getCountriesByCurrency(req.params.code);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get countries on a continent
app.get('/api/countries/continent/:name', (req, res) => {
  try {
    const countries = countryHelper.getCountriesByContinent(req.params.name);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a country name translated into a locale, falling back to English
app.get('/api/countries/:shortCode/name/:locale', (req, res) => {
  try {
    const { shortCode, locale } = req.params;
    const name = countryHelper.getCountryName(shortCode, locale);

    if (!name) {
      return res
        .status(404)
        .json({ error: `Country with short code '${shortCode}' not found` });
    }

    res.json({ shortCode, locale, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate a country ISO code
app.get('/api/validate/country/:code', (req, res) => {
  try {
    res.json({
      code: req.params.code,
      valid: countryHelper.isValidCountryCode(req.params.code),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fuzzy search countries by name
app.get('/api/search/countries', (req, res) => {
  try {
    const q = req.query.q ?? '';
    res.json(Search.searchCountries(q, { limit: 20 }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Great-circle distance between two coordinates
app.get('/api/geo/distance', (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.query;
    if ([lat1, lon1, lat2, lon2].some((v) => v === undefined)) {
      return res
        .status(400)
        .json({ error: 'lat1, lon1, lat2, and lon2 are all required' });
    }
    const km = Geo.haversineDistanceKm(
      Number(lat1),
      Number(lon1),
      Number(lat2),
      Number(lon2),
    );
    res.json({ km });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Paginated city listing, optionally scoped to a country/state
app.get('/api/cities', (req, res) => {
  try {
    const { countryCode, stateCode, page, pageSize } = req.query;
    const result = City.getCitiesPaginated({
      countryCode,
      stateCode,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`CountryData.js API Sample running at http://localhost:${port}`);
});
