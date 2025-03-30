import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header';
import { SessionProvider } from '../providers/session-provider';

import '../styles/globals.css';
import { QueryProvider } from '../providers/QueryProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Bingo Millonario',
  description: 'Crea y juega juegos de bingo personalizados',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={poppins.variable} suppressHydrationWarning>
      <body className="bg-gradient-to-r from-[#1E1B4B] to-[#3B0764] text-white font-poppins w-full min-h-screen">
        <SessionProvider>
          <QueryProvider>
            <Header />
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}