import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header';

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
    <html lang="en" className={poppins.variable}>
      <body 
        className="bg-gradient-to-r from-[#1E1B4B] to-[#3B0764] text-white font-poppins -mt-[70px]"
        suppressHydrationWarning
      >
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}