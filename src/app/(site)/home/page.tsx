
import PromoBanners from '../../../components/PromoBanners/PromoBanners';
import NearestStores from '../../../components/NearestStores/NearestStores';
import AddMedicines from '../../../components/AddMedicines/AddMedicines';
import Reviews from '../../../components/Reviews/Reviews';

import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              <span>Your medication</span>
              <span>delivered</span>
            </h1>

            <p className={styles.description}>
              Say goodbye to all your healthcare
              worries with us
            </p>
          </div>
        </div>
      </section>

      <PromoBanners />
      <NearestStores />
      <AddMedicines />
      <Reviews />
    </>
  );
}
