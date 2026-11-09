
import styles from './MedicinePage.module.css';

export default function Loading() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Medicine</h1>

        <div className={styles.message} role="status">
          Loading medicines...
        </div>
      </div>
    </main>
  );
}
