
import type { ReactNode } from 'react';

import styles from './SharedLayout.module.css';

type SharedLayoutProps = {
  children: ReactNode;
};

export default function SharedLayout({
  children,
}: SharedLayoutProps) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
