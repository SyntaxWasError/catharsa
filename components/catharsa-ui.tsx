import { Leaf } from 'lucide-react';
export const moods = [
  { label: 'Kewalahan', reference: 'Overwhelmed' },
  { label: 'Murung', reference: 'Low' },
  { label: 'Netral', reference: 'Neutral' },
  { label: 'Baik', reference: 'Okay' },
  { label: 'Ringan', reference: 'Light' },
];
export const primary =
  'h-12 rounded-xl bg-sage px-6 text-sm font-semibold text-ink hover:bg-sage/80 active:scale-95';
export const secondary =
  'h-12 rounded-xl border border-teal/25 bg-transparent px-6 text-sm font-semibold text-ink hover:bg-sage/15 active:scale-95';
export function Brand() {
  return (
    <span className="flex items-center gap-2 text-[25px] font-extrabold tracking-[-1px]">
      <span className="flex size-9 items-center justify-center rounded-full bg-teal/10 text-teal">
        <Leaf size={24} strokeWidth={1.8} />
      </span>
      Catharsa<span className="-ml-2 text-teal">.</span>
    </span>
  );
}
export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <div className="mb-9 max-w-3xl">
      <p className="text-xs font-bold tracking-[0.16em] text-teal">{eyebrow}</p>
      <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] leading-[1.2] font-bold tracking-[-0.045em]">
        {title}
        <br />
        <span className="text-teal">{accent}</span>
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
