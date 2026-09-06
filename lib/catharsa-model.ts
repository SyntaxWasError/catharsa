import { MOOD_SAMPLES, PSYCHOLOGISTS } from './catharsa-data';
export const STORAGE_KEY = 'catharsa.journal.v1';
export type MoodRecord = {
  date: string;
  score: number;
  journal: string;
  demo?: boolean;
};
export type Insight = {
  title: string;
  body: string;
  action: string;
  topic: 'Kecemasan' | 'Keluarga' | 'Self-Love';
  crisis: boolean;
};
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function weekDates(now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - 6 + i);
    return dateKey(day);
  });
}
export function fallbackRecords(now = new Date()): MoodRecord[] {
  return weekDates(now).map((date, i) => ({
    date,
    score: MOOD_SAMPLES[i],
    journal: '',
    demo: true,
  }));
}
export function parseRecords(raw: string): MoodRecord[] {
  const data: unknown = JSON.parse(raw);
  if (
    !Array.isArray(data) ||
    !data.every(
      (r) =>
        r &&
        typeof r.date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
        !isNaN(Date.parse(`${r.date}T12:00:00`)) &&
        dateKey(new Date(`${r.date}T12:00:00`)) === r.date &&
        Number.isInteger(r.score) &&
        r.score >= 1 &&
        r.score <= 5 &&
        typeof r.journal === 'string' &&
        r.journal.length <= 5000 &&
        (r.demo === undefined || typeof r.demo === 'boolean'),
    )
  )
    throw new Error('Data jurnal tidak valid.');
  return [...new Map(data.map((r) => [r.date, r])).values()].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}
export function saveDaily(
  records: MoodRecord[],
  score: number,
  journal: string,
  now = new Date(),
): MoodRecord[] {
  if (
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5 ||
    journal.length > 5000
  )
    throw new Error('Periksa pilihan perasaan dan panjang jurnal.');
  const today = dateKey(now);
  return [
    ...records.filter((r) => r.date !== today),
    { date: today, score, journal: journal.trim(), demo: false },
  ].sort((a, b) => a.date.localeCompare(b.date));
}
export function chartRecords(records: MoodRecord[], now = new Date()) {
  return weekDates(now).map((date) => {
    const record = records.find((r) => r.date === date);
    return {
      date,
      day: new Date(`${date}T12:00:00`).toLocaleDateString('id-ID', {
        weekday: 'short',
      }),
      score: record?.score ?? null,
      demo: record?.demo ?? false,
    };
  });
}
export function filterDoctors(query: string, tag: string, sort: string) {
  return PSYCHOLOGISTS.filter(
    (d) =>
      `${d.name} ${d.credential} ${d.specialties.join(' ')}`
        .toLocaleLowerCase('id-ID')
        .includes(query.trim().toLocaleLowerCase('id-ID')) &&
      (tag === 'Semua' || d.specialties.some((s) => s === tag)),
  )
    .slice()
    .sort((a, b) =>
      sort === 'alphabetical'
        ? a.name.localeCompare(b.name, 'id')
        : sort === 'specialty'
          ? a.specialties[0].localeCompare(b.specialties[0], 'id')
          : Number(b.available) - Number(a.available) ||
            a.name.localeCompare(b.name, 'id'),
    );
}
export function isCrisis(text: string) {
  return /bunuh diri|menyakiti diri|ingin mati|akhiri hidup|suicide|kill myself/i.test(
    text,
  );
}
export function analyzeJournal(score: number, journal: string): Insight {
  if (isCrisis(journal))
    return {
      title: 'Kamu layak mendapatkan dukungan sekarang.',
      body: 'Terima kasih sudah menuliskan hal yang berat ini. Jika kamu merasa tidak aman atau mungkin menyakiti diri, dekati orang tepercaya dan hubungi bantuan langsung.',
      action: 'Buka bantuan darurat untuk menghubungi 119 atau Healing119.',
      topic: 'Kecemasan',
      crisis: true,
    };
  if (
    /cemas|takut|panik|khawatir|gelisah|stres|stress/i.test(journal) ||
    score <= 2
  )
    return {
      title: 'Sepertinya hari ini terasa cukup berat.',
      body: 'Ada ruang untuk perasaan yang sulit. Coba berhenti sejenak, rasakan kaki menyentuh lantai, dan pilih satu kebutuhan kecil yang bisa kamu penuhi.',
      action:
        'Jika perasaan ini terus mengganggu keseharian, dukungan profesional bisa membantu.',
      topic: 'Kecemasan',
      crisis: false,
    };
  if (/keluarga|orang tua|anak|pasangan|ibu|ayah/i.test(journal))
    return {
      title: 'Hubungan juga membutuhkan ruang untuk bernapas.',
      body: 'Ceritamu menyinggung orang-orang yang dekat denganmu. Coba tuliskan kebutuhan yang ingin kamu sampaikan dengan tenang, lalu pilih waktu yang terasa aman untuk berbicara.',
      action: 'Kamu boleh menjaga kedekatan sekaligus merawat batasmu sendiri.',
      topic: 'Keluarga',
      crisis: false,
    };
  return {
    title:
      score >= 4
        ? 'Ada hal baik yang layak kamu rayakan.'
        : 'Terima kasih sudah hadir untuk dirimu.',
    body:
      score >= 4
        ? 'Catat satu hal kecil yang membantu harimu terasa baik. Kamu bisa kembali ke catatan ini ketika membutuhkan pengingat.'
        : 'Tidak semua perasaan harus langsung diberi jawaban. Mencatatnya adalah satu cara untuk mengenal kebutuhanmu, perlahan.',
    action: 'Pilih satu tindakan baik untuk dirimu hari ini, sekecil apa pun.',
    topic: 'Self-Love',
    crisis: false,
  };
}
export function chatReply(text: string) {
  if (isCrisis(text))
    return 'Terima kasih sudah bercerita. Jika kamu merasa tidak aman atau mungkin menyakiti diri, segera hubungi 119 atau orang tepercaya yang bisa menemanimu. Healing119 juga dapat diakses melalui 119 ekstensi 8 atau healing119.id. Chat ini adalah simulasi dan tidak dipantau tenaga profesional.';
  if (/cemas|takut|panik|khawatir/i.test(text))
    return 'Kedengarannya ada kekhawatiran yang sedang membebanimu. Jika nyaman, apa yang paling terasa berat saat ini? Kita bisa membicarakannya satu per satu, tanpa terburu-buru.';
  if (/keluarga|anak|ibu|ayah|pasangan/i.test(text))
    return 'Hubungan dengan orang terdekat bisa membawa banyak perasaan sekaligus. Saat kamu memikirkan situasi ini, kebutuhan apa yang paling ingin kamu sampaikan?';
  return 'Terima kasih sudah mau berbagi. Kamu tidak perlu merangkai cerita dengan sempurna. Bagian mana yang ingin kamu ceritakan lebih lanjut? Aku akan mengikuti ritmemu dalam simulasi ini.';
}
