---
'countrydata.js': major
---

Add states/provinces (4963), cities (148k+), timezones, and regions support. New functional module API — Country, State, City, Region, Timezone — with O(1) Map-based lookups. Enriched country data with currency code, coordinates, timezones, and flag emoji. Lazy loading for city data, pre-sorted JSON files, and full TypeScript types for all interfaces.

## Breaking Changes

### What changed

- `IRegion` fields renamed from `Name`/`ShortCode` to `name`/`shortCode` (lowercase)
- Data files moved from `src/*.json` to `data/*.json`

### Why

Standardised all interfaces to use consistent lowercase field names matching the rest of the data model.

### How to update

**Before (v1.x):**

```ts
import { CountryHelper } from 'countrydata.js';
const helper = new CountryHelper();
const regions = helper.getRegionsByCountryShortCode('US');
regions[0].Name; // old
regions[0].ShortCode; // old
```

**After (v2.x):**

```ts
import {
  CountryHelper,
  Country,
  State,
  City,
  Region,
  Timezone,
} from 'countrydata.js';

// Class API (still works)
const helper = new CountryHelper();
const regions = helper.getRegionsByCountryShortCode('US');
regions[0].name; // updated
regions[0].shortCode; // updated

// New module API
const us = Country.getCountryByCode('US');
const states = State.getStatesOfCountry('US');
const cities = City.getCitiesOfState('US', 'CA');
const tzs = Timezone.getTimezonesByCountryCode('US');
```
