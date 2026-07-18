---
"countrydata.js": minor
---

Add `City.getCitiesPaginated({ countryCode?, stateCode?, page?, pageSize? })` returning `{ items, page, pageSize, total, hasMore }` — a paged slice for browser/memory-constrained environments instead of loading all ~148k cities at once. Pass `countryCode`/`stateCode` to scope before paginating. Also available as a `CountryHelper` instance method.
