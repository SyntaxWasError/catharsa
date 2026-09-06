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
  Heart,
  House,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Phone,
  Sprout,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Brand, moods, primary, secondary } from '@/components/catharsa-ui';
import { ConsultView, TrackView, GrowView } from '@/components/catharsa-views';
import {
  ArticleModal,
  ChatModal,
  EmergencyModal,
  type Message,
} from '@/components/catharsa-modals';
import { type Article, type Doctor, type Topic } from '@/lib/catharsa-data';
import {
  analyzeJournal,
  chatReply,
  dateKey,
  fallbackRecords,
  parseRecords,
  saveDaily,
  STORAGE_KEY,
  type MoodRecord,
  type Insight,
} from '@/lib/catharsa-model';
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
      <section className="grid items-center gap-10 pt-5 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-9">
        <div className="max-w-xl py-3">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal/15 bg-white/70 px-3.5 py-2 text-xs font-semibold tracking-wide text-teal">
            <span className="size-1.5 rounded-full bg-teal" />
            RUANG AMAN, UNTUK SETIAP CERITA
          </span>
          <h1 className="text-[clamp(2.55rem,4.6vw,4rem)] leading-[1.16] font-bold tracking-[-0.055em]">
            Langkah Nyata
            <br />
            Merawat Mental,
            <br />
            <span className="text-teal">
              Tanpa Rasa
              <br className="hidden lg:block" /> Canggung.
            </span>
          </h1>
          <p className="mt-6 max-w-[470px] text-base leading-7 text-muted-foreground">
            Untuk kamu yang sedang mencari arah, atau orang tua yang ingin lebih
            memahami. Di sini, kamu boleh menjadi diri sendiri.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className={primary} onClick={() => navigate('consult')}>
              Cari Psikolog <ArrowRight className="ml-2" size={17} />
            </Button>
            <Button className={secondary} onClick={() => navigate('track')}>
              <BookHeart size={17} />
              Mulai Jurnal
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole size={14} className="text-teal" />
            Cerita di jurnalmu tersimpan di perangkat ini.
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-[560px] pb-5 pl-3 md:pl-5">
          <div className="relative h-[340px] overflow-hidden rounded-[110px_24px_24px_24px] sm:h-[460px] lg:h-[520px]">
            <Image
              width={1254}
              height={1254}
              priority
              unoptimized
              src="/forest.png"
              alt="Jalan setapak tenang di antara pepohonan dan pakis yang disinari matahari"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <span className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur">
              <Leaf size={22} />
            </span>
            <p className="absolute right-7 bottom-28 left-8 text-lg leading-7 sm:bottom-20 sm:text-2xl sm:leading-relaxed font-medium tracking-tight text-white">
              Tidak harus kuat setiap hari.
              <br />
              Kamu hanya perlu memulai.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 flex items-center gap-3 rounded-2xl border border-teal/10 bg-white p-4 pr-7 shadow-lg shadow-ink/5">
            <span className="flex size-11 items-center justify-center rounded-full bg-sage/25 text-teal">
              <Heart size={21} />
            </span>
            <div>
              <p className="text-sm font-bold">Pelan-pelan juga sampai.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Satu langkah kecil untuk dirimu.
              </p>
            </div>
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
                aria-pressed={mood === i + 1}
                onClick={() => setMood(i + 1)}
                className={`rounded-xl border px-1 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-sage/15 active:scale-95 ${mood === i + 1 ? 'border-teal bg-sage/20 shadow-sm' : 'border-transparent'}`}
              >
                <span className="block text-3xl sm:text-4xl">{m.emoji}</span>
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
  const [insight, setInsight] = useState<Insight | null>(null);
  const [storageError, setStorageError] = useState('');
  const [topic, setTopic] = useState<Topic>('Semua');
  const [article, setArticle] = useState<Article | null>(null);
  const [emergency, setEmergency] = useState(false);
  const [toast, setToast] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (saveTimer.current) clearTimeout(saveTimer.current);
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
    }
  }
  function writeJournal(value: string) {
    if (!saving) {
      setJournal(value);
      setDirty(true);
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
  function save(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mood === null || saving || !ready) return;
    setSaving(true);
    const rating = mood;
    const writing = journal;
    saveTimer.current = setTimeout(() => {
      const next = saveDaily(
        records,
        rating,
        writing,
        new Date(`${draftDate}T12:00:00`),
      );
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setStorageError('');
        setDirty(false);
        setToast(
          `Catatan ${new Date(`${draftDate}T12:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} tersimpan. Terima kasih sudah merawat dirimu.`,
        );
      } catch {
        setStorageError(
          'Belum tersimpan ke browser. Penyimpanan penuh atau dinonaktifkan; catatan hanya tersedia selama halaman ini terbuka.',
        );
      }
      setRecords(next);
      setInsight(analyzeJournal(rating, writing));
      setSaving(false);
    }, 1200);
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
            storageError={storageError}
            draftDate={draftDate}
            today={today}
            navigate={navigate}
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
