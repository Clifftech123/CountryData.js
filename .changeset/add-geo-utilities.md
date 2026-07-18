---
"countrydata.js": minor
---

Add geo distance utilities: `Geo.haversineDistanceKm(lat1, lon1, lat2, lon2)`, `Geo.getNearestCountry(lat, lon)`, and `Geo.getNearestCity(lat, lon, options?)` (accepts `{ countryCode, stateCode }` to scope the search instead of scanning all ~148k cities). Also available as `CountryHelper` instance methods. No new dependency.
