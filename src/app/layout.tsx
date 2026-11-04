import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import 'modern-normalize/modern-normalize.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'E-Pharmacy',
  description: 'Your online pharmacy for medicines and healthcare products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
