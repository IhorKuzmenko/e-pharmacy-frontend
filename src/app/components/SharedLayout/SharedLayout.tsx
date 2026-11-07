
import type { ReactNode } from 'react';

import Header from '../Header/Header';
import Footer from '..//Footer/Footer';

import styles from './SharedLayout.module.css';

type SharedLayoutProps = {
  children: ReactNode;
};

export default function SharedLayout({
  children,
}: SharedLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
