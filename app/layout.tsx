import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { FigmaCapture } from '@/components/figma-capture';
import './globals.css';
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Catharsa — Ruang aman untuk setiap cerita',
  description:
    'Temukan teman cerita, kenali perasaanmu melalui jurnal, dan bertumbuh bersama Catharsa.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${jakarta.className} ${jakarta.variable} ${cormorant.variable}`}
      >
        {children}
        <FigmaCapture />
      </body>
    </html>
  );
}
