
'use client';

import { useEffect, useRef } from 'react';
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

  const menuRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;

    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements =
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);

      if (
        previouslyFocusedElement instanceof HTMLElement &&
        previouslyFocusedElement.isConnected
      ) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        ref={menuRef}
        id="mobile-navigation"
        className={styles.menu}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            width="24"
            height="24"
            aria-hidden="true"
          >
            <use href="/icons/sprite.svg#close-button" />
          </svg>
        </button>

        <nav
          className={styles.navigation}
          aria-label="Mobile main navigation"
        >
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
            <button
              type="button"
              className={styles.register}
              onClick={onClose}
            >
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
