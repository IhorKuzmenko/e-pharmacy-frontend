
'use client';

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  getCart,
  updateCart,
  checkoutCart,
  type Cart,
  type CartItem,
  type CheckoutData,
} from '@/lib/cart';

import styles from './CartPage.module.css';

type PaymentMethod = 'cash' | 'bank';

const initialForm: CheckoutData = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

const TOKEN_KEY = 'e-pharmacy-token';
const CART_EVENT = 'e-pharmacy-cart-updated';
const AUTH_EVENT = 'e-pharmacy-auth-changed';

function formatPrice(price: number): string {
  return `₴ ${price.toFixed(2)}`;
}

function notifyCartUpdated(
  totalQuantity: number,
  totalPrice: number
) {
  window.dispatchEvent(
    new CustomEvent(CART_EVENT, {
      detail: {
        totalQuantity,
        totalPrice,
      },
    })
  );
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updatingId, setUpdatingId] = useState<
    string | null
  >(null);

  const [form, setForm] =
    useState<CheckoutData>(initialForm);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cash');

  const loadCart = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (!token) {
      setCart(null);
      setIsLoading(false);
      router.replace('/login');
      return;
    }

    setIsLoading(true);

    try {
      const data = await getCart();

      if (sessionStorage.getItem(TOKEN_KEY) !== token) {
        return;
      }

      setCart(data);

      notifyCartUpdated(
        data.totalQuantity,
        data.totalPrice
      );
    } catch (error) {
      console.error('Failed to load cart:', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to load cart'
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function initializeCart() {
      const token = sessionStorage.getItem(TOKEN_KEY);

      if (!token) {
        if (!cancelled) {
          router.replace('/login');
        }
        return;
      }

      try {
        const data = await getCart();

        if (
          cancelled ||
          sessionStorage.getItem(TOKEN_KEY) !== token
        ) {
          return;
        }

        setCart(data);

        notifyCartUpdated(
          data.totalQuantity,
          data.totalPrice
        );
      } catch (error) {
        if (cancelled) return;

        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to load cart'
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeCart();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    const handleAuthChanged = () => {
      if (!sessionStorage.getItem(TOKEN_KEY)) {
        setCart(null);
        router.replace('/login');
        return;
      }

      void loadCart();
    };

    window.addEventListener(
      AUTH_EVENT,
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        AUTH_EVENT,
        handleAuthChanged
      );
    };
  }, [loadCart, router]);

  const handleUpdateQuantity = async (
    productId: string,
    quantity: number
  ) => {
    if (
      updatingId !== null ||
      isSubmitting ||
      quantity < 0
    ) {
      return;
    }

    const token = sessionStorage.getItem(TOKEN_KEY);

    if (!token) {
      router.push('/login');
      return;
    }

    setUpdatingId(productId);

    try {
      const updatedCart = await updateCart(
        productId,
        quantity
      );

      if (sessionStorage.getItem(TOKEN_KEY) !== token) {
        return;
      }

      setCart(updatedCart);

      notifyCartUpdated(
        updatedCart.totalQuantity,
        updatedCart.totalPrice
      );

      if (quantity === 0) {
        toast.success('Product removed from cart');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update cart'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleInputChange = (
    field: keyof CheckoutData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting || updatingId !== null) {
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const customer: CheckoutData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    if (
      customer.name.length < 2 ||
      customer.name.length > 100
    ) {
      toast.error('Name must contain 2–100 characters');
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        customer.email
      )
    ) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (
      customer.phone.length < 5 ||
      customer.phone.length > 30
    ) {
      toast.error('Phone must contain 5–30 characters');
      return;
    }

    if (
      customer.address.length < 5 ||
      customer.address.length > 300
    ) {
      toast.error('Address must contain 5–300 characters');
      return;
    }

    if (paymentMethod === 'bank') {
      toast.error(
        'Bank payment is not available yet. Please select Cash On Delivery.'
      );
      return;
    }

    const token = sessionStorage.getItem(TOKEN_KEY);

    if (!token) {
      toast.error('Please log in to place an order');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await checkoutCart(customer);

      if (sessionStorage.getItem(TOKEN_KEY) !== token) {
        return;
      }

      toast.success(result.message);

      setCart((previous) =>
        previous
          ? {
              ...previous,
              items: [],
              totalQuantity: 0,
              totalPrice: 0,
            }
          : null
      );

      notifyCartUpdated(0, 0);

      setForm(initialForm);
      setPaymentMethod('cash');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to place order';

      toast.error(message);

      // Refresh the cart after a checkout conflict
      // or stock validation error.
      if (
        /cart was changed|insufficient stock|cart is empty/i.test(
          message
        )
      ) {
        void loadCart();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;

  const isEmpty =
    !isLoading &&
    items.filter((item) => item.product !== null).length ===
      0;

  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Cart</h1>

        <div className={styles.layout}>
          <section
            className={styles.checkout}
            aria-labelledby="shipping-title"
          >
            <form
              className={styles.form}
              onSubmit={handlePlaceOrder}
            >
              <div className={styles.formSection}>
                <h2
                  id="shipping-title"
                  className={styles.sectionTitle}
                >
                  Enter shipping info
                </h2>

                <p className={styles.description}>
                  Enter your delivery address where you get
                  the product. You can also send any other
                  location where you want the products.
                </p>

                <div className={styles.fields}>
                  <label className={styles.field}>
                    <span>Name</span>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) =>
                        handleInputChange(
                          'name',
                          event.target.value
                        )
                      }
                      minLength={2}
                      maxLength={100}
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Email</span>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter text"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        handleInputChange(
                          'email',
                          event.target.value
                        )
                      }
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Phone</span>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter text"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) =>
                        handleInputChange(
                          'phone',
                          event.target.value
                        )
                      }
                      minLength={5}
                      maxLength={30}
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Address</span>

                    <input
                      type="text"
                      name="address"
                      placeholder="Enter text"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(event) =>
                        handleInputChange(
                          'address',
                          event.target.value
                        )
                      }
                      minLength={5}
                      maxLength={300}
                      required
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  Payment method
                </h2>

                <p className={styles.description}>
                  You can pay us in a multiple way in our
                  payment gateway system.
                </p>

                <div className={styles.paymentOptions}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() =>
                        setPaymentMethod('cash')
                      }
                    />

                    <span>Cash On Delivery</span>
                  </label>

                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() =>
                        setPaymentMethod('bank')
                      }
                    />

                    <span>Bank</span>
                  </label>
                </div>
              </div>

              <div className={styles.orderSection}>
                <h2 className={styles.sectionTitle}>
                  Order details
                </h2>

                <p className={styles.description}>
                  Shipping and additional costs are
                  calculated based on values you have
                  entered.
                </p>

                <div className={styles.total}>
                  <span>Total:</span>

                  <strong>
                    {formatPrice(totalPrice)}
                  </strong>
                </div>

                <button
                  type="submit"
                  className={styles.orderButton}
                  disabled={
                    isLoading ||
                    isEmpty ||
                    isSubmitting ||
                    updatingId !== null
                  }
                >
                  {isSubmitting
                    ? 'Placing order...'
                    : 'Place order'}
                </button>
              </div>
            </form>
          </section>

          <section
            className={styles.products}
            aria-label="Products in cart"
          >
            {isLoading ? (
              <p className={styles.status}>
                Loading cart...
              </p>
            ) : isEmpty ? (
              <div className={styles.empty}>
                <h2>Your cart is empty</h2>

                <p>
                  Add some medicines to your cart to
                  continue.
                </p>

                <Link
                  href="/medicine"
                  className={styles.shopLink}
                >
                  Browse medicines
                </Link>
              </div>
            ) : (
              <ul className={styles.productList}>
                {items.map((item: CartItem) => {
                  const product = item.product;

                  if (!product) return null;

                  const isUpdating =
                    updatingId === product._id;

                  const controlsDisabled =
                    updatingId !== null || isSubmitting;

                  return (
                    <li
                      key={product._id}
                      className={styles.productItem}
                    >
                      <div className={styles.imageWrapper}>
                        {product.photo ? (
                          <Image
                            src={product.photo}
                            alt={product.name}
                            fill
                            sizes="(max-width: 767px) 80px, 120px"
                            className={styles.productImage}
                            unoptimized
                          />
                        ) : (
                          <span
                            className={
                              styles.imagePlaceholder
                            }
                          >
                            No image
                          </span>
                        )}
                      </div>

                      <div className={styles.productInfo}>
                        <div className={styles.productTop}>
                          <div className={styles.productText}>
                            <h3 className={styles.productName}>
                              {product.name}
                            </h3>

                            <p
                              className={
                                styles.productDescription
                              }
                            >
                              Medicine
                            </p>
                          </div>

                          <span className={styles.productPrice}>
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <div className={styles.productBottom}>
                          <div
                            className={styles.quantityControl}
                            aria-label={`Quantity for ${product.name}`}
                          >
                            <button
                              type="button"
                              aria-label={`Increase ${product.name} quantity`}
                              disabled={
                                controlsDisabled ||
                                item.quantity >= product.stock
                              }
                              onClick={() =>
                                void handleUpdateQuantity(
                                  product._id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              type="button"
                              aria-label={`Decrease ${product.name} quantity`}
                              disabled={
                                controlsDisabled ||
                                item.quantity <= 1
                              }
                              onClick={() =>
                                void handleUpdateQuantity(
                                  product._id,
                                  item.quantity - 1
                                )
                              }
                            >
                              −
                            </button>
                          </div>

                          <button
                            type="button"
                            className={styles.removeButton}
                            disabled={controlsDisabled}
                            onClick={() =>
                              void handleUpdateQuantity(
                                product._id,
                                0
                              )
                            }
                          >
                            {isUpdating
                              ? 'Updating...'
                              : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
