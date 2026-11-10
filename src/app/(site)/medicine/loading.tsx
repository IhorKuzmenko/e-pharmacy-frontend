
import styles from '@/components/Medicine/MedicineCatalog.module.css';

export default function Loading() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Medicine</h1>

        <p className={styles.message}>
          Loading medicines...
        </p>
      </div>
    </main>
  );
}
