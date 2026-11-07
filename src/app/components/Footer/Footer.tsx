
import Image from 'next/image';
import Link from 'next/link';

import styles from './Footer.module.css';

const navigation = [
  { href: '/home', label: 'Home' },
  { href: '/medicine-store', label: 'Medicine store' },
  { href: '/medicine', label: 'Medicine' },
];

const socials = [
  {
    name: 'Facebook',
    icon: 'facebook',
    href: 'https://www.facebook.com/',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    href: 'https://www.instagram.com/',
  },
  {
    name: 'YouTube',
    icon: 'youtube',
    href: 'https://www.youtube.com/',
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link
              href="/home"
              className={styles.logo}
              aria-label="E-Pharmacy home"
            >
              <Image
                src="/images/logo-white.webp"
                alt="E-Pharmacy"
                width={172}
                height={40}
              />
            </Link>

            <p className={styles.description}>
              Get the medicine to help you feel better,
              get back to your active life, and enjoy
              every moment.
            </p>
          </div>

          <nav
            className={styles.navigation}
            aria-label="Footer navigation"
          >
            {navigation.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={styles.navLink}
              >
                {label}
              </Link>
            ))}
          </nav>

          <ul className={styles.socials}>
            {socials.map(({ name, icon, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                >
                  <svg
                    width="44"
                    height="44"
                    aria-hidden="true"
                  >
                    <use href={`/icons/sprite.svg#${icon}`} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © E-Pharmacy 2023. All Rights Reserved
          </p>

          <span className={styles.separator} aria-hidden="true">
            |
          </span>

          <span className={styles.legal}>
            Privacy Policy
          </span>

          <span className={styles.separator} aria-hidden="true">
            |
          </span>

          <span className={styles.legal}>
            Terms &amp; Conditions
          </span>
        </div>
      </div>
    </footer>
  );
}
