import express from 'express';
import cors from 'cors';

// Import the CountryHelper class from the dist/index.js file.
// But when you install it from npm, you can directly import the CountryHelper class from the index.js file.

import { CountryHelper } from '../../dist/index.js';

const app = express();
const port = process.env.PORT || 3000;
const countryHelper = new CountryHelper();

// Middleware
app.use(cors());
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

// Start the server
app.listen(port, () => {
  console.log(`CountryData.js API Sample running at http://localhost:${port}`);
});
