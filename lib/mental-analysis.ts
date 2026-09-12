export const mentalAnalysisTopics = [
  'Kecemasan',
  'Keluarga',
  'Self-Love',
] as const;

export type MentalAnalysisTopic = (typeof mentalAnalysisTopics)[number];
export type MentalAnalysisSeverity =
  | 'wellbeing'
  | 'mild'
  | 'moderate'
  | 'urgent';
export type CareLevel = 0 | 1 | 2 | 3;

export type MentalAnalysisInput = {
  moodSlider: number;
  journalText: string;
};

export type MentalAnalysis = {
  careLevel: CareLevel;
  severity: MentalAnalysisSeverity;
  title: string;
  body: string;
  action: string;
  topic: MentalAnalysisTopic;
  specialty: string;
  crisis: boolean;
  signals: string[];
  provider: 'catharsa-step-care-v1';
};

const CRISIS_MARKERS: ReadonlyArray<[string, RegExp]> = [
  ['pikiran menyakiti diri', /\b(menyakiti|melukai)\s+diri\b/i],
  ['pikiran bunuh diri', /\b(bunuh\s+diri|ingin\s+mati|pengen\s+mati)\b/i],
  ['suicidal thoughts', /\b(suicid(?:e|al)|kill\s+myself|end\s+my\s+life)\b/i],
  [
    'kehilangan alasan hidup',
    /\b(tidak\s+ingin\s+hidup|no\s+reason\s+to\s+live)\b/i,
  ],
];

