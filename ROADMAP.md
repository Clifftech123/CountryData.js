# Roadmap: missing features

Audit of this library against comparable libraries (`country-state-city`, `world-countries`,
`countries-states-cities-database`) and a phased plan to close the gaps, tracked here so
progress persists across sessions/branches. Work happens on `feature/data-roadmap`, one
commit (and one changeset) per phase, checked off below as each phase merges.

## Current state (for reference)

- 250 countries: name, ISO code, phone code, flag emoji, currency **code**, lat/long,
  timezones, regions
- 4,963 states/provinces: name, ISO code, country code, lat/long
- ~148,000 cities (lazy-loaded): name, country code, state code, lat/long
- Sync, Map-indexed O(1) lookups by code; ESM + CJS; full TypeScript types

## Missing data fields

| Field | Notes | Possible source |
|---|---|---|
| Capital city | Not present on country object | REST Countries API (`capital`), or `mledoze/countries` |
| Population | — | REST Countries API (`population`), World Bank Open Data API |
| Area (km²) | — | REST Countries API (`area`), `mledoze/countries` |
| Currency name / symbol | Only currency **code** exists (e.g. `USD`, not `$` / "US Dollar") | REST Countries API (`currencies`), or `currency-codes` npm package |
| Native/official name | — | REST Countries API (`name.nativeName`, `name.official`) |
| Demonym (nationality) | — | REST Countries API (`demonyms`) |
| Continent (clean enum) | Only region/subregion strings exist | REST Countries API (`continents`), `mledoze/countries` |
| Languages spoken | — | REST Countries API (`languages`) |
| Bordering countries | — | REST Countries API (`borders`) |
| TLD (`.us`, `.de`) | — | REST Countries API (`tld`) |
| UN membership / independence flag | — | REST Countries API (`unMember`, `independent`) |

> Any external call happens only **once**, at build/dev time, inside a data-generation script
> to produce the static JSON shipped in the package — end users of this library never call
> any API, so it stays fully offline at runtime.

## Data source options & licensing (checked)

| Source | Good for | License | Caveat |
|---|---|---|---|
| **Wikidata (SPARQL query service)** | Capital, population, area, TLD, continent, UN membership, independence, borders, languages, demonyms, native/official name | **CC0** (public domain) — no attribution, no copyleft, no key, no cost | Free-text/query complexity; some fields sparse for micro-states, need fallback handling |
| ISO 4217 standard (hardcoded table) | Currency name + symbol | Not copyrightable (a standard's factual code list) | Small (~180 rows), maintained by hand, no fetch needed |
| REST Countries API (v5) | Same fields as Wikidata, simpler REST shape | No copyleft found | **Rejected** — no free tier as of 2026; cheapest plan is $15/mo, not worth it when Wikidata covers the same ground for free |
| `dr5hn/countries-states-cities-database` | Broadest per-city/state coverage (postcodes, native names, 19 languages), also boundary polygons | **ODbL v1.0** | Share-alike: redistributing as part of an MIT package may obligate keeping that data under ODbL + attribution |
| `mledoze/countries` | Capital, area, currencies, languages, borders, tld, demonyms, native name, unMember, independent (no population, no continent enum) | **ODbL v1.0** | Same share-alike issue as `dr5hn` — rejected for the same reason |
| `harpreetkhalsagtbit/country-state-city` (source of the `country-state-city` npm package) | — | **GPL-3.0** | Its data schema is functionally identical to this library's current dataset — worth double-checking provenance/licensing of our existing data, but do **not** pull *additional* fields from here: GPL-3.0 is copyleft and would conflict with MIT distribution |

**Decision:** Wikidata (CC0) + a hand-maintained ISO 4217 currency table for the new
country-level fields, fetched via a one-time build script. No payment, no copyleft risk —
both `dr5hn` and `mledoze` are ODbL (share-alike) and REST Countries dropped its free tier.

## Missing functionality

- **Search** — no fuzzy/partial name matching anywhere; all lookups are exact-code-only.
- **Cross-entity filters** — by currency, region, language, continent.
- **Validation helpers** — `isValidCountryCode`, `isValidPhoneCode`, `isValidStateCode`.
- **Geo utilities** — Haversine distance, nearest city/country to a coordinate.
- **Pagination/streaming** for the 148k-city dataset — currently all-or-nothing lazy load.

## Missing DX / tooling

- **i18n** — country/state names are English-only.
- **Browser/CDN build** — slimmer bundle with cities on-demand.
- **CLI / data export** — CSV/SQL dump for non-JS consumers.

## Phase plan

- [ ] **Phase 1** — Capital, population, area, currency name/symbol, native/official name,
      demonym, continent, languages, borders, TLD, unMember/independent. New optional
      `ICountry` fields + `scripts/fetch-wikidata.cjs` build-time fetch (SPARQL query against
      `query.wikidata.org`, CC0, no key needed) merged with a hardcoded ISO 4217 currency
      name/symbol table.
- [x] **Phase 2** — `searchCountries()` / `searchStates()` / `searchCities()` fuzzy search.
- [x] **Phase 3** — Cross-entity filters: `getCountriesByCurrency`, `getCountriesByRegion`,
      `getCountriesByLanguage`, `getCountriesByContinent`. Depends on Phase 1.
- [x] **Phase 4** — Validation helpers: `isValidCountryCode`, `isValidPhoneCode`,
      `isValidStateCode`.
- [x] **Phase 5** — Geo utilities: Haversine distance, `getNearestCountry`, `getNearestCity`.
- [ ] **Phase 6** — Pagination for the cities dataset (`getCitiesPaginated`).
- [ ] **Phase 7** (backlog, lower priority) — i18n locale names, slimmer browser/CDN bundle,
      CLI data export.

Phases 2, 4, 5, 6 don't depend on Phase 1 or each other and can ship in any order.
