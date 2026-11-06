
import SharedLayout from '../components/SharedLayout/SharedLayout';

import styles from './page.module.css';

export default function HomePage() {
  return (
    <SharedLayout>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>
            Your medication delivered
          </h1>

          <p className={styles.description}>
            Say goodbye to all your healthcare worries with us
          </p>
        </div>
      </section>
    </SharedLayout>
  );
}
