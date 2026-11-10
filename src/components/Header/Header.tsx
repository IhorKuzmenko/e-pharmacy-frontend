
'use client';

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import MobileMenu from '../MobileMenu/MobileMenu';
import { getCart } from '@/lib/cart';

import styles from './Header.module.css';

const navigation = [
  { href: '/home', label: 'Home' },
  { href: '/medicine-store', label: 'Medicine store' },
  { href: '/medicine', label: 'Medicine' },
];

const TOKEN_KEY = 'e-pharmacy-token';
const CART_EVENT = 'e-pharmacy-cart-updated';
const AUTH_EVENT = 'e-pharmacy-auth-changed';

function subscribeToAuth(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getAuthSnapshot(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

function getServerAuthSnapshot(): null {
  return null;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const token = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  const isAuthenticated = Boolean(token);

  const [menuOpenOnPath, setMenuOpenOnPath] = useState<
    string | null
  >(null);

  const [cartState, setCartState] = useState<{
    token: string | null;
    count: number;
  }>({
    token: null,
    count: 0,
  });

  const cartCount =
    cartState.token === token ? cartState.count : 0;

  const isMenuOpen = menuOpenOnPath === pathname;
  const isHome = pathname === '/home';

  const handleCloseMenu = useCallback(() => {
    setMenuOpenOnPath(null);
  }, []);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadCart() {
      try {
        const cart = await getCart();

        if (
          cancelled ||
          sessionStorage.getItem(TOKEN_KEY) !== token
        ) {
          return;
        }

        setCartState({
          token,
          count: cart.totalQuantity,
        });
      } catch (error) {
        if (cancelled) return;

        console.error('Failed to load cart:', error);

        const message =
          error instanceof Error ? error.message : '';

        if (
          /invalid or expired token|token has been revoked|authorization token is missing|user not found/i.test(
            message
          )
        ) {
          if (sessionStorage.getItem(TOKEN_KEY) === token) {
            sessionStorage.removeItem(TOKEN_KEY);
            window.dispatchEvent(new Event(AUTH_EVENT));
          }
        } else {
          setCartState({
            token,
            count: 0,
          });
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const handleCartUpdated = (event: Event) => {
      const currentToken = sessionStorage.getItem(TOKEN_KEY);

      if (!currentToken) return;

      const customEvent = event as CustomEvent<{
        totalQuantity?: number;
      }>;

      const quantity = customEvent.detail?.totalQuantity;

      if (
        typeof quantity === 'number' &&
        Number.isFinite(quantity)
      ) {
        setCartState({
          token: currentToken,
          count: quantity,
        });
      }
    };

    window.addEventListener(CART_EVENT, handleCartUpdated);

    return () => {
      window.removeEventListener(
        CART_EVENT,
        handleCartUpdated
      );
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);

    setCartState({
      token: null,
      count: 0,
    });

    handleCloseMenu();

    window.dispatchEvent(new Event(AUTH_EVENT));

    toast.success('Logged out successfully');

    router.push('/home');
    router.refresh();
  };

  return (
    <>
      <header
        className={`${styles.header} ${
          isHome ? styles.home : styles.light
        }`}
      >
        <div className={`container ${styles.inner}`}>
          <Link
            href="/home"
            className={styles.logo}
            aria-label="E-Pharmacy home"
          >
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

          <nav
            className={styles.navigation}
            aria-label="Main navigation"
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
                  aria-current={
                    active ? 'page' : undefined
                  }
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
                <svg
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <use href="/icons/sprite.svg#shopping-cart" />
                </svg>

                <span className={styles.cartCount}>
                  {cartCount}
                </span>
              </Link>
            )}

            <div className={styles.auth}>
              {isAuthenticated ? (
                <button
                  className={styles.register}
                  type="button"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/register"
                    className={styles.register}
                  >
                    Register
                  </Link>

                  <Link
                    href="/login"
                    className={styles.login}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className={styles.menuButton}
              onClick={() =>
                setMenuOpenOnPath(pathname)
              }
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
        onClose={handleCloseMenu}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