const HIGH_DISTRESS_MARKERS: ReadonlyArray<[string, RegExp]> = [
  [
    'kecemasan berat',
    /\b(kecemasan\s+(?:berat|tinggi|parah)|(?:sangat|terlalu)\s+cemas|(?:severe|high|extreme)\s+anxiety|(?:severely|extremely)\s+anxious)\b/i,
  ],
  ['serangan panik', /\b(panik|panic(?:\s+attack)?)\b/i],
  [
    'menarik diri',
    /\b(menarik\s+diri|mengisolasi\s+diri|withdraw(?:al|ing)?|isolat(?:e|ing|ion))\b/i,
  ],
  [
    'fungsi harian terganggu',
    /\b(tidak\s+bisa\s+(?:berfungsi|beraktivitas)|cannot\s+function|can'?t\s+function)\b/i,
  ],
  [
    'sulit tidur berkepanjangan',
    /\b(insomnia|tidak\s+bisa\s+tidur|can'?t\s+sleep)\b/i,
  ],
  ['putus asa', /\b(putus\s+asa|hopeless(?:ness)?)\b/i],
];

const MILD_DISTRESS_MARKERS: ReadonlyArray<[string, RegExp]> = [
  [
    'kecemasan',
    /\b(cemas|cemasnya|kecemasan|khawatir|anxious|anxiety|worry|worried)\b/i,
  ],
  ['merasa kewalahan', /\b(kewalahan|overwhelm(?:ed|ing)?)\b/i],
  ['kesedihan', /\b(sedih|murung|sad|down)\b/i],
  ['kesepian', /\b(sepi|kesepian|lonely|alone)\b/i],
  ['kelelahan emosional', /\b(lelah|capek|exhausted|drained)\b/i],
  ['ketakutan', /\b(takut|fear(?:ful)?|afraid)\b/i],
  ['beban terasa berat', /\b(terasa\s+berat|sangat\s+berat|feels?\s+heavy)\b/i],
];

const FAMILY_MARKERS =
  /\b(keluarga|orang\s*tua|ayah|ibu|suami|istri|anak|family|parent|father|mother|husband|wife)\b/i;
const SELF_LOVE_MARKERS =
  /\b(diri\s+sendiri|percaya\s+diri|harga\s+diri|self[ -]?(?:love|esteem|worth)|menerima\s+diri|body\s+image)\b/i;

export function parseMentalAnalysisInput(value: unknown): MentalAnalysisInput {
  if (!value || typeof value !== 'object') {
    throw new TypeError('Data analisis harus berupa objek JSON.');
  }

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.moodSlider !== 'number' ||
    !Number.isInteger(candidate.moodSlider) ||
    candidate.moodSlider < 1 ||
    candidate.moodSlider > 5
  ) {
    throw new RangeError(
      'Nilai suasana hati harus berupa bilangan bulat dari 1 sampai 5.',
    );
  }

  if (typeof candidate.journalText !== 'string') {
    throw new TypeError('Isi jurnal harus berupa teks.');
  }

  if (candidate.journalText.length > 5000) {
    throw new RangeError('Isi jurnal tidak boleh lebih dari 5.000 karakter.');
  }

  return {
    moodSlider: candidate.moodSlider,
    journalText: candidate.journalText,
  };
}

function matchingSignals(
  journalText: string,
  markers: ReadonlyArray<[string, RegExp]>,
) {
  return markers
    .filter(([, pattern]) => pattern.test(journalText))
    .map(([signal]) => signal);
}

function chooseTopic(journalText: string): MentalAnalysisTopic {
  if (FAMILY_MARKERS.test(journalText)) return 'Keluarga';
  if (SELF_LOVE_MARKERS.test(journalText)) return 'Self-Love';
  return 'Kecemasan';
}

function specialtyFor(topic: MentalAnalysisTopic) {
  return topic;
}

/**
 * Deterministic stepped-care triage for the journal check-in.
 * It surfaces supportive next steps and deliberately does not make a diagnosis.
 */
export function analyzeMentalState(rawInput: unknown): MentalAnalysis {
  const { moodSlider, journalText } = parseMentalAnalysisInput(rawInput);
  const crisisSignals = matchingSignals(journalText, CRISIS_MARKERS);
  const highSignals = matchingSignals(journalText, HIGH_DISTRESS_MARKERS);
  const mildSignals = matchingSignals(journalText, MILD_DISTRESS_MARKERS);
  const topic = chooseTopic(journalText);
  const specialty = specialtyFor(topic);

  if (crisisSignals.length > 0) {
    return {
      careLevel: 3,
      severity: 'urgent',
      title: 'Kamu tidak perlu menghadapi ini sendirian',
      body: 'Refleksi otomatis ini bukan diagnosis. Tulisanmu memuat tanda bahwa dukungan segera mungkin diperlukan. Hubungi layanan darurat 119 ext. 8 atau orang tepercaya yang dapat menemanimu sekarang.',
      action: 'Hubungi dukungan darurat sekarang',
      topic,
      specialty: 'Kecemasan',
      crisis: true,
      signals: crisisSignals,
      provider: 'catharsa-step-care-v1',
    };
  }

  const distressScore =
    (moodSlider === 1 ? 3 : moodSlider === 2 ? 2 : 0) +
    highSignals.length * 3 +
    mildSignals.length;

  if (highSignals.length > 0 || distressScore >= 4) {
    const signals = [...highSignals, ...mildSignals];
    return {
      careLevel: 2,
      severity: 'moderate',
      title: 'Dukungan profesional bisa membantu memberi ruang',
      body: `Refleksi otomatis ini bukan diagnosis. Pola yang kamu tulis menunjukkan ${signals[0] ?? 'tekanan emosional'} yang layak dibicarakan dengan tenaga profesional.`,
      action: `Temukan psikolog untuk ${specialty.toLowerCase()}`,
      topic,
      specialty,
      crisis: false,
      signals,
      provider: 'catharsa-step-care-v1',
    };
  }

  if (distressScore > 0) {
    return {
      careLevel: 1,
      severity: 'mild',
      title: 'Mari beri perhatian lembut pada perasaan ini',
      body: `Refleksi otomatis ini bukan diagnosis. Check-in hari ini menangkap ${mildSignals[0] ?? 'suasana hati yang sedang rendah'}. Materi singkat yang relevan dapat membantu kamu memahami pola ini.`,
      action: `Baca panduan ${topic.toLowerCase()}`,
      topic,
      specialty,
      crisis: false,
      signals: mildSignals.length > 0 ? mildSignals : ['suasana hati rendah'],
      provider: 'catharsa-step-care-v1',
    };
  }

  return {
    careLevel: 0,
    severity: 'wellbeing',
    title: 'Ruangmu hari ini terasa cukup ringan',
    body: 'Refleksi otomatis ini bukan diagnosis. Pertahankan kebiasaan check-in dan catat hal kecil yang membantu suasana hatimu tetap stabil.',
    action: 'Lanjutkan refleksi penuh perhatian',
    topic: topic === 'Kecemasan' ? 'Self-Love' : topic,
    specialty: specialtyFor(topic === 'Kecemasan' ? 'Self-Love' : topic),
    crisis: false,
    signals: [],
    provider: 'catharsa-step-care-v1',
  };
}
