import * as fs from 'fs';
import type { ICountry } from '../shared/interface.js';
import { resolveDataPath } from '../shared/helpers.js';
import { CURRENCIES } from '../shared/currencies.js';
import { getStatesOfCountry } from './state.js';
import { getCitiesOfCountry } from './city.js';

// ─── cache ───────────────────────────────────────────────────────────────────

let countryCache: ICountry[] | null = null;
let byShortCode: Map<string, ICountry> | null = null;
let byPhoneCode: Map<string, ICountry> | null = null;
let byCurrencyCode: Map<string, ICountry[]> | null = null;
let byContinent: Map<string, ICountry[]> | null = null;
let byRegionName: Map<string, ICountry[]> | null = null;

function ensureLoaded(): void {
  if (countryCache !== null) return;

  const raw: ICountry[] = JSON.parse(
    fs.readFileSync(resolveDataPath('countries.json'), 'utf8'),
  );

  countryCache = raw.map((c) => ({
    ...c,
    countryFlag: getCountryFlag(c.countryShortCode),
    currencyName: c.currencyCode ? CURRENCIES[c.currencyCode]?.name : undefined,
    currencySymbol: c.currencyCode ? CURRENCIES[c.currencyCode]?.symbol : undefined,
    getStates: () => getStatesOfCountry(c.countryShortCode),
    getCities: () => getCitiesOfCountry(c.countryShortCode),
  }));

  byShortCode = new Map(countryCache.map((c) => [c.countryShortCode, c]));
  byPhoneCode = new Map(countryCache.map((c) => [c.phoneCode, c]));

  byCurrencyCode = new Map();
  byContinent = new Map();
  byRegionName = new Map();

  for (const country of countryCache) {
    if (country.currencyCode) {
      const list = byCurrencyCode.get(country.currencyCode) ?? [];
      list.push(country);
      byCurrencyCode.set(country.currencyCode, list);
    }

    if (country.continent) {
      const key = country.continent.toLowerCase();
      const list = byContinent.get(key) ?? [];
      list.push(country);
      byContinent.set(key, list);
    }

    for (const region of country.regions) {
      const key = region.name.toLowerCase();
      const list = byRegionName.get(key) ?? [];
      list.push(country);
      byRegionName.set(key, list);
    }
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

export function getCountryFlag(countryShortCode: string): string {
  return countryShortCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// ─── module functions ─────────────────────────────────────────────────────────

export function getAllCountries(): ICountry[] {
  ensureLoaded();
  return countryCache!;
}

export function getCountryByCode(isoCode: string): ICountry | undefined {
  if (!isoCode) return undefined;
  ensureLoaded();
  return byShortCode!.get(isoCode);
}

export function getCountryByPhoneCode(phoneCode: string): ICountry | undefined {
  if (!phoneCode) return undefined;
  ensureLoaded();
  return byPhoneCode!.get(phoneCode);
}

export function sortCountries(countries: ICountry[] = getAllCountries()): ICountry[] {
  return [...countries].sort((a, b) => {
    if (a.countryName < b.countryName) return -1;
    if (a.countryName > b.countryName) return 1;
    return 0;
  });
}

// ─── cross-entity filters ──────────────────────────────────────────────────────

export function getCountriesByCurrency(currencyCode: string): ICountry[] {
  if (!currencyCode) return [];
  ensureLoaded();
  return byCurrencyCode!.get(currencyCode.toUpperCase()) ?? [];
}

export function getCountriesByContinent(continent: string): ICountry[] {
  if (!continent) return [];
  ensureLoaded();
  return byContinent!.get(continent.toLowerCase()) ?? [];
}

export function getCountriesByLanguage(language: string): ICountry[] {
  if (!language) return [];
  ensureLoaded();
  const target = language.toLowerCase();
  return getAllCountries().filter((c) =>
    c.languages?.some((l) => l.toLowerCase() === target),
  );
}

// Matches a country's administrative region (e.g. "Ashanti" → Ghana), not a
// continent — see getCountriesByContinent() for that.
export function getCountriesByRegion(regionName: string): ICountry[] {
  if (!regionName) return [];
  ensureLoaded();
  return byRegionName!.get(regionName.toLowerCase()) ?? [];
}

// ─── module export (Country.getAllCountries() style) ──────────────────────────

export default {
  getAllCountries,
  getCountryByCode,
  getCountryByPhoneCode,
  getCountryFlag,
  sortCountries,
  getCountriesByCurrency,
  getCountriesByContinent,
  getCountriesByLanguage,
  getCountriesByRegion,
};
