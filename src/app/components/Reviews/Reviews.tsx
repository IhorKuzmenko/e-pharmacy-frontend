
import Image from 'next/image';
import type { CustomerReview } from '@/types/review';
import styles from './Reviews.module.css';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://e-pharmacy-backend-qndx.onrender.com/api';

const avatars: Record<string, string> = {
  'maria tkachuk': '/images/maria-tkachuk.webp',
  'sergey rybachok': '/images/sergey-rybachok.webp',
  'natalia chatuk': '/images/natalia-chatuk.webp',
};

const fallbackAvatars = [
  '/images/maria-tkachuk.webp',
  '/images/sergey-rybachok.webp',
  '/images/natalia-chatuk.webp',
];

function getAvatar(name: string, index: number): string {
  const normalizedName = name.trim().toLowerCase();

  return (
    avatars[normalizedName] ??
    fallbackAvatars[index % fallbackAvatars.length]
  );
}

async function getReviews(): Promise<CustomerReview[]> {
  try {
    const response = await fetch(
      `${API_URL}/customer-reviews`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch reviews: ${response.status}`,
      );
    }

    const data: unknown = await response.json();

    if (Array.isArray(data)) {
      return data as CustomerReview[];
    }

    if (data && typeof data === 'object') {
      const result = data as Record<string, unknown>;

      if (Array.isArray(result.data)) {
        return result.data as CustomerReview[];
      }

      if (Array.isArray(result.reviews)) {
        return result.reviews as CustomerReview[];
      }

      if (
        result.data &&
        typeof result.data === 'object' &&
        'reviews' in result.data
      ) {
        const nested = result.data as Record<string, unknown>;

        if (Array.isArray(nested.reviews)) {
          return nested.reviews as CustomerReview[];
        }
      }
    }

    return [];
  } catch (error) {
    console.error('Failed to load customer reviews:', error);
    return [];
  }
}

export default async function Reviews() {
  const reviews = (await getReviews()).slice(0, 3);

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Reviews</h2>

          <p className={styles.subtitle}>
            Search for Medicine, Filter by your location
          </p>
        </div>

        {reviews.length > 0 ? (
          <ul className={styles.list}>
            {reviews.map((review, index) => (
              <li className={styles.item} key={review._id}>
                <article className={styles.card}>
                  <div className={styles.avatar}>
                    <Image
                      src={getAvatar(review.name, index)}
                      alt={review.name}
                      width={64}
                      height={64}
                      className={styles.avatarImage}
                    />
                  </div>

                  <h3 className={styles.name}>
                    {review.name}
                  </h3>

                  <p className={styles.text}>
                    {review.testimonial}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>
            No reviews available yet.
          </p>
        )}
      </div>
    </section>
  );
}
