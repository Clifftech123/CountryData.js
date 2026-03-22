import * as fs from 'fs';
import type { ICountry } from '../shared/interface.js';
import { resolveDataPath } from '../shared/helpers.js';
import { getStatesOfCountry } from './state.js';
import { getCitiesOfCountry } from './city.js';

// ─── cache ───────────────────────────────────────────────────────────────────

let countryCache: ICountry[] | null = null;
let byShortCode: Map<string, ICountry> | null = null;
let byPhoneCode: Map<string, ICountry> | null = null;

function ensureLoaded(): void {
  if (countryCache !== null) return;

  const raw: ICountry[] = JSON.parse(
    fs.readFileSync(resolveDataPath('countries.json'), 'utf8'),
  );

  countryCache = raw.map((c) => ({
    ...c,
    countryFlag: getCountryFlag(c.countryShortCode),
    getStates: () => getStatesOfCountry(c.countryShortCode),
    getCities: () => getCitiesOfCountry(c.countryShortCode),
  }));

  byShortCode = new Map(countryCache.map((c) => [c.countryShortCode, c]));
  byPhoneCode = new Map(countryCache.map((c) => [c.phoneCode, c]));
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

// ─── module export (Country.getAllCountries() style) ──────────────────────────

export default {
  getAllCountries,
  getCountryByCode,
  getCountryByPhoneCode,
  getCountryFlag,
  sortCountries,
};
