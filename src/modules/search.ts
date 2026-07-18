import type { ICountry, IState, ICity, ISearchOptions } from '../shared/interface.js';
import { getAllCountries } from './country.js';
import { getAllStates } from './state.js';
import { getAllCities } from './city.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

// Strips diacritics so "brando" matches "Brändö", "sao paulo" matches "São Paulo", etc.
function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Lower rank = better match: exact match, then prefix match, then substring match.
// `normalizedQuery` must already be normalize()'d by the caller.
function matchRank(name: string, normalizedQuery: string): number {
  const normalizedName = normalize(name);
  if (normalizedName === normalizedQuery) return 0;
  if (normalizedName.startsWith(normalizedQuery)) return 1;
  return 2;
}

function searchByName<T>(
  items: T[],
  getName: (item: T) => string,
  query: string,
  options: ISearchOptions = {},
): T[] {
  if (!query) return [];
  const q = normalize(query);

  const results = items
    .filter((item) => normalize(getName(item)).includes(q))
    .sort((a, b) => {
      const nameA = getName(a);
      const nameB = getName(b);
      const rankDiff = matchRank(nameA, q) - matchRank(nameB, q);
      return rankDiff !== 0 ? rankDiff : nameA.localeCompare(nameB);
    });

  return options.limit !== undefined ? results.slice(0, options.limit) : results;
}

// ─── module functions ─────────────────────────────────────────────────────────

export function searchCountries(query: string, options?: ISearchOptions): ICountry[] {
  return searchByName(getAllCountries(), (c) => c.countryName, query, options);
}

export function searchStates(query: string, options?: ISearchOptions): IState[] {
  return searchByName(getAllStates(), (s) => s.name, query, options);
}

export function searchCities(query: string, options?: ISearchOptions): ICity[] {
  return searchByName(getAllCities(), (c) => c.name, query, options);
}

// ─── module export (Search.searchCountries() style) ───────────────────────────

export default {
  searchCountries,
  searchStates,
  searchCities,
};
