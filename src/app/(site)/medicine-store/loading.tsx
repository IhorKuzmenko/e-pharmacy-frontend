
import styles from './MedicineStorePage.module.css';

export default function MedicineStoreLoading() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.heading}>
          <h1 className={styles.title}>
            Medicine Store
          </h1>
        </div>

        <div
          className={styles.message}
          role="status"
          aria-live="polite"
        >
          Loading pharmacies...
        </div>
      </div>
    </main>
  );
}
