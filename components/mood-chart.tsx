'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartRecords, type MoodRecord } from '@/lib/catharsa-model';
import { moods } from '@/components/catharsa-ui';
import { MoodSprout } from '@/components/mood-sprout';

export function MoodChart({ records }: { records: MoodRecord[] }) {
  const data = chartRecords(records);
  const values = data.filter((item) => item.score !== null);
  const average = values.length
    ? values.reduce((sum, item) => sum + (item.score ?? 0), 0) / values.length
    : 0;

  return (
    <section className="rounded-2xl border border-teal/15 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-bold tracking-widest text-teal">
            PERJALANAN PERASAANMU
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Tujuh hari, banyak cerita.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Naik dan turun adalah bagian dari perjalanan.
          </p>
        </div>
        <span className="rounded-xl bg-sage/15 px-4 py-3 text-sm">
          <strong className="mr-1 text-xl">
            {average ? average.toFixed(1) : '—'}
          </strong>
          / 5{' '}
          <span className="ml-3 text-xs text-muted-foreground">rata-rata</span>
        </span>
      </div>
      <figure
        className="mt-8 h-[240px] min-w-0 w-full"
        aria-label={`Grafik perasaan tujuh hari. ${data.map((item) => `${item.day}: ${item.score ?? 'belum tercatat'}${item.demo ? ' contoh' : ''}`).join(', ')}`}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 0, left: -28 }}
          >
            <defs>
              <linearGradient id="sageMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A3B18A" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#A3B18A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 5"
              vertical={false}
              stroke="#DCE3D5"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#5F6D68', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#5F6D68', fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const level = Number(payload[0].value);
                const item = payload[0].payload as (typeof data)[number];
                return (
                  <div className="rounded-xl border border-teal/15 bg-white p-3 text-sm shadow-lg">
                    <p className="mb-2 text-xs text-muted-foreground">
                      {item.date}
                      {item.demo ? ' · Contoh' : ''}
                    </p>
                    <div className="flex items-center gap-2">
                      <MoodSprout level={level} className="size-9" />
                      <span>
                        {moods[level - 1]?.label} · {level}/5
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              dataKey="score"
              type="monotone"
              stroke="#588157"
              strokeWidth={3}
              fill="url(#sageMood)"
              dot={{ fill: '#FFFFFF', stroke: '#588157', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 7, fill: '#A3B18A' }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </figure>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-2 rounded-full bg-teal" />
        Skor perasaan
        {data.some((item) => item.demo) &&
          ' · Termasuk data contoh, bukan penilaian tentang dirimu.'}
      </p>
      <details className="mt-4 text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-teal">
          Lihat data sebagai tabel
        </summary>
        <table className="mt-3 w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Tanggal</th>
              <th>Skor</th>
              <th>Jenis</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.date} className="border-t border-teal/10">
                <td className="py-2">{item.date}</td>
                <td>{item.score ?? '—'}</td>
                <td>
                  {item.demo
                    ? 'Contoh'
                    : item.score
                      ? 'Catatanmu'
                      : 'Belum ada'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
