import type { ITimezone, ICountry } from '../shared/interface.js';
import { getAllCountries } from './country.js';

// ─── cache ────────────────────────────────────────────────────────────────────

let byZoneName: Map<string, ICountry[]> | null = null;

function ensureLoaded(): void {
  if (byZoneName !== null) return;
  byZoneName = new Map();
  for (const country of getAllCountries()) {
    for (const tz of country.timezones ?? []) {
      const list = byZoneName.get(tz.zoneName) ?? [];
      list.push(country);
      byZoneName.set(tz.zoneName, list);
    }
  }
}

// ─── module functions ─────────────────────────────────────────────────────────

export function getTimezonesByCountryCode(countryCode: string): ITimezone[] {
  if (!countryCode) return [];
  const country = getAllCountries().find((c) => c.countryShortCode === countryCode);
  return country?.timezones ?? [];
}

export function getCountriesByTimezone(zoneName: string): ICountry[] {
  if (!zoneName) return [];
  ensureLoaded();
  return byZoneName!.get(zoneName) ?? [];
}

export function getAllTimezones(): ITimezone[] {
  const seen = new Set<string>();
  const result: ITimezone[] = [];
  for (const country of getAllCountries()) {
    for (const tz of country.timezones ?? []) {
      if (!seen.has(tz.zoneName)) {
        seen.add(tz.zoneName);
        result.push(tz);
      }
    }
  }
  return result;
}

// ─── module export (Timezone.getTimezonesByCountryCode() style) ───────────────

export default {
  getTimezonesByCountryCode,
  getCountriesByTimezone,
  getAllTimezones,
};
