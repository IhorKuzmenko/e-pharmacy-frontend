
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './MobileMenu.module.css';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
};

const navigation = [
  { href: '/home', label: 'Home' },
  { href: '/medicine-store', label: 'Medicine store' },
  { href: '/medicine', label: 'Medicine' },
];

export default function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
}: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <aside
        id="mobile-navigation"
        className={styles.menu}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close menu"
          autoFocus
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#close-button" />
          </svg>
        </button>

        <nav className={styles.navigation}>
          {navigation.map(({ href, label }) => {
            const active =
              pathname === href ||
              (href === '/medicine' &&
                pathname.startsWith('/medicine/'));

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
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

        <div className={styles.auth}>
          {isAuthenticated ? (
            <button type="button" className={styles.register}>
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/register"
                onClick={onClose}
                className={styles.register}
              >
                Register
              </Link>
              <Link
                href="/login"
                onClick={onClose}
                className={styles.login}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
