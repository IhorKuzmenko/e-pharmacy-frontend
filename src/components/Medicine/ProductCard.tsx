
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { addToCart } from '@/lib/cart';
import styles from './ProductCard.module.css';

export type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  photo: string;
  stock: number;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (isAdding || isOutOfStock) return;

    const token = sessionStorage.getItem('e-pharmacy-token');

    if (!token) {
      toast.error('Please log in to add products');
      router.push('/login');
      return;
    }

    try {
      setIsAdding(true);

      const updatedCart = await addToCart(product._id);

      toast.success(`${product.name} added to cart!`);

      window.dispatchEvent(
        new CustomEvent('e-pharmacy-cart-updated', {
          detail: {
            totalQuantity: updatedCart.totalQuantity,
            totalPrice: updatedCart.totalPrice,
          },
        })
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to add product';

      toast.error(message);

      if (
        /invalid or expired token|token has been revoked|authorization token is missing|user not found/i.test(
          message
        )
      ) {
        sessionStorage.removeItem('e-pharmacy-token');
        router.push('/login');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className={styles.productCard}>
      <div className={styles.imageWrapper}>
        {product.photo ? (
          <Image
            src={product.photo}
            alt={product.name}
            fill
            sizes="(max-width: 374px) 100vw, (max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
            className={styles.productImage}
            unoptimized
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            No image
          </div>
        )}
      </div>

      <div className={styles.productInfo}>
        <div className={styles.productHeading}>
          <h2
            className={styles.productName}
            title={product.name}
          >
            {product.name}
          </h2>

          <span className={styles.productPrice}>
            ₴{product.price.toFixed(2)}
          </span>
        </div>

        <p className={styles.productCategory}>
          {product.category}
        </p>

        <div className={styles.productActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            aria-busy={isAdding}
          >
            {isAdding
              ? 'Adding...'
              : isOutOfStock
                ? 'Out of stock'
                : 'Add to cart'}
          </button>

          <Link
            href={`/medicine/${product._id}`}
            className={styles.detailsLink}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
