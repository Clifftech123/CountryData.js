import type { IRegion } from '../shared/interface.js';
import { getCountryByCode } from './country.js';
import { compareByName } from '../shared/helpers.js';

// ─── module functions ─────────────────────────────────────────────────────────

export function getRegionsByCountryCode(countryCode: string): IRegion[] {
  if (!countryCode) return [];
  return getCountryByCode(countryCode)?.regions ?? [];
}

export function getRegionByShortCode(
  countryCode: string,
  shortCode: string,
): IRegion | undefined {
  if (!countryCode || !shortCode) return undefined;
  return getRegionsByCountryCode(countryCode).find(
    (r) => r.shortCode === shortCode,
  );
}

export function sortRegions(regions: IRegion[]): IRegion[] {
  return [...regions].sort(compareByName);
}

// ─── module export (Region.getRegionsByCountryCode() style) ──────────────────

export default {
  getRegionsByCountryCode,
  getRegionByShortCode,
  sortRegions,
};
