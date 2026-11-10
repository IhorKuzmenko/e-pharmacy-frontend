
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './ProductReviews.module.css';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://e-pharmacy-backend-qndx.onrender.com/api';

type Review = {
  _id: string;
  name: string;
  testimonial: string;
  createdAt?: string;
};

const reviewPhotos: Record<string, string> = {
  'maria tkachuk': '/images/maria-tkachuk.webp',
  'sergey rybachok': '/images/sergey-rybachok.webp',
  'natalia chatuk': '/images/natalia-chatuk.webp',
};

function getReviewPhoto(name: string): string | null {
  return reviewPhotos[name.trim().toLowerCase()] ?? null;
}

function formatDate(value?: string): string {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const response = await fetch(
          `${API_URL}/customer-reviews`,
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load reviews');
        }

        const result: unknown = await response.json();

        let data: Review[] = [];

        if (Array.isArray(result)) {
          data = result as Review[];
        } else if (
          result &&
          typeof result === 'object' &&
          'reviews' in result &&
          Array.isArray(result.reviews)
        ) {
          data = result.reviews as Review[];
        }

        if (!controller.signal.aborted) {
          setReviews(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load reviews'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadReviews();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p className={styles.message}>Loading reviews...</p>;
  }

  if (error) {
    return <p className={styles.message}>{error}</p>;
  }

  if (reviews.length === 0) {
    return <p className={styles.message}>No reviews available.</p>;
  }

  return (
    <div className={styles.reviews}>
      <ul className={styles.list}>
        {reviews.map((review, index) => {
          const photo = getReviewPhoto(review.name);

          return (
            <li
              key={review._id ?? index}
              className={styles.card}
            >
              <div className={styles.header}>
                {photo && (
                  <div className={styles.avatar}>
                    <Image
                      src={photo}
                      alt={review.name}
                      fill
                      sizes="40px"
                      className={styles.avatarImage}
                    />
                  </div>
                )}

                <div className={styles.author}>
                  <h3 className={styles.name}>
                    {review.name}
                  </h3>

                  {review.createdAt && (
                    <span className={styles.date}>
                      {formatDate(review.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              <p className={styles.text}>
                {review.testimonial}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
