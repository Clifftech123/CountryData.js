/**
 * countrydata-export — dumps the bundled dataset as CSV or SQL for non-JS consumers.
 *
 *   countrydata-export --entity countries --format csv --out countries.csv
 *   countrydata-export --entity cities --format sql > cities.sql
 *
 * Nested fields (timezones, regions) don't fit a flat row and are dropped from
 * the export; array fields (languages, borders, tld) are joined with "|".
 *
 * This module only exports pure functions — nothing runs on import. The actual
 * executable entry point (which calls main()) is src/bin.ts.
 */

import * as fs from 'fs';
import { getAllCountries } from './modules/country.js';
import { getAllStates } from './modules/state.js';
import { getAllCities } from './modules/city.js';

type Entity = 'countries' | 'states' | 'cities';
type Format = 'csv' | 'sql';
type Row = Record<string, string | number | boolean | undefined>;

const USAGE = `Usage: countrydata-export --entity <countries|states|cities> [--format csv|sql] [--out <path>]

  --entity   Which dataset to export (required)
  --format   "csv" (default) or "sql"
  --out      Output file path (defaults to stdout)
  --help     Show this message
`;

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      i++;
    } else {
      args[key] = 'true';
    }
  }
  return args;
}

function csvEscape(value: unknown): string {
  const str = value === undefined || value === null ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]!);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','));
  }
  return lines.join('\n') + '\n';
}

function sqlEscape(value: unknown): string {
  if (value === undefined || value === null) return 'NULL';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toSql(tableName: string, rows: Row[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]!);
  const createTable = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n${headers
    .map((h) => `  \`${h}\` TEXT`)
    .join(',\n')}\n);\n\n`;
  const columns = headers.map((h) => `\`${h}\``).join(', ');
  const inserts = rows
    .map((row) => `INSERT INTO \`${tableName}\` (${columns}) VALUES (${headers
      .map((h) => sqlEscape(row[h]))
      .join(', ')});`)
    .join('\n');
  return createTable + inserts + '\n';
}

function flattenCountry(c: ReturnType<typeof getAllCountries>[number]): Row {
  return {
    countryName: c.countryName,
    countryShortCode: c.countryShortCode,
    phoneCode: c.phoneCode,
    countryFlag: c.countryFlag,
    currencyCode: c.currencyCode,
    currencyName: c.currencyName,
    currencySymbol: c.currencySymbol,
    latitude: c.latitude,
    longitude: c.longitude,
    capital: c.capital,
    population: c.population,
    area: c.area,
    continent: c.continent,
    officialName: c.officialName,
    nativeName: c.nativeName,
    demonym: c.demonym,
    languages: c.languages?.join('|'),
    borders: c.borders?.join('|'),
    tld: c.tld?.join('|'),
    unMember: c.unMember,
    independent: c.independent,
  };
}

function flattenState(s: ReturnType<typeof getAllStates>[number]): Row {
  return {
    name: s.name,
    isoCode: s.isoCode,
    countryCode: s.countryCode,
    latitude: s.latitude ?? undefined,
    longitude: s.longitude ?? undefined,
  };
}

function flattenCity(c: ReturnType<typeof getAllCities>[number]): Row {
  return {
    name: c.name,
    countryCode: c.countryCode,
    stateCode: c.stateCode,
    latitude: c.latitude ?? undefined,
    longitude: c.longitude ?? undefined,
  };
}

function getRows(entity: Entity): Row[] {
  switch (entity) {
    case 'countries':
      return getAllCountries().map(flattenCountry);
    case 'states':
      return getAllStates().map(flattenState);
    case 'cities':
      return getAllCities().map(flattenCity);
  }
}

export function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    process.stdout.write(USAGE);
    return;
  }

  const entity = args.entity as Entity | undefined;
  if (!entity || !['countries', 'states', 'cities'].includes(entity)) {
    process.stderr.write('Error: --entity must be one of countries, states, cities\n\n');
    process.stderr.write(USAGE);
    process.exitCode = 1;
    return;
  }

  const format = (args.format as Format | undefined) ?? 'csv';
  if (format !== 'csv' && format !== 'sql') {
    process.stderr.write('Error: --format must be "csv" or "sql"\n\n');
    process.stderr.write(USAGE);
    process.exitCode = 1;
    return;
  }

  const rows = getRows(entity);
  const output = format === 'csv' ? toCsv(rows) : toSql(entity, rows);

  if (args.out) {
    fs.writeFileSync(args.out, output, 'utf8');
    process.stderr.write(`Wrote ${rows.length} rows to ${args.out}\n`);
  } else {
    process.stdout.write(output);
  }
}

// ─── exported for testing ──────────────────────────────────────────────────────

export { parseArgs, csvEscape, toCsv, sqlEscape, toSql, flattenCountry, flattenState, flattenCity };
