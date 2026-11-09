
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './AuthLayout.module.css';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <Link
          href="/home"
          className={styles.logo}
          aria-label="E-Pharmacy home"
        >
          <Image
            src="/images/logo.webp"
            alt="E-Pharmacy"
            width={172}
            height={40}
            className={styles.logoImage}
            priority
          />
        </Link>

        <div className={styles.content}>
          <div className={styles.hero}>
            <Image
              src="/images/tablet.webp"
              alt=""
              width={180}
              height={180}
              className={styles.tablet}
              priority
            />

            <h1 className={styles.title}>
              Your medication,
              <br />
              delivered Say goodbye
              <br />
              to all{' '}
              <span className={styles.accent}>
                your healthcare
              </span>
              <br />
              worries with us
            </h1>
          </div>

          <div className={styles.formContainer}>
            {children}
          </div>
        </div>

        <Image
          src="/images/elements.webp"
          alt=""
          width={400}
          height={400}
          className={styles.elements}
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
