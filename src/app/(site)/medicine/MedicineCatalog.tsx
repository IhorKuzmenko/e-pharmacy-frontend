
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MedicinePage.module.css';

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  photo: string;
  stock: number;
};

type ProductsResponse = {
  data: Product[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://e-pharmacy-backend-qndx.onrender.com/api';

const PAGE_SIZE = 12;

async function fetchProducts(
  page: number,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const url = new URL(`${API_URL}/products`);

  url.searchParams.set('page', String(page));
  url.searchParams.set('perPage', String(PAGE_SIZE));

  const response = await fetch(url.toString(), {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const result: ProductsResponse = await response.json();

  if (
    !Array.isArray(result.data) ||
    typeof result.totalPages !== 'number'
  ) {
    throw new Error('Invalid products API response');
  }

  return result;
}

async function fetchAllProducts(
  signal?: AbortSignal
): Promise<Product[]> {
  const firstPage = await fetchProducts(1, signal);

  if (firstPage.totalPages <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from(
      { length: firstPage.totalPages - 1 },
      (_, index) => fetchProducts(index + 2, signal)
    )
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((result) => result.data),
  ];
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16l-6.5 7.5V19l-3 1v-6.5L4 6Z" />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
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
            disabled
            title="Cart integration coming next"
          >
            Add to cart
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

export default function MedicineCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[] | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const hasFilters = Boolean(search || category);

  // Load a single page from the backend.
  useEffect(() => {
    if (hasFilters) return;

    const controller = new AbortController();

    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        const result = await fetchProducts(
          page,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setProducts(result.data);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error('Products error:', err);
        setError('Unable to load medicines.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => controller.abort();
  }, [page, hasFilters]);

  // Load all products when filtering is active.
  // This ensures search covers all 60 products,
  // rather than only the current backend page.
  useEffect(() => {
    if (!hasFilters || allProducts !== null) return;

    const controller = new AbortController();

    async function loadAll() {
      try {
        setLoading(true);
        setError('');

        const result = await fetchAllProducts(
          controller.signal
        );

        if (!controller.signal.aborted) {
          setAllProducts(result);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error('Filtering error:', err);
        setError('Unable to load medicines.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAll();

    return () => controller.abort();
  }, [hasFilters, allProducts]);

  const filteredProducts = useMemo(() => {
    if (!hasFilters) return products;

    return (allProducts ?? []).filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        !category || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, allProducts, search, category, hasFilters]);

  const filteredTotalPages = hasFilters
    ? Math.max(
        1,
        Math.ceil(filteredProducts.length / PAGE_SIZE)
      )
    : totalPages;

  const currentPage = Math.min(page, filteredTotalPages);

  const visibleProducts = hasFilters
    ? filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      )
    : products;

  const visibleTotalItems = hasFilters
    ? filteredProducts.length
    : totalItems;

  const categories = useMemo(() => {
    const source = allProducts ?? products;

    return [...new Set(source.map((item) => item.category))]
      .filter(Boolean)
      .sort();
  }, [allProducts, products]);

  function applyFilters(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
    setCategory(selectedCategory);
  }

  function changePage(nextPage: number) {
    if (
      nextPage < 1 ||
      nextPage > filteredTotalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const pageNumbers = Array.from(
    { length: filteredTotalPages },
    (_, index) => index + 1
  ).filter(
    (number) =>
      number === 1 ||
      number === filteredTotalPages ||
      Math.abs(number - currentPage) <= 1
  );

  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Medicine</h1>

        <form
          className={styles.filters}
          onSubmit={applyFilters}
        >
          <select
            className={styles.categorySelect}
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
            aria-label="Product category"
          >
            <option value="">Product category</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className={styles.searchWrapper}>
            <input
              type="search"
              placeholder="Search medicine"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              className={styles.searchInput}
              aria-label="Search medicine"
            />

            <SearchIcon />
          </div>

          <button
            type="submit"
            className={styles.filterButton}
          >
            <FilterIcon />
            Filter
          </button>
        </form>

        {loading ? (
          <p className={styles.message}>
            Loading medicines...
          </p>
        ) : error ? (
          <p className={styles.message} role="alert">
            {error}
          </p>
        ) : visibleProducts.length === 0 ? (
          <p className={styles.message}>
            No medicines found.
          </p>
        ) : (
          <>
            <ul className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <li
                  key={product._id}
                  className={styles.gridItem}
                >
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>

            {filteredTotalPages > 1 && (
              <nav
                className={styles.pagination}
                aria-label="Medicine pagination"
              >
                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={currentPage === 1}
                  onClick={() => changePage(1)}
                  aria-label="First page"
                >
                  «
                </button>

                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {pageNumbers.map((number, index) => (
                  <span
                    key={number}
                    className={styles.pageGroup}
                  >
                    {index > 0 &&
                      number - pageNumbers[index - 1] > 1 && (
                        <span className={styles.ellipsis}>
                          ...
                        </span>
                      )}

                    <button
                      type="button"
                      className={`${styles.pageButton} ${
                        currentPage === number
                          ? styles.activePage
                          : ''
                      }`}
                      onClick={() => changePage(number)}
                      aria-current={
                        currentPage === number
                          ? 'page'
                          : undefined
                      }
                    >
                      {number}
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={
                    currentPage === filteredTotalPages
                  }
                  onClick={() => changePage(currentPage + 1)}
                  aria-label="Next page"
                >
                  ›
                </button>

                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={
                    currentPage === filteredTotalPages
                  }
                  onClick={() => changePage(filteredTotalPages)}
                  aria-label="Last page"
                >
                  »
                </button>
              </nav>
            )}

            <p
              style={{
                marginTop: '16px',
                textAlign: 'center',
                color: '#93939a',
                fontSize: '12px',
              }}
            >
              Page {currentPage} of {filteredTotalPages}
              {' · '}
              {visibleTotalItems} medicines
            </p>
          </>
        )}
      </div>
    </main>
  );
}
