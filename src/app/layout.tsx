import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import ToastProvider from '@/components/ToastProvider';

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.variable}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}