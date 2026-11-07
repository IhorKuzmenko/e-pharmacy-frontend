
import Link from 'next/link';
import styles from './AddMedicines.module.css';

const benefits = [
  'Take user orders form online',
  'Create your shop profile',
  'Manage your store',
  'Get more orders',
  'Storage shed',
];

const repeatedBenefits = Array.from(
  { length: 3 },
  () => benefits,
).flat();

function LightningIcon() {
  return (
    <svg
      className={styles.bolt}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 2 4 13h7l-1 9 10-12h-7V2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BenefitsGroup({
  hidden = false,
}: {
  hidden?: boolean;
}) {
  return (
    <div
      className={styles.marqueeGroup}
      aria-hidden={hidden}
    >
      {repeatedBenefits.map((benefit, index) => (
        <div className={styles.benefit} key={index}>
          <LightningIcon />
          <span>{benefit}</span>
        </div>
      ))}
    </div>
  );
}

export default function AddMedicines() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              Add the medicines you need online now
            </h2>

            <p className={styles.description}>
              Enjoy the convenience of having your prescriptions
              filled from home by connecting with your community
              pharmacy through our online platform.
            </p>

            <Link
              href="/medicine"
              className={styles.button}
            >
              Buy medicine
            </Link>
          </div>

          <div className={styles.imageWrap}>
            <div
              className={styles.image}
              role="img"
              aria-label="Woman consulting a doctor online while holding medicine"
            />
          </div>
        </div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          <BenefitsGroup />
          <BenefitsGroup hidden />
        </div>
      </div>
    </section>
  );
}
