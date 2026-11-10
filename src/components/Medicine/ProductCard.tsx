
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { addToCart } from '@/lib/cart';
import { useAuthModal } from '@/components/AuthModal/AuthModalProvider';

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
  const { openLogin } = useAuthModal();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || product.stock <= 0) return;

    const token = sessionStorage.getItem('e-pharmacy-token');

    if (!token) {
      openLogin();
      return;
    }

    setIsAdding(true);

    try {
      const updatedCart = await addToCart(product._id);

      if (
        sessionStorage.getItem('e-pharmacy-token') !== token
      ) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent('e-pharmacy-cart-updated', {
          detail: {
            totalQuantity: updatedCart.totalQuantity,
            totalPrice: updatedCart.totalPrice,
          },
        })
      );

      toast.success('Product added to cart');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to add product'
      );
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
            sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
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
          <h3 className={styles.productName}>
            {product.name}
          </h3>

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
            onClick={() => void handleAddToCart()}
            disabled={isAdding || product.stock <= 0}
          >
            {product.stock <= 0
              ? 'Out of stock'
              : isAdding
                ? 'Adding...'
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
