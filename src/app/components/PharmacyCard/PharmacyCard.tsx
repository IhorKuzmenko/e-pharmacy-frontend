
import Icon from '../../components/Icon/Icon';
import type { Pharmacy } from '@/types/pharmacy';

import styles from './PharmacyCard.module.css';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

export default function PharmacyCard({
  pharmacy,
}: PharmacyCardProps) {
  const rating =
    pharmacy.rating != null ? Number(pharmacy.rating) : null;

  const phoneHref = pharmacy.phone?.replace(/[^\d+]/g, '');

  // Demo status for UI only.
  // The backend does not provide pharmacy opening hours.
  const isOpen = pharmacy.source === 'nearest_pharmacies';
  const status = isOpen ? 'OPEN' : 'CLOSE';

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.name} title={pharmacy.name}>
          {pharmacy.name}
        </h3>

        <div className={styles.meta}>
          {rating !== null && Number.isFinite(rating) && (
            <span className={styles.rating}>
              <Icon
                name="star"
                size={16}
                className={styles.starIcon}
              />

              <span>{rating}</span>
            </span>
          )}

          <span
            className={`${styles.status} ${
              isOpen ? styles.open : styles.closed
            }`}
            title="Demo status — not actual opening hours"
          >
            {status}
          </span>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <Icon
            name="map-pin"
            size={16}
            className={styles.detailIcon}
          />

          <span>
            {pharmacy.address}

            {pharmacy.city && (
              <>
                <br />
                {pharmacy.city}
              </>
            )}
          </span>
        </div>

        {phoneHref && (
          <a
            className={styles.detail}
            href={`tel:${phoneHref}`}
          >
            <Icon
              name="phone"
              size={16}
              className={styles.detailIcon}
            />

            <span>{pharmacy.phone}</span>
          </a>
        )}
      </div>

      <div className={styles.decoration} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </article>
  );
}
