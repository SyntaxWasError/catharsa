import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { FigmaCapture } from '@/components/figma-capture';
import './globals.css';
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
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
      <body className={jakarta.className}>
        {children}
        <FigmaCapture />
      </body>
    </html>
  );
}
