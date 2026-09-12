'use client';
import { lazy, Suspense, useMemo, type SyntheticEvent } from 'react';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Info,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  Play,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Star,
  Users,
  Wind,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ARTICLES,
  TOPICS,
  type Doctor,
  type Topic,
  type Article,
} from '@/lib/catharsa-data';
import { type MoodRecord } from '@/lib/catharsa-model';
import { filterDoctors } from '@/lib/psychologist-directory';
import { type MentalAnalysis } from '@/lib/mental-analysis';
import { MoodSprout } from '@/components/mood-sprout';
import { moods, primary, secondary, PageHeader } from './catharsa-ui';

const MoodChart = lazy(async () => {
  const chartModule = await import('@/components/mood-chart');
  return { default: chartModule.MoodChart };
});

export function PsychologistCard({
  doctor: d,
  reminded,
  onChat,
  onRemind,
}: {
  doctor: Doctor;
  reminded: boolean;
  onChat: (d: Doctor) => void;
  onRemind: (d: Doctor) => void;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-teal/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-6 flex items-center justify-between gap-2">
        <span
          className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[11px] font-medium ${d.available ? 'bg-sage/15 text-teal' : 'bg-cream text-muted-foreground'}`}
        >
          <span
            className={`size-1.5 shrink-0 rounded-full ${d.available ? 'bg-teal shadow-[0_0_0_3px_#A3B18A30]' : 'bg-teal/35'}`}
          />
          {d.available ? 'Tersedia Hari Ini' : 'Sedang Menangani Klien'}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold">
          <Star size={13} className="fill-sage text-teal" />
          {d.rating.toFixed(1)}
          <span className="font-normal text-muted-foreground">
            ({d.reviews})
          </span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sage/50 to-cream text-xl font-semibold text-teal"
        >
          {d.initials}
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{d.name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{d.credential}</p>
          <p className="mt-1.5 text-xs text-teal">{d.years} tahun pengalaman</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {d.specialties.map((s) => (
          <span
            key={s}
            className="rounded-md border border-teal/10 bg-cream px-2.5 py-1.5 text-xs"
          >
            {s}
          </span>
        ))}
      </div>
      <p className="mt-5 min-h-12 text-sm leading-6 text-muted-foreground">
        “{d.quote}”
      </p>
      <p className="mt-5 flex items-center gap-2 border-b border-teal/10 pb-5 text-xs text-muted-foreground">
        <CalendarDays size={14} />
        {d.schedule}
      </p>
      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="text-lg font-bold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(d.price)}
          </span>
          <span className="text-xs text-muted-foreground"> / jam</span>
          <p className="mt-1 text-xs text-muted-foreground">
            Harga total · tanpa biaya tersembunyi
          </p>
        </div>
      </div>
      <Button
        className={`${d.available ? primary : secondary} mt-5 w-full`}
        onClick={() => (d.available ? onChat(d) : onRemind(d))}
      >
        {d.available ? (
          <MessageCircle size={16} />
        ) : reminded ? (
          <Check size={16} />
        ) : (
          <Bell size={16} />
        )}
        {d.available
          ? 'Chat Sekarang'
          : reminded
            ? 'Pengingat Diaktifkan'
            : 'Ingatkan Saya'}
      </Button>
    </article>
  );
}
export function ConsultView({
  query,
  setQuery,
  tag,
  setTag,
  sort,
  setSort,
  reminded,
  onChat,
  onRemind,
}: {
  query: string;
  setQuery: (v: string) => void;
  tag: string;
  setTag: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  reminded: string[];
  onChat: (d: Doctor) => void;
  onRemind: (d: Doctor) => void;
}) {
  const doctors = useMemo(
    () => filterDoctors(query, tag, sort),
    [query, tag, sort],
  );
  return (
    <div className="pt-10 md:pt-14">
      <div className="flex items-start justify-between gap-6">
        <PageHeader
          eyebrow="CATHARSACONSULT"
          title="Cerita yang kamu simpan,"
          accent="layak untuk didengarkan."
          description="Temukan psikolog sesuai kebutuhanmu. Keahlian, jadwal, dan biaya terlihat jelas sebelum kamu memulai."
        />
        <div className="hidden items-center gap-2 rounded-full border border-teal/15 bg-white px-4 py-3 text-xs font-semibold text-teal lg:flex">
          <ShieldCheck size={18} />
          100% transparan
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-teal/15 bg-white p-3 sm:flex-row">
        <label className="relative flex flex-1 items-center">
          <Search size={19} className="absolute left-3 text-muted-foreground" />
          <span className="sr-only">Cari nama atau spesialisasi psikolog</span>
          <input
            className="h-12 w-full rounded-xl bg-cream/80 pr-10 pl-11 text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Cari nama atau spesialisasi psikolog..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              aria-label="Hapus pencarian"
              className="absolute right-3 p-1"
              onClick={() => setQuery('')}
            >
              <X size={15} />
            </button>
          )}
        </label>
        <Select
          value={sort}
          onValueChange={(v) => {
            if (v) setSort(v);
          }}
          items={[
            { value: 'availability', label: 'Ketersediaan' },
            { value: 'alphabetical', label: 'Abjad' },
            { value: 'specialty', label: 'Spesialisasi' },
          ]}
        >
          <SelectTrigger
            aria-label="Urutkan psikolog"
            className="h-12! min-w-48 rounded-xl border-teal/15 px-4"
          >
            <SlidersHorizontal size={16} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="availability">Ketersediaan</SelectItem>
            <SelectItem value="alphabetical">Abjad</SelectItem>
            <SelectItem value="specialty">Spesialisasi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <fieldset className="my-6 flex flex-wrap gap-2">
        <legend className="sr-only">Filter spesialisasi</legend>
        {[
          'Semua',
          'Kecemasan',
          'Keluarga',
          'Self-Love',
          'Burnout',
          'Hubungan',
          'Pengasuhan',
        ].map((t) => (
          <button
            aria-pressed={t === tag}
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-full border px-4 py-2 text-sm font-medium hover:bg-sage/20 active:scale-95 ${t === tag ? 'border-sage bg-sage/45' : 'border-teal/15 bg-white'}`}
          >
            {t}
          </button>
        ))}
      </fieldset>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          {doctors.length} psikolog untukmu
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info size={13} />
          Profil, ulasan, harga, dan jadwal adalah data demo.
        </p>
      </div>
      {doctors.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((d) => (
            <PsychologistCard
              key={d.id}
              doctor={d}
              reminded={reminded.includes(d.id)}
              onChat={onChat}
              onRemind={onRemind}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-teal/30 bg-white px-6 py-16 text-center">
          <Search className="mx-auto mb-4 text-teal" size={32} />
          <h2 className="text-xl font-bold">Belum menemukan yang cocok.</h2>
          <p className="my-4 text-muted-foreground">
            Coba nama atau topik yang lain, atau tampilkan semua psikolog.
          </p>
          <Button
            className={primary}
            onClick={() => {
              setQuery('');
              setTag('Semua');
            }}
          >
            Reset pencarian
          </Button>
        </div>
      )}
    </div>
  );
}

