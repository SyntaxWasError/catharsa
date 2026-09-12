import { MOOD_SAMPLES } from './catharsa-data';
export const STORAGE_KEY = 'catharsa.journal.v1';
export type MoodRecord = {
  date: string;
  score: number;
  journal: string;
  demo?: boolean;
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
export function isCrisis(text: string) {
  return /bunuh diri|menyakiti diri|ingin mati|akhiri hidup|suicide|kill myself/i.test(
    text,
  );
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
