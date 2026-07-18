---
"countrydata.js": minor
---

Add cross-entity country filters: `getCountriesByCurrency(code)`, `getCountriesByContinent(name)`, `getCountriesByLanguage(name)`, and `getCountriesByRegion(name)` (matches a country's administrative region, e.g. `"Bavaria"` → Germany). All case-insensitive, all O(1)/O(n) lookups backed by Maps built at load time. Also available as `CountryHelper` instance methods.
