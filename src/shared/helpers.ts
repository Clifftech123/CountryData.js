import * as path from 'path';
import type { ICity } from './interface.js';

export function resolveDataPath(fileName: string): string {
  return path.join(__dirname, '..', 'data', fileName);
}

export function compareByName<T extends { name: string }>(a: T, b: T): number {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

export function convertCityArrays(arrays: string[][]): ICity[] {
  return arrays.map((arr) => ({
    name: arr[0] ?? '',
    countryCode: arr[1] ?? '',
    stateCode: arr[2] ?? '',
    latitude: arr[3] ?? null,
    longitude: arr[4] ?? null,
  }));
}
