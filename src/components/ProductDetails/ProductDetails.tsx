
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { getCart, updateCart } from '@/lib/cart';
import ProductReviews from './ProductReviews';

import styles from './ProductDetails.module.css';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://e-pharmacy-backend-qndx.onrender.com/api';

type Product = {
  _id: string;
  photo: string;
  name: string;
  suppliers: string;
  stock: number;
  price: number;
  category: string;
};

type Tab = 'description' | 'reviews';

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(id)}`,
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Product not found'
              : 'Failed to load product'
          );
        }

        const data: Product = await response.json();

        if (!controller.signal.aborted) {
          setProduct(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load product'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [id]);

  const handleIncrease = () => {
    if (!product) return;

    setQuantity((current) =>
      Math.min(product.stock, current + 1)
    );
  };

  const handleDecrease = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleAddToCart = async () => {
    if (!product || adding || product.stock <= 0) {
      return;
    }

    const token = sessionStorage.getItem('e-pharmacy-token');

    if (!token) {
      toast.error('Please log in to add products to cart');
      router.push('/login');
      return;
    }

    setAdding(true);

    try {
      const cart = await getCart();

      const existingItem = cart.items.find(
        (item) => item.product?._id === product._id
      );

      const currentQuantity = existingItem?.quantity ?? 0;
      const nextQuantity = currentQuantity + quantity;

      if (nextQuantity > product.stock) {
        toast.error(
          `Only ${product.stock} items available in stock`
        );
        return;
      }

      const updatedCart = await updateCart(
        product._id,
        nextQuantity
      );

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
      setQuantity(1);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Failed to add product'
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={`container ${styles.container}`}>
          <p className={styles.message}>
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={`container ${styles.container}`}>
          <p className={styles.message}>
            {error || 'Product not found'}
          </p>

          <Link href="/medicine" className={styles.backLink}>
            Back to medicine
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.layout}>
          <section className={styles.productColumn}>
            <div className={styles.imageWrapper}>
              <Image
                src={product.photo}
                alt={product.name}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 40vw, 340px"
                className={styles.productImage}
                unoptimized
                priority
              />
            </div>

            <div className={styles.productInfo}>
              <div className={styles.productHeading}>
                <div className={styles.productText}>
                  <h1 className={styles.productName}>
                    {product.name}
                  </h1>

                  <p className={styles.supplier}>
                    Brand: {product.suppliers}
                  </p>
                </div>

                <span className={styles.price}>
                  ₴{product.price.toFixed(2)}
                </span>
              </div>

              <div className={styles.productActions}>
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={
                      adding ||
                      product.stock <= 0 ||
                      quantity >= product.stock
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={adding || quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => void handleAddToCart()}
                  disabled={adding || product.stock <= 0}
                >
                  {product.stock <= 0
                    ? 'Out of stock'
                    : adding
                      ? 'Adding...'
                      : 'Add to cart'}
                </button>
              </div>
            </div>
          </section>

          <section className={styles.detailsPanel}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="Product information"
            >
              <button
                type="button"
                role="tab"
                id="description-tab"
                aria-selected={activeTab === 'description'}
                aria-controls="product-panel"
                className={`${styles.tab} ${
                  activeTab === 'description'
                    ? styles.activeTab
                    : ''
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>

              <button
                type="button"
                role="tab"
                id="reviews-tab"
                aria-selected={activeTab === 'reviews'}
                aria-controls="product-panel"
                className={`${styles.tab} ${
                  activeTab === 'reviews'
                    ? styles.activeTab
                    : ''
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>

            <div
              id="product-panel"
              role="tabpanel"
              aria-labelledby={
                activeTab === 'description'
                  ? 'description-tab'
                  : 'reviews-tab'
              }
              className={styles.tabPanel}
            >
              {activeTab === 'description' ? (
                <div className={styles.description}>
                  <h2 className={styles.contentTitle}>
                    Product information
                  </h2>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      Product
                    </span>
                    <span className={styles.infoValue}>
                      {product.name}
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      Brand / Supplier
                    </span>
                    <span className={styles.infoValue}>
                      {product.suppliers}
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      Category
                    </span>
                    <span className={styles.infoValue}>
                      {product.category}
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      Availability
                    </span>
                    <span className={styles.infoValue}>
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>

                  <p className={styles.descriptionNote}>
                    Detailed medical information is not
                    available for this product.
                  </p>
                </div>
              ) : (
                <ProductReviews />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
