'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookHeart,
  CheckCircle2,
  House,
  Leaf,
  MessageCircle,
  Phone,
  Sprout,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Brand, moods } from '@/components/catharsa-ui';
import { MoodSprout } from '@/components/mood-sprout';
import { ConsultView, TrackView, GrowView } from '@/components/catharsa-views';
import {
  ArticleModal,
  ChatModal,
  EmergencyModal,
  type Message,
} from '@/components/catharsa-modals';
import { type Article, type Doctor, type Topic } from '@/lib/catharsa-data';
import {
  chatReply,
  dateKey,
  fallbackRecords,
  parseRecords,
  saveDaily,
  STORAGE_KEY,
  type MoodRecord,
} from '@/lib/catharsa-model';
import { requestMentalAnalysis } from '@/lib/mental-analysis-client';
import { type MentalAnalysis } from '@/lib/mental-analysis';
const links = [
  { id: 'home', label: 'Beranda', short: 'Beranda', icon: House },
  {
    id: 'consult',
    label: 'CatharsaConsult',
    short: 'Konsultasi',
    icon: MessageCircle,
  },
  { id: 'track', label: 'CatharsaTrack', short: 'Jurnal', icon: BookHeart },
  { id: 'grow', label: 'Ruang Tumbuh', short: 'Tumbuh', icon: Sprout },
];
const features = [
  {
    id: 'consult',
    icon: MessageCircle,
    title: 'CatharsaConsult',
    eyebrow: 'RUANG UNTUK DIDENGAR',
    description:
      'Temukan psikolog yang cocok. Kenali keahliannya, lihat jadwal dan biaya sejak awal.',
    action: 'Temukan teman cerita',
  },
  {
    id: 'track',
    icon: BookHeart,
    title: 'CatharsaTrack',
    eyebrow: 'KENALI DIRIMU, PELAN-PELAN',
    description:
      'Tuangkan isi hati dan pahami pola perasaanmu. Satu catatan kecil setiap hari.',
    action: 'Mulai menulis jurnal',
  },
  {
    id: 'grow',
    icon: Sprout,
    title: 'Ruang Tumbuh',
    eyebrow: 'BERTUMBUH BERSAMA',
    description:
      'Perspektif baru untuk dirimu dan keluarga. Belajar merawat mental tanpa menghakimi.',
    action: 'Jelajahi ruang tumbuh',
  },
];

