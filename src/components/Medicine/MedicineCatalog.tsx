
'use client';

import { useEffect, useMemo, useState } from 'react';

import ProductCard, { type Product } from './ProductCard';
import MedicineFilters from './MedicineFilters';
import Pagination from './Pagination';

import styles from './MedicineCatalog.module.css';

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
    throw new Error(
      `Failed to fetch products: ${response.status}`
    );
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

export default function MedicineCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<
    Product[] | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const hasFilters = Boolean(search || category);

  // Load a single page when no filters are applied.
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

    void loadPage();

    return () => controller.abort();
  }, [page, hasFilters]);

  // Load all products when filtering is active.
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

    void loadAll();

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
  }, [
    products,
    allProducts,
    search,
    category,
    hasFilters,
  ]);

  const filteredTotalPages = hasFilters
    ? Math.max(
        1,
        Math.ceil(filteredProducts.length / PAGE_SIZE)
      )
    : totalPages;

  const currentPage = Math.min(
    page,
    filteredTotalPages
  );

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

    return [
      ...new Set(source.map((item) => item.category)),
    ]
      .filter(Boolean)
      .sort();
  }, [allProducts, products]);

  function handleFilter(
    nextSearch: string,
    nextCategory: string
  ) {
    setPage(1);
    setSearch(nextSearch);
    setCategory(nextCategory);
  }

  function handlePageChange(nextPage: number) {
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

  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Medicine</h1>

        <MedicineFilters
          categories={categories}
          onFilter={handleFilter}
        />

        {loading ? (
          <p className={styles.message}>
            Loading medicines...
          </p>
        ) : error ? (
          <p
            className={styles.message}
            role="alert"
          >
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

            <Pagination
              currentPage={currentPage}
              totalPages={filteredTotalPages}
              onPageChange={handlePageChange}
            />

            <p className={styles.pageInfo}>
              Page {currentPage} of{' '}
              {filteredTotalPages}
              {' · '}
              {visibleTotalItems} medicines
            </p>
          </>
        )}
      </div>
    </main>
  );
}
