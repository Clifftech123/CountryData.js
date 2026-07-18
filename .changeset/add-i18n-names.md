---
"countrydata.js": minor
---

Add translated country names: `Country.getCountryName(code, locale?)` falls back to the English `countryName` when the locale is omitted or has no translation. Adds a new optional `translations?: Record<string, string>` field to `ICountry` covering `ar`, `zh`, `fr`, `ru`, `es`, `pt`, `de` (99-100% coverage across all 250 countries), sourced from Wikidata (CC0) via `scripts/fetch-wikidata.cjs`. Also available as a `CountryHelper` instance method.
