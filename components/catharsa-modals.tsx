'use client';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { type Article, type Doctor } from '@/lib/catharsa-data';
import { primary } from './catharsa-ui';
export type Message = { id: string; role: 'doctor' | 'user'; text: string };
function CloseButton() {
  return (
    <DialogClose
      className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-cream hover:bg-sage/20 active:scale-95"
      aria-label="Tutup dialog"
    >
      <X size={18} />
    </DialogClose>
  );
}

export function EmergencyModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-y-auto rounded-2xl p-6 sm:max-w-lg sm:p-8"
      >
        <CloseButton />
        <div className="flex size-12 items-center justify-center rounded-full bg-emergency/10 text-emergency">
          <HeartHandshake size={25} />
        </div>
        <DialogTitle className="pr-6 text-2xl leading-tight font-bold tracking-tight">
          Kamu tidak harus menghadapi ini sendirian.
        </DialogTitle>
        <DialogDescription className="text-base leading-7">
          Jika ada bahaya langsung atau kamu mungkin menyakiti diri, hubungi
          119, datangi IGD terdekat, atau minta orang tepercaya untuk
          menemanimu.
        </DialogDescription>
        <a
          href="tel:119"
          className="flex items-center justify-between rounded-xl bg-emergency px-5 py-4 text-ink hover:opacity-90 active:scale-95"
        >
          <span>
            <strong className="block text-lg">Darurat medis · 119</strong>
            <span className="mt-1 block text-sm">
              Pusat panggilan darurat 24 jam
            </span>
          </span>
          <Phone size={22} />
        </a>
        <div className="rounded-xl border border-teal/20 bg-cream p-5">
          <h3 className="font-bold">Healing119 · Dukungan psikologis</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Telepon 119 lalu pilih ekstensi 8, atau akses pilihan panggilan dan
            chat di situs resmi. Jika belum tersambung, coba kanal lainnya.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="tel:119"
              className="flex items-center gap-2 rounded-lg border border-teal/20 bg-white px-3 py-2 text-sm font-semibold hover:bg-sage/15"
            >
              <Phone size={14} />
              119, ekstensi 8
            </a>
            <a
              href="https://healing119.id"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-sage px-3 py-2 text-sm font-semibold hover:bg-sage/80"
            >
              Buka Healing119
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Catharsa tidak menyediakan layanan darurat. Jam layanan dan
          ketersediaan konselor mengikuti penyedia. Sumber:{' '}
          <a
            className="underline hover:text-teal"
            href="https://www.kemkes.go.id/id/layanan-119-terobosan-baru-layanan-kegawatdaruratan-medik-di-indonesia"
            target="_blank"
            rel="noreferrer"
          >
            Kemenkes · 119
          </a>{' '}
          dan{' '}
          <a
            className="underline hover:text-teal"
            href="https://kesprimkom.kemkes.go.id/konten/127/151/0/cegah-bunuh-diri-dukung-kesehatan-jiwa-kenali-layanan-healing119-id"
            target="_blank"
            rel="noreferrer"
          >
            Healing119
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}

