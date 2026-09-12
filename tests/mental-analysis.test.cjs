const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

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
      if (!(name in dependencies)) {
        throw new Error(`Unexpected dependency: ${name}`);
      }
      return dependencies[name];
    },
  );
  return entry.exports;
}

const analysis = load('mental-analysis.ts');
const data = load('catharsa-data.ts');
const { filterDoctors } = load('psychologist-directory.ts', {
  './catharsa-data': data,
});

test('a steady check-in stays at care level zero', () => {
  const result = analysis.analyzeMentalState({
    moodSlider: 5,
    journalText: 'Hari ini terasa tenang dan aku bersyukur.',
  });
  assert.equal(result.careLevel, 0);
  assert.equal(result.severity, 'wellbeing');
  assert.equal(result.crisis, false);
  assert.equal(result.provider, 'catharsa-step-care-v1');
  assert.ok(filterDoctors('', result.specialty, 'availability').length > 0);
});

test('severe anxiety routes to specialist support even with a neutral mood', () => {
  for (const journalText of [
    'Aku mengalami kecemasan berat.',
    'Kecemasan tinggi membuatku sulit fokus.',
    'Aku sangat cemas hari ini.',
    'I have severe anxiety.',
    'I feel extremely anxious.',
  ]) {
    const result = analysis.analyzeMentalState({ moodSlider: 3, journalText });
    assert.equal(result.careLevel, 2, journalText);
    assert.equal(result.specialty, 'Kecemasan');
    assert.ok(filterDoctors('', result.specialty, 'availability').length > 0);
  }
  assert.equal(
    analysis.analyzeMentalState({
      moodSlider: 3,
      journalText: 'Aku mengalami kecemasan ringan.',
    }).careLevel,
    1,
  );
});

test('mild anxiety routes to educational content', () => {
  const result = analysis.analyzeMentalState({
    moodSlider: 3,
    journalText: 'Aku agak cemas menghadapi presentasi besok.',
  });
  assert.equal(result.careLevel, 1);
  assert.equal(result.topic, 'Kecemasan');
  assert.match(result.action, /baca/i);
});

test('withdrawal and family context route to a matching specialist', () => {
  const result = analysis.analyzeMentalState({
    moodSlider: 2,
    journalText: 'Aku menarik diri dari keluarga dan tidak bisa tidur.',
  });
  assert.equal(result.careLevel, 2);
  assert.equal(result.severity, 'moderate');
  assert.equal(result.topic, 'Keluarga');
  assert.equal(result.specialty, 'Keluarga');
  assert.ok(result.signals.includes('menarik diri'));
});

test('English high-distress markers are recognized deterministically', () => {
  const result = analysis.analyzeMentalState({
    moodSlider: 3,
    journalText: 'I feel overwhelmed and I cannot function at work.',
  });
  assert.equal(result.careLevel, 2);
  assert.ok(result.signals.includes('fungsi harian terganggu'));
});

test('crisis language always selects urgent support', () => {
  const result = analysis.analyzeMentalState({
    moodSlider: 4,
    journalText: 'Aku ingin menyakiti diri malam ini.',
  });
  assert.equal(result.careLevel, 3);
  assert.equal(result.severity, 'urgent');
  assert.equal(result.crisis, true);
  assert.equal(result.specialty, 'Kecemasan');
  assert.match(result.body, /119 ext\. 8/);
});

test('request validation rejects invalid mood values and oversized journals', () => {
  for (const moodSlider of [0, 6, 2.5, NaN, '2']) {
    assert.throws(() =>
      analysis.parseMentalAnalysisInput({ moodSlider, journalText: '' }),
    );
  }
  assert.throws(() =>
    analysis.parseMentalAnalysisInput({
      moodSlider: 3,
      journalText: 'x'.repeat(5001),
    }),
  );
});
