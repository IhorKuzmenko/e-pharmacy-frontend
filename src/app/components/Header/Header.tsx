
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import MobileMenu from '../MobileMenu/MobileMenu';
import styles from './Header.module.css';

const navigation = [
  { href: '/home', label: 'Home' },
  { href: '/medicine-store', label: 'Medicine store' },
  { href: '/medicine', label: 'Medicine' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = pathname === '/home';

  // Временно: до подключения авторизации и корзины.
  const isAuthenticated = false;
  const cartCount = 0;

  return (
    <>
      <header
        className={`${styles.header} ${isHome ? styles.home : styles.light}`}
      >
        <div className={`container ${styles.inner}`}>
          <Link href="/home" className={styles.logo}>
            <Image
              src={
                isHome
                  ? '/images/logo-white.webp'
                  : '/images/logo.webp'
              }
              alt="E-Pharmacy"
              width={172}
              height={40}
              priority
            />
          </Link>

          <nav className={styles.navigation} aria-label="Main navigation">
            {navigation.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href === '/medicine' &&
                  pathname.startsWith('/medicine/'));

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`${styles.navLink} ${
                    active ? styles.active : ''
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            {isAuthenticated && (
              <Link
                href="/cart"
                className={styles.cart}
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <svg width="16" height="16" aria-hidden="true">
                  <use href="/icons/sprite.svg#shopping-cart" />
                </svg>
                <span className={styles.cartCount}>{cartCount}</span>
              </Link>
            )}

            <div className={styles.auth}>
              {isAuthenticated ? (
                <button className={styles.register} type="button">
                  Log out
                </button>
              ) : (
                <>
                  <Link href="/register" className={styles.register}>
                    Register
                  </Link>
                  <Link href="/login" className={styles.login}>
                    Login
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