export function ArticleModal({
  article,
  close,
}: {
  article: Article | null;
  close: () => void;
}) {
  const [play, setPlay] = useState(false);
  return (
    <Dialog
      open={!!article}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-y-auto rounded-2xl p-6 sm:max-w-2xl sm:p-9"
      >
        <CloseButton />
        {article && (
          <>
            <span className="text-xs font-bold tracking-widest text-teal">
              {article.category.toUpperCase()} · {article.duration}
            </span>
            <DialogTitle className="mt-1 pr-6 text-3xl leading-tight font-bold tracking-tight">
              {article.title}
            </DialogTitle>
            <DialogDescription className="text-base leading-7">
              {article.subtitle}
            </DialogDescription>
            {article.type === 'video' && (
              <div className="my-2">
                {play ? (
                  <iframe
                    className="aspect-video w-full rounded-xl"
                    title="WHO: Doing What Matters in Times of Stress"
                    src={`https://www.youtube-nocookie.com/embed/${article.videoId}?autoplay=1`}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <div className="rounded-xl bg-cream p-6 text-center">
                    <MessageCircle className="mx-auto mb-3 text-teal" />
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">
                      Pemutar YouTube dimuat setelah kamu menekan putar. YouTube
                      menerima data koneksi saat video dimuat.
                    </p>
                    <Button className={primary} onClick={() => setPlay(true)}>
                      Putar video WHO
                    </Button>
                  </div>
                )}
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-teal underline"
                >
                  Jika pemutar tidak tersedia, buka di YouTube
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
            <div className="space-y-5 py-3 text-base leading-8 text-muted-foreground">
              {article.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="border-t border-teal/15 pt-5 text-xs leading-6 text-muted-foreground">
              {article.sourceUrl ? (
                <a
                  className="inline-flex items-center gap-1 underline hover:text-teal"
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {article.source}
                  <ExternalLink size={12} />
                </a>
              ) : (
                article.source
              )}
              <p>
                Untuk edukasi dan refleksi umum, bukan diagnosis atau terapi.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChatPanel({
  doctor,
  messages,
  typing,
  sendMessage,
  emergency,
}: {
  doctor: Doctor;
  messages: Message[];
  typing: boolean;
  sendMessage: (id: string, text: string) => void;
  emergency: () => void;
}) {
  const [input, setInput] = useState('');
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!typing && messages.length > 1) field.current?.focus();
  }, [typing, messages.length]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, typing]);
  function send(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    sendMessage(doctor.id, text);
    setInput('');
  }
  return (
    <>
      <div className="border-b border-teal/15 px-5 py-5 pr-14 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sage/25 font-semibold text-teal">
            {doctor.initials}
          </span>
          <div>
            <DialogTitle className="text-lg font-bold">
              {doctor.name}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs">
              {doctor.credential} · Profil demo
            </DialogDescription>
          </div>
        </div>
      </div>
      <div className="mx-5 flex gap-2 rounded-xl bg-sage/15 p-3 text-xs leading-5 text-muted-foreground">
        <LockKeyhole size={14} className="mt-0.5 shrink-0" />
        <p>
          Simulasi percakapan otomatis. Tidak terhubung dengan psikolog dan
          tidak dipantau. Pesan hanya ada selama sesi browser ini.
        </p>
      </div>
      <div
        ref={log}
        role="log"
        aria-live="polite"
        aria-label="Percakapan simulasi"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-2 sm:px-7"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[87%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'rounded-br-sm bg-sage/45' : 'rounded-bl-sm bg-cream'}`}
            >
              <p className="mb-1 text-[10px] font-semibold text-teal">
                {m.role === 'user' ? 'Kamu' : `${doctor.name} · Simulasi`}
              </p>
              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                {m.text}
              </p>
              {m.role === 'user' && (
                <Check size={12} className="mt-1 ml-auto text-teal" />
              )}
            </div>
          </div>
        ))}
        {typing && (
          <output className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="animate-pulse">● ● ●</span>Menyiapkan balasan...
          </output>
        )}
      </div>
      <form onSubmit={send} className="border-t border-teal/15 p-4">
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="chat-message">
            Tulis pesan
          </label>
          <input
            ref={field}
            id="chat-message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={2000}
            placeholder="Ceritakan apa yang kamu rasakan..."
            className="h-12 min-w-0 flex-1 rounded-xl border border-teal/15 bg-cream px-4 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.nativeEvent.isComposing)
                e.preventDefault();
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || typing}
            aria-label="Kirim pesan"
            className={`${primary} w-12 shrink-0 px-0`}
          >
            <Send size={18} />
          </Button>
        </div>
        <button
          type="button"
          onClick={emergency}
          className="mt-3 block w-full text-center text-xs text-muted-foreground underline hover:text-teal"
        >
          Butuh bantuan segera? Buka layanan darurat
        </button>
      </form>
    </>
  );
}
export function ChatModal({
  doctor,
  close,
  conversations,
  pending,
  sendMessage,
  emergency,
}: {
  doctor: Doctor | null;
  close: () => void;
  conversations: Record<string, Message[]>;
  pending: Record<string, boolean>;
  sendMessage: (id: string, text: string) => void;
  emergency: () => void;
}) {
  return (
    <Dialog
      open={!!doctor}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[min(720px,90dvh)] flex-col gap-4 overflow-hidden rounded-2xl p-0 sm:max-w-xl"
      >
        <CloseButton />
        {doctor && (
          <ChatPanel
            key={doctor.id}
            doctor={doctor}
            messages={conversations[doctor.id] ?? []}
            typing={!!pending[doctor.id]}
            sendMessage={sendMessage}
            emergency={emergency}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
