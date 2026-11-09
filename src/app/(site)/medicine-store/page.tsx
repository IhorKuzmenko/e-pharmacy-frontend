
import Image from 'next/image';
import Link from 'next/link';

import styles from './MedicineStorePage.module.css';

type StoreStatus = 'OPEN' | 'CLOSE';

type Pharmacy = {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  rating?: number | string;
  status?: string;
  isOpen?: boolean;
  is_open?: boolean;
  open?: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://e-pharmacy-backend-qndx.onrender.com/api';

/* =========================
   API
========================= */

function extractPharmacies(data: unknown): Pharmacy[] {
  if (Array.isArray(data)) {
    return data as Pharmacy[];
  }

  if (!data || typeof data !== 'object') {
    return [];
  }

  const response = data as Record<string, unknown>;

  for (const key of ['data', 'stores', 'pharmacies']) {
    const value = response[key];

    if (Array.isArray(value)) {
      return value as Pharmacy[];
    }

    if (value && typeof value === 'object') {
      const nested = value as Record<string, unknown>;

      for (const nestedKey of ['data', 'stores', 'pharmacies']) {
        if (Array.isArray(nested[nestedKey])) {
          return nested[nestedKey] as Pharmacy[];
        }
      }
    }
  }

  return [];
}

async function getPharmacies(): Promise<Pharmacy[]> {
  const response = await fetch(`${API_URL}/stores`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch pharmacies: ${response.status}`,
    );
  }

  const data: unknown = await response.json();

  return extractPharmacies(data);
}

/* =========================
   STATUS
========================= */

function getStoreStatus(
  pharmacy: Pharmacy,
  index: number,
): StoreStatus {
  if (typeof pharmacy.isOpen === 'boolean') {
    return pharmacy.isOpen ? 'OPEN' : 'CLOSE';
  }

  if (typeof pharmacy.is_open === 'boolean') {
    return pharmacy.is_open ? 'OPEN' : 'CLOSE';
  }

  if (typeof pharmacy.open === 'boolean') {
    return pharmacy.open ? 'OPEN' : 'CLOSE';
  }

  const status = pharmacy.status?.trim().toLowerCase();

  if (['open', 'opened', 'active'].includes(status ?? '')) {
    return 'OPEN';
  }

  if (['close', 'closed', 'inactive'].includes(status ?? '')) {
    return 'CLOSE';
  }

  // Demo status until the API provides real opening hours.
  return index % 3 === 2 ? 'CLOSE' : 'OPEN';
}

/* =========================
   ICONS
========================= */

function LocationIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.1 10a16 16 0 0 0 6.9 6.9l1.5-1.9a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

/* =========================
   RATING AND STATUS
========================= */

function StoreMeta({
  rating,
  status,
}: {
  rating: number | null;
  status: StoreStatus;
}) {
  return (
    <div className={styles.storeMeta}>
      {rating !== null && (
        <span
          className={styles.rating}
          aria-label={`Rating ${rating} out of 5`}
        >
          <span className={styles.star} aria-hidden="true">
            ★
          </span>
          <span>{rating}</span>
        </span>
      )}

      <span
        className={`${styles.status} ${
          status === 'OPEN'
            ? styles.statusOpen
            : styles.statusClosed
        }`}
        title="Demo status for layout preview"
      >
        {status}
      </span>
    </div>
  );
}

/* =========================
   PHARMACY CARD
========================= */

function PharmacyCard({
  pharmacy,
  index,
}: {
  pharmacy: Pharmacy;
  index: number;
}) {
  const parsedRating = Number(pharmacy.rating);

  const rating =
    pharmacy.rating !== undefined &&
    pharmacy.rating !== null &&
    Number.isFinite(parsedRating)
      ? parsedRating
      : null;

  const status = getStoreStatus(pharmacy, index);

  const address = [pharmacy.address, pharmacy.city]
    .filter(Boolean)
    .join(', ');

  const phone = pharmacy.phone?.trim();

  return (
    <article className={styles.card}>
      <Image
        src="/images/elements.webp"
        alt=""
        width={180}
        height={130}
        className={styles.decoration}
        aria-hidden="true"
      />

      <div className={styles.cardContent}>
        <div className={styles.cardHeading}>
          <h2 className={styles.cardTitle}>
            {pharmacy.name}
          </h2>

          <div className={styles.mobileMeta}>
            <StoreMeta rating={rating} status={status} />
          </div>
        </div>

        <div className={styles.contacts}>
          {address && (
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>
                <LocationIcon />
              </span>

              <address className={styles.address}>
                {address}
              </address>
            </div>
          )}

          {phone && (
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>
                <PhoneIcon />
              </span>

              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className={styles.phone}
              >
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardBottom}>
        <Link
          href="/medicine"
          className={styles.visitButton}
        >
          Visit Store
        </Link>

        <div className={styles.desktopMeta}>
          <StoreMeta rating={rating} status={status} />
        </div>
      </div>
    </article>
  );
}

/* =========================
   PAGE
========================= */

export default async function MedicineStorePage() {
  let pharmacies: Pharmacy[] = [];
  let hasError = false;

  try {
    pharmacies = await getPharmacies();
  } catch (error) {
    console.error('Medicine Store error:', error);
    hasError = true;
  }

  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>
          Medicine store
        </h1>

        {hasError ? (
          <div className={styles.message} role="alert">
            Unable to load pharmacies. Please try again later.
          </div>
        ) : pharmacies.length === 0 ? (
          <div className={styles.message}>
            No pharmacies found.
          </div>
        ) : (
          <ul className={styles.grid}>
            {pharmacies.map((pharmacy, index) => (
              <li
                key={pharmacy._id}
                className={styles.gridItem}
              >
                <PharmacyCard
                  pharmacy={pharmacy}
                  index={index}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