export function TrackView({
  mood,
  setMood,
  journal,
  setJournal,
  records,
  saving,
  ready,
  save,
  insight,
  analysisError,
  storageError,
  draftDate,
  today,
  openLearning,
  openConsult,
  emergency,
}: {
  mood: number | null;
  setMood: (n: number) => void;
  journal: string;
  setJournal: (v: string) => void;
  records: MoodRecord[];
  saving: boolean;
  ready: boolean;
  save: (e: SyntheticEvent<HTMLFormElement>) => void | Promise<void>;
  insight: MentalAnalysis | null;
  analysisError: string;
  storageError: string;
  draftDate: string;
  today: string;
  openLearning: (topic: Topic) => void;
  openConsult: (specialty: string) => void;
  emergency: () => void;
}) {
  const selected = moods[(mood ?? 3) - 1];
  return (
    <div className="space-y-7 pt-10 md:pt-14">
      <PageHeader
        eyebrow="CATHARSATRACK"
        title="Dengarkan perasaanmu."
        accent="Beri ceritamu ruang."
        description="Tidak ada perasaan yang salah. Luangkan sedikit waktu untuk mengenal apa yang sedang kamu rasakan."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <form
          onSubmit={save}
          aria-busy={saving}
          className="rounded-2xl border border-teal/15 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight">
              Check-in hari ini
            </h2>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              {new Date(`${draftDate}T12:00:00`).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="pt-8 pb-5 text-center">
            <MoodSprout
              level={mood ?? 3}
              label={
                mood
                  ? `Perasaan dipilih: ${selected.label}`
                  : 'Belum memilih perasaan'
              }
              className="mx-auto size-24 drop-shadow-[0_10px_18px_rgba(88,129,87,0.12)]"
            />
            <p aria-live="polite" className="mt-3 font-semibold">
              {mood ? selected.label : 'Apa yang kamu rasakan?'}
            </p>
          </div>
          <fieldset className="mb-5 grid grid-cols-5 gap-1 sm:gap-2">
            <legend className="sr-only">Pilih perasaan hari ini</legend>
            {moods.map((item, index) => (
              <button
                key={item.reference}
                type="button"
                disabled={saving || !ready}
                aria-label={`${index + 1} dari 5, ${item.label}, ${item.reference}`}
                aria-pressed={mood === index + 1}
                onClick={() => setMood(index + 1)}
                className={`group rounded-xl border px-0.5 py-2 transition-all hover:-translate-y-1 hover:bg-sage/15 active:scale-95 sm:px-2 ${
                  mood === index + 1
                    ? 'border-teal bg-sage/20 shadow-sm'
                    : 'border-transparent'
                }`}
              >
                <MoodSprout
                  level={index + 1}
                  className="mx-auto size-11 sm:size-14"
                />
                <span className="mt-1 block truncate text-[9px] text-muted-foreground sm:text-[11px]">
                  {item.label}
                </span>
              </button>
            ))}
          </fieldset>
          <span id="mood-slider-label" className="sr-only">
            Perasaan, 1 kewalahan sampai 5 ringan
          </span>
          <Slider
            aria-labelledby="mood-slider-label"
            disabled={saving || !ready}
            value={[mood ?? 3]}
            min={1}
            max={5}
            step={1}
            onValueChange={(v) => setMood(Array.isArray(v) ? v[0] : v)}
            className="mx-auto mb-3 w-[95%]! py-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-gradient-to-r [&_[data-slot=slider-track]]:from-sage/15 [&_[data-slot=slider-track]]:to-sage/60 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:shadow-[0_0_16px_#A3B18A88]"
          />
          <div className="mb-7 flex justify-between text-xs text-muted-foreground">
            <span>1 · Kewalahan</span>
            <button
              type="button"
              disabled={saving || !ready}
              onClick={() => setMood(3)}
              className="text-teal hover:underline"
            >
              3 · Netral
            </button>
            <span>5 · Ringan</span>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            {draftDate !== today
              ? `Hari sudah berganti. Draf ini tetap untuk ${draftDate}; simpan sebelum memulai catatan hari ini.`
              : ''}
          </p>
          <label htmlFor="journal" className="mb-3 block text-sm font-semibold">
            Apa yang ingin kamu ceritakan?
          </label>
          <textarea
            id="journal"
            maxLength={5000}
            disabled={!ready || saving}
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Tuliskan apa yang membebani pikiranmu hari ini... atau hal kecil yang membuatmu tersenyum."
            className="min-h-44 w-full resize-y rounded-xl border border-teal/15 bg-cream/60 p-4 text-base leading-7 placeholder:text-muted-foreground/80"
          />
          <div className="mt-2 flex justify-between gap-2 text-xs text-muted-foreground">
            <span>Tidak harus rapi. Tidak harus panjang.</span>
            <span>{journal.length}/5000</span>
          </div>
          {storageError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-emergency/25 bg-emergency/5 p-3 text-sm"
            >
              {storageError}
            </p>
          )}
          {analysisError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-emergency/25 bg-emergency/5 p-3 text-sm"
            >
              {storageError
                ? 'Tulisanmu masih ada di halaman ini. Salin sebelum menutup halaman.'
                : 'Catatanmu tetap tersimpan.'}{' '}
              {analysisError}
            </p>
          )}
          <Button
            disabled={!ready || saving || mood === null}
            type="submit"
            className={`${primary} mt-6 w-full`}
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Sparkles size={17} />
            )}
            {saving
              ? 'Mengirim & menganalisis dengan aman...'
              : 'Simpan & Analisis'}
          </Button>
          <output className="sr-only" aria-live="polite">
            {saving ? 'Analisis sedang diproses.' : ''}
          </output>
          {mood === null && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Pilih perasaanmu terlebih dahulu.
            </p>
          )}
          <p className="mt-4 flex items-start justify-center gap-2 text-xs leading-5 text-muted-foreground">
            <LockKeyhole size={13} className="mt-0.5 shrink-0" />
            Saat dianalisis, skor dan teks dikirim sementara ke endpoint
            Catharsa. Catatan tetap disimpan hanya di browser ini dan tidak
            diteruskan ke penyedia AI pihak ketiga.
          </p>
        </form>
        <aside className="space-y-5">
          <div className="rounded-2xl border border-teal/15 bg-sage/15 p-7">
            <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-white text-teal">
              <Sprout size={25} />
            </div>
            <h2 className="text-2xl leading-snug font-semibold tracking-tight">
              Kamu tidak perlu
              <br />
              memahami semuanya
              <br />
              hari ini.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Mulailah dari satu kalimat. Kadang, memberi nama pada perasaan
              sudah menjadi langkah yang berarti.
            </p>
            <div className="mt-7 border-t border-teal/15 pt-5">
              <p className="text-xs font-bold tracking-widest text-teal">
                JIKA BINGUNG MEMULAI
              </p>
              <p className="mt-3 text-sm leading-6">
                “Hari ini aku merasa ... karena ...”
                <br />
                “Yang sedang kubutuhkan adalah ...”
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-teal/15 bg-white p-6">
            <Sparkles size={20} className="text-teal" />
            <h3 className="mt-3 font-semibold">
              Sebuah refleksi, bukan diagnosis.
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Mesin step-care Catharsa membaca pola bahasa dan skor perasaan
              untuk memilih langkah dukungan. Hasilnya tidak mengukur kondisi
              klinis atau menggantikan penilaian psikolog.
            </p>
          </div>
        </aside>
      </div>
      <Suspense
        fallback={
          <section
            aria-label="Memuat grafik perasaan"
            className="h-[380px] animate-pulse rounded-2xl border border-teal/15 bg-white p-8"
          >
            <div className="h-4 w-44 rounded-full bg-sage/25" />
            <div className="mt-5 h-7 w-64 max-w-full rounded-full bg-sage/15" />
            <div className="mt-10 h-56 rounded-xl bg-cream" />
          </section>
        }
      >
        <MoodChart records={records} />
      </Suspense>
      {insight && (
        <section
          aria-live="polite"
          className="rounded-2xl border border-teal/20 bg-sage/15 p-5 sm:p-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-teal">
            <Sparkles size={17} />
            ANALISIS STEP-CARE · TINGKAT {insight.careLevel}
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            {insight.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
            {insight.body}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {insight.action}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-teal/15 bg-white/70 px-3 py-1.5">
              Fokus: {insight.topic}
            </span>
            <span className="rounded-full border border-teal/15 bg-white/70 px-3 py-1.5">
              Rujukan: {insight.specialty}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {insight.crisis && (
              <Button
                onClick={emergency}
                className={`${primary} bg-emergency hover:bg-emergency/80`}
              >
                Buka bantuan darurat
              </Button>
            )}
            {insight.careLevel <= 1 ? (
              <>
                <Button
                  onClick={() => openLearning(insight.topic)}
                  className={primary}
                >
                  <BookOpen size={16} />
                  Baca Artikel Edukasi
                </Button>
                <Button
                  onClick={() => openConsult(insight.specialty)}
                  className={secondary}
                >
                  <MessageCircle size={16} />
                  Lihat Psikolog
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => openConsult(insight.specialty)}
                  className={primary}
                >
                  <MessageCircle size={16} />
                  Temukan Psikolog {insight.specialty}
                </Button>
                <Button
                  onClick={() => openLearning(insight.topic)}
                  className={secondary}
                >
                  <BookOpen size={16} />
                  Baca Pendamping
                </Button>
              </>
            )}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Sumber analisis: {insight.provider}. Ini adalah panduan awal, bukan
            diagnosis.
          </p>
        </section>
      )}
    </div>
  );
}

