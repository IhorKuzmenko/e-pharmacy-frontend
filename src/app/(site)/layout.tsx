import type { ReactNode } from 'react';
import { Suspense } from 'react';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Suspense fallback={null}>
  <Header />
</Suspense>
      <main>{children}</main>
      <Footer />
    </>
  );
}