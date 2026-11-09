
import PharmacyCard from '../PharmacyCard/PharmacyCard';
import { getNearestStores } from '@/services/stores';

import styles from './NearestStores.module.css';

export default async function NearestStores() {
  let pharmacies;

  try {
    pharmacies = await getNearestStores();
  } catch (error) {
    console.error('Failed to load nearest stores:', error);

    return null;
  }

  if (pharmacies.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <h2 className={styles.title}>
            Your Nearest Medicine Store
          </h2>

          <p className={styles.subtitle}>
            Search for Medicine, Filter by your location
          </p>
        </div>

        <ul className={styles.list}>
          {pharmacies.map((pharmacy) => (
            <li className={styles.item} key={pharmacy._id}>
              <PharmacyCard pharmacy={pharmacy} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
