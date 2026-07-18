/**
 * fetch-wikidata.cjs
 *
 * One-time, dev-time data enrichment script — NOT part of the published package and never
 * imported by src/. Pulls capital, population, area, continent, official/native name,
 * demonym, languages, borders, TLDs, and UN-membership/independence flags from Wikidata
 * (query.wikidata.org) — CC0 licensed, free, no API key — and merges them into the existing
 * data/countries.json records in place. currencyName/currencySymbol are NOT stored here —
 * they're computed at load time in src/modules/country.ts from the static ISO 4217 table in
 * src/shared/currencies.ts, keyed off the existing currencyCode field.
 *
 * Run manually when refreshing country data: node scripts/fetch-wikidata.cjs
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const COUNTRIES_PATH = path.join(DATA_DIR, 'countries.json');
const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const USER_AGENT = 'CountryDataJS-Build/1.0 (opokuisaiahclifford123@gmail.com)';
const BATCH_SIZE = 40;
const DELAY_MS = 1200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function runQuery(query, attempt = 1) {
  const res = await fetch(SPARQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json',
      'User-Agent': USER_AGENT,
    },
    body: new URLSearchParams({ query }).toString(),
  });

  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt <= 3) {
      const wait = DELAY_MS * attempt * 2;
      console.warn(`  query failed (${res.status}), retrying in ${wait}ms...`);
      await sleep(wait);
      return runQuery(query, attempt + 1);
    }
    throw new Error(`SPARQL query failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return json.results.bindings;
}

function valuesClause(codes) {
  return codes.map((c) => `"${c}"`).join(' ');
}

function mainQuery(codes) {
  return `
SELECT ?iso2
       (SAMPLE(?capitalLabel) AS ?capital)
       (SAMPLE(?area) AS ?area)
       (GROUP_CONCAT(DISTINCT ?continentLabel; separator="|") AS ?continents)
       (SAMPLE(?official) AS ?officialName)
       (SAMPLE(?nativeStr) AS ?nativeName)
       (SAMPLE(?demonym) AS ?demonym)
       (GROUP_CONCAT(DISTINCT ?langLabel; separator="|") AS ?languages)
       (GROUP_CONCAT(DISTINCT ?tldLabel; separator="|") AS ?tlds)
       (GROUP_CONCAT(DISTINCT ?neighborIso2; separator="|") AS ?borders)
       (SAMPLE(?isUN) AS ?unMember)
       (SAMPLE(?isSovereign) AS ?independent)
WHERE {
  VALUES ?iso2 { ${valuesClause(codes)} }
  ?country wdt:P297 ?iso2.
  OPTIONAL { ?country wdt:P36 ?capital. ?capital rdfs:label ?capitalLabel. FILTER(LANG(?capitalLabel) = "en") }
  OPTIONAL { ?country wdt:P2046 ?area. }
  OPTIONAL { ?country wdt:P30 ?continent. ?continent rdfs:label ?continentLabel. FILTER(LANG(?continentLabel) = "en") }
  OPTIONAL { ?country wdt:P1448 ?officialMLT. FILTER(LANG(?officialMLT) = "en") BIND(STR(?officialMLT) AS ?official) }
  OPTIONAL { ?country wdt:P1705 ?nativeMLT. BIND(STR(?nativeMLT) AS ?nativeStr) }
  OPTIONAL { ?country wdt:P1549 ?demonymMLT. FILTER(LANG(?demonymMLT) = "en") BIND(STR(?demonymMLT) AS ?demonym) }
  OPTIONAL { ?country wdt:P37 ?lang. ?lang rdfs:label ?langLabel. FILTER(LANG(?langLabel) = "en") }
  OPTIONAL { ?country wdt:P78 ?tld. ?tld rdfs:label ?tldLabel. FILTER(LANG(?tldLabel) = "en") }
  OPTIONAL { ?country wdt:P47 ?neighbor. ?neighbor wdt:P297 ?neighborIso2. }
  OPTIONAL { ?country wdt:P463 wd:Q1065. BIND(true AS ?isUN) }
  OPTIONAL { ?country wdt:P31 wd:Q3624078. BIND(true AS ?isSovereign) }
}
GROUP BY ?iso2
`;
}

function populationQuery(codes) {
  return `
SELECT ?iso2
       (GROUP_CONCAT(DISTINCT CONCAT(STR(?popDate), "::", STR(?population)); separator="|") AS ?popSeries)
WHERE {
  VALUES ?iso2 { ${valuesClause(codes)} }
  ?country wdt:P297 ?iso2.
  OPTIONAL {
    ?country p:P1082 ?popStatement.
    ?popStatement ps:P1082 ?population.
    OPTIONAL { ?popStatement pq:P585 ?popDate. }
  }
}
GROUP BY ?iso2
`;
}

function latestPopulation(popSeries) {
  if (!popSeries) return undefined;
  let best = null;
  for (const entry of popSeries.split('|')) {
    const [dateStr, valueStr] = entry.split('::');
    if (!valueStr) continue;
    const value = parseInt(valueStr, 10);
    if (Number.isNaN(value)) continue;
    const date = dateStr ? Date.parse(dateStr) : 0;
    if (!best || date > best.date) best = { date, value };
  }
  return best ? best.value : undefined;
}

function splitList(value) {
  if (!value) return undefined;
  const items = [...new Set(value.split('|').filter(Boolean))];
  return items.length > 0 ? items : undefined;
}

async function fetchBatch(codes) {
  const [mainRows, popRows] = await Promise.all([
    runQuery(mainQuery(codes)),
    (async () => {
      await sleep(DELAY_MS);
      return runQuery(populationQuery(codes));
    })(),
  ]);

  const byIso2 = new Map();

  for (const row of mainRows) {
    const iso2 = row.iso2.value;
    byIso2.set(iso2, {
      capital: row.capital?.value,
      area: row.area ? parseFloat(row.area.value) : undefined,
      continent: row.continents?.value ? row.continents.value.split('|')[0] : undefined,
      officialName: row.officialName?.value,
      nativeName: row.nativeName?.value,
      demonym: row.demonym?.value,
      languages: splitList(row.languages?.value),
      tld: splitList(row.tlds?.value),
      borders: splitList(row.borders?.value),
      unMember: row.unMember?.value === 'true',
      independent: row.independent?.value === 'true',
    });
  }

  for (const row of popRows) {
    const iso2 = row.iso2.value;
    const population = latestPopulation(row.popSeries?.value);
    if (population === undefined) continue;
    const entry = byIso2.get(iso2) ?? {};
    entry.population = population;
    byIso2.set(iso2, entry);
  }

  return byIso2;
}

async function main() {
  const countries = JSON.parse(fs.readFileSync(COUNTRIES_PATH, 'utf8'));
  const codes = countries.map((c) => c.countryShortCode);
  const batches = chunk(codes, BATCH_SIZE);

  const enrichment = new Map();
  const coverage = {
    capital: 0,
    population: 0,
    area: 0,
    continent: 0,
    officialName: 0,
    nativeName: 0,
    demonym: 0,
    languages: 0,
    tld: 0,
    borders: 0,
    unMember: 0,
    independent: 0,
  };

  for (let i = 0; i < batches.length; i++) {
    console.log(`Batch ${i + 1}/${batches.length} (${batches[i].length} countries)...`);
    const result = await fetchBatch(batches[i]);
    for (const [iso2, data] of result) enrichment.set(iso2, data);
    if (i < batches.length - 1) await sleep(DELAY_MS);
  }

  let merged = 0;
  for (const country of countries) {
    const data = enrichment.get(country.countryShortCode);

    if (data) {
      if (data.capital !== undefined) { country.capital = data.capital; coverage.capital++; }
      if (data.population !== undefined) { country.population = data.population; coverage.population++; }
      if (data.area !== undefined) { country.area = data.area; coverage.area++; }
      if (data.continent !== undefined) { country.continent = data.continent; coverage.continent++; }
      if (data.officialName !== undefined) { country.officialName = data.officialName; coverage.officialName++; }
      if (data.nativeName !== undefined) { country.nativeName = data.nativeName; coverage.nativeName++; }
      if (data.demonym !== undefined) { country.demonym = data.demonym; coverage.demonym++; }
      if (data.languages !== undefined) { country.languages = data.languages; coverage.languages++; }
      if (data.tld !== undefined) { country.tld = data.tld; coverage.tld++; }
      if (data.borders !== undefined) { country.borders = data.borders; coverage.borders++; }
      country.unMember = data.unMember ?? false;
      country.independent = data.independent ?? false;
      coverage.unMember += country.unMember ? 1 : 0;
      coverage.independent += country.independent ? 1 : 0;
      merged++;
    }
  }

  fs.writeFileSync(COUNTRIES_PATH, JSON.stringify(countries, null, 2) + '\n', 'utf8');

  console.log(`\nMerged Wikidata fields into ${merged}/${countries.length} countries.`);
  console.log('Field coverage (of 250 total):');
  for (const [field, count] of Object.entries(coverage)) {
    console.log(`  ${field.padEnd(14)} ${count} (${((count / countries.length) * 100).toFixed(0)}%)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
