import * as fs from 'fs';
import type { ICity, ICityPaginationOptions, IPaginatedCities } from '../shared/interface.js';
import { resolveDataPath, convertCityArrays } from '../shared/helpers.js';

// ─── cache ───────────────────────────────────────────────────────────────────

let cityCache: ICity[] | null = null;
let byCountryCode: Map<string, ICity[]> | null = null;
let byStateKey: Map<string, ICity[]> | null = null;

function ensureLoaded(): void {
  if (cityCache !== null) return;
  try {
    const arrays: string[][] = JSON.parse(
      fs.readFileSync(resolveDataPath('cities.json'), 'utf8'),
    );
    cityCache = convertCityArrays(arrays);

    byCountryCode = new Map();
    byStateKey = new Map();

    for (const city of cityCache) {
      const cc = byCountryCode.get(city.countryCode) ?? [];
      cc.push(city);
      byCountryCode.set(city.countryCode, cc);

      const sk = `${city.countryCode}:${city.stateCode}`;
      const sc = byStateKey.get(sk) ?? [];
      sc.push(city);
      byStateKey.set(sk, sc);
    }
  } catch (err) {
    console.error('Failed to load city data:', err);
    cityCache = [];
    byCountryCode = new Map();
    byStateKey = new Map();
  }
}

// ─── module functions ─────────────────────────────────────────────────────────

export function getAllCities(): ICity[] {
  ensureLoaded();
  return cityCache!;
}

export function getCitiesOfCountry(countryCode: string): ICity[] {
  if (!countryCode) return [];
  ensureLoaded();
  return byCountryCode!.get(countryCode) ?? [];
}

export function getCitiesOfState(countryCode: string, stateCode: string): ICity[] {
  if (!countryCode || !stateCode) return [];
  ensureLoaded();
  return byStateKey!.get(`${countryCode}:${stateCode}`) ?? [];
}

export function sortCities(cities: ICity[] = getAllCities()): ICity[] {
  return [...cities].sort((a, b) => {
    const ak = `${a.countryCode}-${a.stateCode}`;
    const bk = `${b.countryCode}-${b.stateCode}`;
    if (ak < bk) return -1;
    if (ak > bk) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

const DEFAULT_PAGE_SIZE = 50;

// Slices an already-indexed array (byCountryCode/byStateKey) rather than the
// full ~148k-city cache whenever countryCode/stateCode narrows the source.
export function getCitiesPaginated(options: ICityPaginationOptions = {}): IPaginatedCities {
  const { countryCode, stateCode, page = 1, pageSize = DEFAULT_PAGE_SIZE } = options;

  const source =
    countryCode && stateCode
      ? getCitiesOfState(countryCode, stateCode)
      : countryCode
        ? getCitiesOfCountry(countryCode)
        : getAllCities();

  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const items = source.slice(start, start + pageSize);

  return {
    items,
    page: safePage,
    pageSize,
    total: source.length,
    hasMore: start + items.length < source.length,
  };
}

// ─── module export (City.getCitiesOfState() style) ───────────────────────────

export default {
  getAllCities,
  getCitiesOfCountry,
  getCitiesOfState,
  sortCities,
  getCitiesPaginated,
};
