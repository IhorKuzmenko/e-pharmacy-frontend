
import styles from './PromoBanners.module.css';

const promotions = [
  {
    id: 1,
    title: 'Huge Sale',
    discount: '70%',
    action: 'Shop now',
  },
  {
    id: 2,
    title: 'Secure delivery',
    discount: '100%',
    action: 'Read more',
  },
  {
    id: 3,
    title: 'Off',
    discount: '35%',
    action: 'Shop now',
  },
];

export default function PromoBanners() {
  return (
    <section
      className={styles.section}
      aria-label="Our benefits"
    >
      <div className="container">
        <ul className={styles.list}>
          {promotions.map((promotion) => (
            <li
              key={promotion.id}
              className={styles.card}
            >
              <div className={styles.top}>
                <span className={styles.number}>
                  {promotion.id}
                </span>

                <h2 className={styles.title}>
                  {promotion.title}
                </h2>
              </div>

              <div className={styles.bottom}>
                <span className={styles.discount}>
                  {promotion.discount}
                </span>

                <span className={styles.action}>
                  {promotion.action}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
