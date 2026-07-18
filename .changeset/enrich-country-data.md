---
"countrydata.js": minor
---

Add capital, population, area, continent, official/native name, demonym, languages, borders, TLDs, UN membership/independence flags, and currency name/symbol to every country record. Sourced from Wikidata (CC0) and a hand-maintained ISO 4217 currency table via a new one-time build script (`npm run build:data:fetch`) — no runtime dependency added, the library stays fully offline.