export function HomeView({
  mood,
  setMood,
  navigate,
}: {
  mood: number | null;
  setMood: (n: number) => void;
  navigate: (v: string) => void;
}) {
  return (
    <div className="space-y-14 md:space-y-20">
      <section className="mt-5 grid min-h-[650px] overflow-hidden rounded-[1.75rem] border border-teal/15 bg-white shadow-sm lg:mt-9 lg:grid-cols-[1.03fr_.97fr]">
        <div className="relative min-h-[430px] overflow-hidden lg:min-h-[650px]">
          <Image
            width={1122}
            height={1402}
            priority
            unoptimized
            src="/sanctuary-walk.png"
            alt="Seseorang berjalan pelan menuju lengkung taman yang teduh dan hangat"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/5" />
          <div className="absolute top-5 right-5 left-5 flex items-center justify-between text-[10px] font-semibold tracking-[0.18em] text-white sm:top-7 sm:right-7 sm:left-7">
            <span className="flex items-center gap-2">
              <Leaf size={15} /> SAFE SANCTUARY
            </span>
            <span>EST. 2026</span>
          </div>
          <div className="absolute right-5 bottom-5 left-5 flex max-w-sm items-center gap-4 rounded-2xl border border-white/25 bg-cream/92 p-4 text-ink shadow-xl backdrop-blur-sm sm:right-auto sm:bottom-7 sm:left-7 sm:p-5">
            <span
              aria-hidden="true"
              className="font-editorial text-[5.25rem] leading-[.65] text-teal"
            >
              E
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-teal">
                EKSPLORASI RUANG BATIN
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Pelan-pelan mengenali apa yang ada di dalam diri.
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[570px] flex-col overflow-hidden bg-teal px-6 py-8 text-cream sm:px-10 sm:py-10 lg:min-h-[650px] lg:px-12 xl:px-16">
          <div className="flex items-center justify-between border-b border-cream/25 pb-4 text-[10px] font-semibold tracking-[0.16em]">
            <span>MERASA / BERCERITA / BERTUMBUH</span>
            <span>01 — BERANDA</span>
          </div>
          <div className="my-auto py-10">
            <p className="mb-6 text-xs font-semibold tracking-[0.2em] text-cream/75">
              RUANG AMAN, UNTUK SETIAP CERITA
            </p>
            <h1 className="font-editorial text-[clamp(3.15rem,5.4vw,5.5rem)] leading-[0.91] font-medium tracking-[-0.045em]">
              Langkah Nyata
              <br />
              Merawat Mental,
              <br />
              <span className="italic">Tanpa Rasa Canggung.</span>
            </h1>
            <p className="mt-8 max-w-[33rem] text-sm leading-7 text-cream/85 sm:text-base">
              Untuk kamu yang sedang mencari arah, atau orang tua yang ingin
              lebih memahami. Di sini, setiap emosi mendapat tempat untuk
              bernapas.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                className="h-12 rounded-full border border-cream/70 bg-transparent px-6 text-sm font-semibold text-cream hover:bg-cream hover:text-teal active:scale-95"
                onClick={() => navigate('consult')}
              >
                Cari Psikolog <ArrowRight className="ml-2" size={17} />
              </Button>
              <Button
                className="h-12 rounded-full bg-cream px-6 text-sm font-semibold text-teal hover:bg-cream/85 active:scale-95"
                onClick={() => navigate('track')}
              >
                <BookHeart size={17} /> Mulai Jurnal
              </Button>
            </div>
          </div>
          <div className="relative border-t border-cream/25 pt-5 pl-16">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-0 font-editorial text-[5.6rem] leading-none text-cream/15"
            >
              E
            </span>
            <p className="max-w-md text-xs leading-5 text-cream/80">
              Emosi tidak harus dijelaskan dengan sempurna. Satu langkah kecil
              sudah cukup untuk memulai.
            </p>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="quick-check-title"
        className="grid items-center gap-6 rounded-2xl border border-teal/15 bg-white px-5 py-7 shadow-sm md:grid-cols-[1fr_1.35fr] md:px-8"
      >
        <div>
          <span className="text-xs font-bold tracking-[0.14em] text-teal">
            SEJENAK UNTUK DIRIMU
          </span>
          <h2
            id="quick-check-title"
            className="mt-2 text-xl font-bold tracking-tight"
          >
            Bagaimana perasaanmu hari ini?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Apa pun rasanya, semua perasaanmu valid.
          </p>
        </div>
        <div>
          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {moods.map((m, i) => (
              <button
                key={m.label}
                aria-label={`${i + 1} dari 5, ${m.label}, ${m.reference}`}
                aria-pressed={mood === i + 1}
                onClick={() => setMood(i + 1)}
                className={`rounded-xl border px-1 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-sage/15 active:scale-95 ${mood === i + 1 ? 'border-teal bg-sage/20 shadow-sm' : 'border-transparent'}`}
              >
                <MoodSprout
                  level={i + 1}
                  className="mx-auto size-12 sm:size-16"
                />
                <span className="mt-2 block text-[11px] sm:text-xs">
                  {m.label}
                </span>
              </button>
            ))}
          </div>
          {mood && (
            <button
              onClick={() => navigate('track')}
              className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-teal hover:underline"
            >
              {mood < 3
                ? 'Hari yang berat? Ceritakan di jurnalmu.'
                : 'Simpan momen ini di jurnalmu.'}
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </section>
      <section>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-teal">
              SETIAP LANGKAH BERARTI
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
              Ruang untuk merasa lebih baik.
            </h2>
          </div>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            Mulai dari yang kamu butuhkan <ArrowDown size={16} />
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <button
              onClick={() => navigate(f.id)}
              key={f.id}
              className={`group rounded-2xl border border-teal/15 p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 ${i === 1 ? 'bg-sage/20' : 'bg-white'}`}
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-sage/25 text-teal">
                  <f.icon size={25} strokeWidth={1.5} />
                </span>
                <span className="text-sm text-teal/50">0{i + 1}</span>
              </div>
              <p className="text-[10px] font-semibold tracking-widest text-teal">
                {f.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {f.description}
              </p>
              <p className="mt-7 flex items-center justify-between text-sm font-semibold">
                {f.action}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Catharsa() {
  const [mood, setMood] = useState<number | null>(null);
  const [today, setToday] = useState(dateKey());
  const [draftDate, setDraftDate] = useState(dateKey());
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const chatTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [view, setView] = useState('home');
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('Semua');
  const [sort, setSort] = useState('availability');
  const [reminded, setReminded] = useState<string[]>([]);
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(
    {},
  );
  const [journal, setJournal] = useState('');
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [insight, setInsight] = useState<MentalAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [topic, setTopic] = useState<Topic>('Semua');
  const [article, setArticle] = useState<Article | null>(null);
  const [emergency, setEmergency] = useState(false);
  const [toast, setToast] = useState('');
  const analysisRequest = useRef<AbortController | null>(null);
  const analysisSequence = useRef(0);
  const main = useRef<HTMLElement>(null);

  const navigate = useCallback((next: string, filter?: Topic) => {
    if (!links.some((l) => l.id === next)) return;
    setView(next);
    if (filter) setTopic(filter);
    const url = new URL(window.location.href);
    url.searchParams.set('view', next);
    if (window.location.search !== url.search)
      window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  useEffect(() => {
    function readView() {
      const next = new URLSearchParams(window.location.search).get('view');
      if (next && links.some((l) => l.id === next)) setView(next);
      else setView('home');
    }
    const activeChatTimers = chatTimers.current;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      readView();
    });
    window.addEventListener('popstate', readView);
    queueMicrotask(() => {
      if (!active) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const loaded = raw === null ? fallbackRecords() : parseRecords(raw);
        setRecords(loaded);
        const today = loaded.find((r) => r.date === dateKey() && !r.demo);
        if (today) {
          setMood(today.score);
          setJournal(today.journal);
        }
      } catch {
        setRecords(fallbackRecords());
        setStorageError(
          'Catatan tersimpan tidak dapat dibaca. Data contoh ditampilkan; catatan baru belum tersimpan.',
        );
      }
      setReady(true);
    });
    return () => {
      active = false;
      window.removeEventListener('popstate', readView);
      analysisSequence.current += 1;
      analysisRequest.current?.abort();
      Object.values(activeChatTimers).forEach(clearTimeout);
    };
  }, []);
  useEffect(() => {
    const checkDay = () => setToday(dateKey());
    const id = setInterval(checkDay, 30000);
    window.addEventListener('focus', checkDay);
    document.addEventListener('visibilitychange', checkDay);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', checkDay);
      document.removeEventListener('visibilitychange', checkDay);
    };
  }, []);
  useEffect(() => {
    if (!ready || dirty || saving) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const entry = records.find((r) => r.date === today && !r.demo);
      setDraftDate(today);
      setMood(entry?.score ?? null);
      setJournal(entry?.journal ?? '');
    });
    return () => {
      active = false;
    };
  }, [today, ready, dirty, saving, records]);
  function chooseMood(value: number) {
    if (!saving) {
      setMood(value);
      setDirty(true);
      setInsight(null);
      setAnalysisError('');
    }
  }
  function writeJournal(value: string) {
    if (!saving) {
      setJournal(value);
      setDirty(true);
      setInsight(null);
      setAnalysisError('');
    }
  }
  function sendChat(id: string, text: string) {
    if (chatTimers.current[id] || !text.trim()) return;
    setConversations((all) => ({
      ...all,
      [id]: [
        ...(all[id] ?? []),
        { id: crypto.randomUUID(), role: 'user', text },
      ],
    }));
    setPending((all) => ({ ...all, [id]: true }));
    chatTimers.current[id] = setTimeout(() => {
      setConversations((all) => ({
        ...all,
        [id]: [
          ...(all[id] ?? []),
          { id: crypto.randomUUID(), role: 'doctor', text: chatReply(text) },
        ],
      }));
      setPending((all) => ({ ...all, [id]: false }));
      delete chatTimers.current[id];
    }, 1500);
  }
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 6500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const registration = {
      name: 'navigate_catharsa',
      title: 'Buka ruang Catharsa',
      description:
        'Navigate to a Catharsa view. Does not save a journal or start a consultation.',
      inputSchema: {
        type: 'object',
        properties: {
          view: { type: 'string', enum: ['home', 'consult', 'track', 'grow'] },
        },
        required: ['view'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input: unknown) => {
        const value = input as { view?: unknown };
        if (
          !value ||
          typeof value.view !== 'string' ||
          !links.some((l) => l.id === value.view) ||
          Object.keys(value).some((k) => k !== 'view')
        )
          throw new Error('Unknown Catharsa view.');
        navigate(value.view);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        return { view: value.view, status: 'opened' };
      },
    };
    try {
      Promise.resolve(
        context.registerTool(registration, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {
      /* Optional API unsupported in this browser. */
    }
    return () => lifecycle.abort();
  }, [navigate]);
  async function save(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mood === null || saving || !ready) return;
    setSaving(true);
    setAnalysisError('');
    setInsight(null);
    const rating = mood;
    const writing = journal;
    const entryDate = new Date(`${draftDate}T12:00:00`);
    const next = saveDaily(records, rating, writing, entryDate);
    setRecords(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError('');
      setDirty(false);
      setToast(
        `Catatan ${entryDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} tersimpan. Analisis step-care sedang disiapkan.`,
      );
    } catch {
      setStorageError(
        'Belum tersimpan ke browser. Penyimpanan penuh atau dinonaktifkan; catatan hanya tersedia selama halaman ini terbuka.',
      );
    }

    analysisRequest.current?.abort();
    const controller = new AbortController();
    analysisRequest.current = controller;
    const sequence = ++analysisSequence.current;

    try {
      const result = await requestMentalAnalysis(
        { moodSlider: rating, journalText: writing },
        { signal: controller.signal },
      );
      if (sequence === analysisSequence.current) setInsight(result);
    } catch (error) {
      if (controller.signal.aborted) return;
      if (sequence === analysisSequence.current) {
        setAnalysisError(
          error instanceof Error
            ? error.message
            : 'Analisis belum dapat diproses. Silakan coba lagi.',
        );
      }
    } finally {
      if (sequence === analysisSequence.current) {
        setSaving(false);
        analysisRequest.current = null;
      }
    }
  }
  function openLearning(nextTopic: Topic) {
    setTopic(nextTopic);
    navigate('grow');
  }
  function openConsult(specialty: string) {
    setQuery('');
    setTag(specialty);
    navigate('consult');
  }
  function startChat(d: Doctor) {
    setConversations((all) =>
      all[d.id]
        ? all
        : {
            ...all,
            [d.id]: [
              {
                id: `${d.id}-greeting`,
                role: 'doctor',
                text: `Halo, selamat datang. Aku ${d.name.split(' ')[0]} dalam simulasi ini. Tidak perlu terburu-buru. Apa yang ingin kamu ceritakan hari ini?`,
              },
            ],
          },
    );
    setActiveDoctor(d);
  }
  function remind(d: Doctor) {
    setReminded((ids) => (ids.includes(d.id) ? ids : [...ids, d.id]));
    setToast(
      'Kami akan mengirim notifikasi saat jadwal terbuka. (Simulasi — tidak ada notifikasi yang dikirim.)',
    );
  }
  return (
    <Tabs
      value={view}
      onValueChange={(v) => navigate(String(v))}
      className="gap-0"
    >
      <a
        href="#main-content"
        className="sr-only z-50 rounded-xl bg-white p-4 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Lewati ke konten
      </a>
      <header className="sticky top-0 z-40 border-b border-teal/10 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-3 px-5 lg:px-10">
          <button
            aria-label="Catharsa Beranda"
            className="shrink-0 active:scale-95"
            onClick={() => navigate('home')}
          >
            <Brand />
          </button>
          <TabsList
            aria-label="Navigasi utama desktop"
            className="hidden h-auto! gap-1 bg-transparent p-0 lg:flex"
          >
            {links.map((l) => (
              <TabsTrigger
                key={l.id}
                value={l.id}
                className="h-10! flex-none rounded-full px-4 py-2.5 text-[13px] text-ink data-active:bg-sage/40 data-active:shadow-none hover:bg-sage/15 active:scale-95"
              >
                {l.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            onClick={() => setEmergency(true)}
            aria-label="Hotline Darurat 24/7"
            className="h-10 shrink-0 rounded-full bg-emergency px-3 text-xs text-ink hover:bg-emergency/85 active:scale-95 sm:px-4"
          >
            <Phone size={15} />
            <span className="hidden sm:inline">Hotline Darurat 24/7</span>
          </Button>
        </div>
      </header>
      <main
        id="main-content"
        ref={main}
        tabIndex={-1}
        className="mx-auto w-full max-w-[1280px] px-5 pb-16 outline-none lg:px-10"
      >
        <TabsContent value="home">
          <HomeView mood={mood} setMood={chooseMood} navigate={navigate} />
        </TabsContent>
        <TabsContent value="consult">
          <ConsultView
            query={query}
            setQuery={setQuery}
            tag={tag}
            setTag={setTag}
            sort={sort}
            setSort={setSort}
            reminded={reminded}
            onChat={startChat}
            onRemind={remind}
          />
        </TabsContent>
        <TabsContent value="track">
          <TrackView
            mood={mood}
            setMood={chooseMood}
            journal={journal}
            setJournal={writeJournal}
            records={records}
            saving={saving}
            ready={ready}
            save={save}
            insight={insight}
            analysisError={analysisError}
            storageError={storageError}
            draftDate={draftDate}
            today={today}
            openLearning={openLearning}
            openConsult={openConsult}
            emergency={() => setEmergency(true)}
          />
        </TabsContent>
        <TabsContent value="grow">
          <GrowView topic={topic} setTopic={setTopic} onOpen={setArticle} />
        </TabsContent>
      </main>
      <footer className="border-t border-teal/15 px-5 py-7 pb-28 lg:pb-7">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <Brand />
          <p className="text-xs text-muted-foreground">
            Ruang amanmu untuk bercerita, mengenal diri, dan bertumbuh.
          </p>
          <span className="text-xs text-muted-foreground">
            © 2026 Catharsa · Prototipe interaktif
          </span>
        </div>
      </footer>
      <TabsList
        aria-label="Navigasi utama mobile"
        className="fixed right-4 bottom-4 left-4 z-40 flex h-auto! w-auto justify-around rounded-full border border-teal/15 bg-white/95 p-2 shadow-lg backdrop-blur-md lg:hidden"
      >
        {links.map((l) => (
          <TabsTrigger
            value={l.id}
            key={l.id}
            className="flex h-auto! min-w-0 flex-col items-center gap-1 rounded-full px-1 py-2 text-[10px] text-muted-foreground data-active:bg-sage/35 data-active:text-ink data-active:shadow-none active:scale-95"
          >
            <l.icon className="size-5!" />
            {l.short}
          </TabsTrigger>
        ))}
      </TabsList>
      <EmergencyModal open={emergency} setOpen={setEmergency} />
      <ChatModal
        doctor={activeDoctor}
        close={() => setActiveDoctor(null)}
        conversations={conversations}
        pending={pending}
        sendMessage={sendChat}
        emergency={() => {
          setActiveDoctor(null);
          setEmergency(true);
        }}
      />
      <ArticleModal
        key={article?.id ?? 'closed'}
        article={article}
        close={() => setArticle(null)}
      />
      {toast && (
        <output
          aria-live="polite"
          className="fixed right-5 bottom-28 left-5 z-50 flex items-start gap-3 rounded-2xl border border-teal/20 bg-white p-5 shadow-xl sm:left-auto sm:max-w-md lg:bottom-6"
        >
          <CheckCircle2 size={22} className="shrink-0 text-teal" />
          <p className="text-sm leading-6">{toast}</p>
          <button
            aria-label="Tutup notifikasi"
            onClick={() => setToast('')}
            className="shrink-0 rounded-full p-1 hover:bg-sage/20"
          >
            <X size={15} />
          </button>
        </output>
      )}
    </Tabs>
  );
}