const topicIcons = {
  wind: Wind,
  family: Users,
  heart: Heart,
  leaf: Leaf,
  video: Play,
};
export function ContentCard({
  article: a,
  onOpen,
}: {
  article: Article;
  onOpen: (a: Article) => void;
}) {
  const Icon = topicIcons[a.symbol];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-teal/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <button
        aria-label={`${a.type === 'video' ? 'Tonton' : 'Baca'} ${a.title}`}
        onClick={() => onOpen(a)}
        className={`relative flex h-44 w-full items-center justify-center overflow-hidden ${a.category === 'Keluarga' ? 'bg-sage/20' : a.category === 'Self-Love' ? 'bg-cream' : 'bg-teal/15'}`}
      >
        {a.type === 'video' ? (
          <>
            <Image
              width={480}
              height={360}
              unoptimized
              src="https://i.ytimg.com/vi/E3Cts45FNrk/hqdefault.jpg"
              alt="Thumbnail video WHO: Doing What Matters in Times of Stress"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-ink/20" />
            <span className="relative flex size-14 items-center justify-center rounded-full bg-white/95 text-teal shadow-md transition-transform group-hover:scale-110">
              <Play size={22} className="ml-1 fill-teal" />
            </span>
          </>
        ) : (
          <>
            <div className="flex size-24 items-center justify-center rounded-full border border-teal/15 bg-white/45 text-teal">
              <Icon size={46} strokeWidth={1.2} />
            </div>
            <span className="absolute top-4 left-5 text-[10px] font-semibold tracking-[0.2em] text-teal/70">
              CATATAN UNTUK BERTUMBUH
            </span>
            <span className="absolute right-5 bottom-4 text-3xl font-light text-teal/40">
              {a.category === 'Kecemasan'
                ? '01'
                : a.category === 'Keluarga'
                  ? '02'
                  : '03'}
            </span>
          </>
        )}
        <span className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium">
          <Clock3 size={11} />
          {a.duration}
        </span>
      </button>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold text-teal">{a.category}</span>
        <h2 className="mt-3 text-xl leading-7 font-bold tracking-tight">
          {a.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {a.subtitle}
        </p>
        <button
          onClick={() => onOpen(a)}
          className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold hover:text-teal active:scale-95"
        >
          {a.type === 'video' ? 'Tonton video' : 'Baca selengkapnya'}
          <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}
export function GrowView({
  topic,
  setTopic,
  onOpen,
}: {
  topic: Topic;
  setTopic: (t: Topic) => void;
  onOpen: (a: Article) => void;
}) {
  const articles = useMemo(
    () => ARTICLES.filter((a) => topic === 'Semua' || a.category === topic),
    [topic],
  );
  return (
    <div className="pt-10 md:pt-14">
      <div className="flex items-start justify-between">
        <PageHeader
          eyebrow="RUANG TUMBUH"
          title="Sedikit memahami,"
          accent="selangkah lebih dekat pada diri."
          description="Bacaan ringan dan perspektif baru untuk merawat diri, memahami keluarga, dan menjalani hari dengan lebih sadar."
        />
        <Sprout
          size={80}
          strokeWidth={1}
          className="mt-6 hidden text-teal/50 md:block"
        />
      </div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Topik pembelajaran</legend>
          {TOPICS.map((t) => (
            <button
              aria-pressed={topic === t}
              key={t}
              onClick={() => setTopic(t)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-sage/25 active:scale-95 ${topic === t ? 'border-sage bg-sage/45' : 'border-teal/15 bg-white'}`}
            >
              {t}
            </button>
          ))}
        </fieldset>
        <span className="text-sm text-muted-foreground">
          {articles.length} ruang untuk belajar
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((a) => (
          <ContentCard article={a} onOpen={onOpen} key={a.id} />
        ))}
      </div>
      <p className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
        <Info size={14} />
        Konten edukasi umum. Setiap perjalanan dan kebutuhan dukungan berbeda.
      </p>
    </div>
  );
}
