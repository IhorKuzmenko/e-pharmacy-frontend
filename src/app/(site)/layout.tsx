
import type { ReactNode } from 'react';
import { Suspense } from 'react';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

import { AuthModalProvider } from '@/components/AuthModal/AuthModalProvider';

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthModalProvider>
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      {children}

      <Footer />
    </AuthModalProvider>
  );
}
