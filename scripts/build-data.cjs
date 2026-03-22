/**
 * build-data.cjs
 *
 * Pre-sorts and minifies the data JSON files for distribution.
 * Run before publishing: node scripts/build-data.cjs
 *
 *   1. Pre-sorts all data so runtime queries are faster
 *   2. Minifies JSON (removes whitespace) — cuts total size by ~44%
 *   3. Optionally writes .gz compressed versions (set env GZ=true)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const DATA_DIR = path.join(__dirname, '..', 'data');

function read(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
}

function write(file, data) {
  const minified = JSON.stringify(data);
  fs.writeFileSync(path.join(DATA_DIR, file), minified, 'utf8');
  return minified.length;
}

function sizeKB(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

// ─── countries ───────────────────────────────────────────────────────────────

const countries = read('countries.json');

// Sort alphabetically by countryName
countries.sort((a, b) => a.countryName.localeCompare(b.countryName));

const cSize = write('countries.json', countries);
console.log(`countries.json  → ${sizeKB(cSize)}`);

// ─── states ──────────────────────────────────────────────────────────────────

const states = read('states.json');

// Sort by countryCode, then by state name (matches what getStatesOfCountry returns)
states.sort((a, b) => {
  if (a.countryCode < b.countryCode) return -1;
  if (a.countryCode > b.countryCode) return 1;
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
});

const sSize = write('states.json', states);
console.log(`states.json     → ${sizeKB(sSize)}`);

// ─── cities ───────────────────────────────────────────────────────────────────
// Cities are stored as array-of-arrays: [name, countryCode, stateCode, lat, lng]
// Sort by countryCode → stateCode → name (matches sortCities output)

const cityArrays = read('cities.json');

cityArrays.sort((a, b) => {
  const ak = `${a[1]}-${a[2]}`;
  const bk = `${b[1]}-${b[2]}`;
  if (ak < bk) return -1;
  if (ak > bk) return 1;
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
});

const citySize = write('cities.json', cityArrays);
console.log(`cities.json     → ${sizeKB(citySize)}`);

// ─── optional gzip ────────────────────────────────────────────────────────────

if (process.env.GZ === 'true') {
  const files = ['countries.json', 'states.json', 'cities.json'];
  for (const file of files) {
    const content = fs.readFileSync(path.join(DATA_DIR, file));
    const compressed = zlib.deflateSync(content);
    const gzPath = path.join(DATA_DIR, file.replace('.json', '.gz'));
    fs.writeFileSync(gzPath, compressed);
    console.log(`${file}.gz → ${sizeKB(compressed.length)}`);
  }
}

const total = cSize + sSize + citySize;
console.log(`\nTotal: ${sizeKB(total)}`);
