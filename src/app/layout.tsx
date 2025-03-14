import type { Metadata } from 'next';
import Header from '@/components/Header';
import '../styles/globals.css';

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
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Header />
        {children}
      </body>
    </html>
  );
}
