const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
// Compile only the pure domain modules in memory; no browser or storage mocks.
function load(file, dependencies = {}) {
  const code = ts.transpileModule(
    fs.readFileSync(path.join(__dirname, '../lib', file), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const entry = { exports: {} };
  new Function('module', 'exports', 'require', code)(
    entry,
    entry.exports,
    (name) => {
      if (!(name in dependencies))
        throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  );
  return entry.exports;
}
const data = load('catharsa-data.ts');
const model = load('catharsa-model.ts', { './catharsa-data': data });
const now = new Date(2026, 8, 6, 23, 55);

test('seven dates remain consecutive across month and year boundaries', () => {
  assert.deepEqual(model.weekDates(new Date(2026, 0, 3, 1)), [
    '2025-12-28',
    '2025-12-29',
    '2025-12-30',
    '2025-12-31',
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
  ]);
});
test('updating a day replaces the sample and keeps exactly one daily record', () => {
  const initial = model.fallbackRecords(now);
  const saved = model.saveDaily(initial, 2, '  A short journal.  ', now);
  const revised = model.saveDaily(saved, 4, 'Revised.', now);
  assert.equal(initial[6].score, 4);
  assert.equal(saved[6].journal, 'A short journal.');
  assert.equal(saved[6].demo, false);
  assert.equal(revised.length, 7);
  assert.equal(revised.filter((r) => r.date === '2026-09-06').length, 1);
  assert.equal(revised[6].score, 4);
});
test('new days do not invent mood scores for missing dates', () => {
  const records = [{ date: '2026-09-01', score: 4, journal: '' }];
  const chart = model.chartRecords(records, now);
  assert.equal(chart.length, 7);
  assert.equal(chart.find((r) => r.date === '2026-09-06').score, null);
  assert.equal(chart.find((r) => r.date === '2026-09-01').score, 4);
});
test('saved storage round trips, deduplicates dates, and preserves Unicode', () => {
  const entry = { date: '2026-09-06', score: 4, journal: 'Aku baik 🙂' };
  assert.deepEqual(model.parseRecords(JSON.stringify([entry, entry])), [entry]);
});
test('invalid storage and impossible calendar dates fail intentionally', () => {
  for (const raw of [
    'broken',
    '{}',
    '[null]',
    JSON.stringify([{ date: '2026-02-31', score: 2, journal: '' }]),
    JSON.stringify([{ date: '2026-09-06', score: 6, journal: '' }]),
    JSON.stringify([{ date: '2026-09-06', score: 3, journal: 12 }]),
  ])
    assert.throws(() => model.parseRecords(raw));
});
test('invalid scores and oversized drafts cannot be saved', () => {
  for (const score of [0, 6, 2.5, NaN])
    assert.throws(() => model.saveDaily([], score, '', now));
  assert.throws(() => model.saveDaily([], 3, 'x'.repeat(5001), now));
});
test('directory search, specialty filter and sort compose correctly', () => {
  assert.deepEqual(
    model
      .filterDoctors('  NADIA ', 'Kecemasan', 'availability')
      .map((d) => d.id),
    ['nadia'],
  );
  assert.equal(
    model.filterDoctors('Nadia', 'Keluarga', 'availability').length,
    0,
  );
  assert.equal(
    model.filterDoctors('', 'Semua', 'alphabetical')[0].name,
    'Ayu Lestari',
  );
  const sorted = model.filterDoctors('', 'Semua', 'availability');
  assert.ok(sorted.slice(0, 4).every((d) => d.available));
  assert.ok(sorted.slice(4).every((d) => !d.available));
});
test('insights route to a matching topic without presenting a diagnosis', () => {
  assert.equal(
    model.analyzeJournal(2, 'Hari terasa berat.').topic,
    'Kecemasan',
  );
  assert.equal(
    model.analyzeJournal(3, 'Aku berbicara dengan keluarga.').topic,
    'Keluarga',
  );
  assert.equal(model.analyzeJournal(5, 'Aku bersyukur.').topic, 'Self-Love');
  assert.equal(model.analyzeJournal(3, 'Ingin menyakiti diri.').crisis, true);
  assert.match(model.chatReply('ingin mati'), /119/);
});
