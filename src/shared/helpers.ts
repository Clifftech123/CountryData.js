import * as path from 'path';
import { fileURLToPath } from 'url';
import type { ICity } from './interface.js';

// tsup's `shims: true` polyfills __dirname for both its CJS and ESM build outputs, so this
// only ever falls through to the import.meta.url branch when running raw TS source directly
// under a native ESM loader (e.g. `node --loader ts-node/esm`), which has no such shim.
function moduleDir(): string {
  if (typeof __dirname !== 'undefined') return __dirname;
  return path.dirname(fileURLToPath(import.meta.url));
}

export function resolveDataPath(fileName: string): string {
  return path.join(moduleDir(), '..', 'data', fileName);
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
