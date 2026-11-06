
import styles from './page.module.css';

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Your medication
            <span>delivered</span>
          </h1>

          <p className={styles.description}>
            Say goodbye to all your healthcare worries with us
          </p>
        </div>
      </div>
    </section>
  );
}
