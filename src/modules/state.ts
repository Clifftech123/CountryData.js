import * as fs from 'fs';
import type { IState } from '../shared/interface.js';
import { resolveDataPath, compareByName } from '../shared/helpers.js';
import { getCitiesOfState } from './city.js';

// ─── cache ───────────────────────────────────────────────────────────────────

let stateCache: IState[] | null = null;
let byCountryCode: Map<string, IState[]> | null = null;
let byCompositeKey: Map<string, IState> | null = null;

function ensureLoaded(): void {
  if (stateCache !== null) return;

  const raw: IState[] = JSON.parse(
    fs.readFileSync(resolveDataPath('states.json'), 'utf8'),
  );

  stateCache = raw.map((s) => ({
    ...s,
    getCities: () => getCitiesOfState(s.countryCode, s.isoCode),
  }));

  byCountryCode = new Map();
  byCompositeKey = new Map();

  for (const state of stateCache) {
    byCompositeKey.set(`${state.countryCode}:${state.isoCode}`, state);
    const list = byCountryCode.get(state.countryCode) ?? [];
    list.push(state);
    byCountryCode.set(state.countryCode, list);
  }
}

// ─── module functions ─────────────────────────────────────────────────────────

export function getAllStates(): IState[] {
  ensureLoaded();
  return stateCache!;
}

export function getStatesOfCountry(countryCode: string): IState[] {
  if (!countryCode) return [];
  ensureLoaded();
  return [...(byCountryCode!.get(countryCode) ?? [])];
}

export function getStateByCodeAndCountry(
  stateCode: string,
  countryCode: string,
): IState | undefined {
  if (!stateCode || !countryCode) return undefined;
  ensureLoaded();
  return byCompositeKey!.get(`${countryCode}:${stateCode}`);
}

export function sortStates(states: IState[] = getAllStates()): IState[] {
  return [...states].sort(compareByName);
}

// ─── module export (State.getStatesOfCountry() style) ────────────────────────

export default {
  getAllStates,
  getStatesOfCountry,
  getStateByCodeAndCountry,
  sortStates,
};
