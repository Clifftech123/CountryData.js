import type { ICountry, ICity, INearestCityOptions } from '../shared/interface.js';
import { getAllCountries } from './country.js';
import { getAllCities, getCitiesOfCountry, getCitiesOfState } from './city.js';

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function parseCoordinate(value: string | null | undefined): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

// ─── module functions ─────────────────────────────────────────────────────────

export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestCountry(latitude: number, longitude: number): ICountry | undefined {
  let nearest: ICountry | undefined;
  let nearestDistance = Infinity;

  for (const country of getAllCountries()) {
    const lat = parseCoordinate(country.latitude);
    const lon = parseCoordinate(country.longitude);
    if (lat === undefined || lon === undefined) continue;

    const distance = haversineDistanceKm(latitude, longitude, lat, lon);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = country;
    }
  }

  return nearest;
}

// Scans ~148k cities if no countryCode/stateCode is given — pass one to bound
// the search to an already-indexed subset instead (see city.ts's Maps).
export function getNearestCity(
  latitude: number,
  longitude: number,
  options: INearestCityOptions = {},
): ICity | undefined {
  const { countryCode, stateCode } = options;

  const candidates =
    countryCode && stateCode
      ? getCitiesOfState(countryCode, stateCode)
      : countryCode
        ? getCitiesOfCountry(countryCode)
        : getAllCities();

  let nearest: ICity | undefined;
  let nearestDistance = Infinity;

  for (const city of candidates) {
    const lat = parseCoordinate(city.latitude);
    const lon = parseCoordinate(city.longitude);
    if (lat === undefined || lon === undefined) continue;

    const distance = haversineDistanceKm(latitude, longitude, lat, lon);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}

// ─── module export (Geo.getNearestCity() style) ────────────────────────────────

export default {
  haversineDistanceKm,
  getNearestCountry,
  getNearestCity,
};
