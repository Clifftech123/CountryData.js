---
"countrydata.js": minor
---

Add `Search.searchCountries()`, `Search.searchStates()`, and `Search.searchCities()` — case-insensitive and diacritic-insensitive substring search (e.g. `"sao paulo"` matches `"São Paulo"`), with exact/prefix matches ranked first. Accepts an optional `{ limit }` to cap result count. Also available as `CountryHelper` instance methods. No new dependency.
