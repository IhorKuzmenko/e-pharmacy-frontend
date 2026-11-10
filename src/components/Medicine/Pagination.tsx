
'use client';

import styles from './Pagination.module.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - currentPage) <= 1
  );

  return (
    <nav
      className={styles.pagination}
      aria-label="Medicine pagination"
    >
      <button
        type="button"
        className={styles.pageButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        aria-label="First page"
      >
        «
      </button>

      <button
        type="button"
        className={styles.pageButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pageNumbers.map((number, index) => (
        <span key={number} className={styles.pageGroup}>
          {index > 0 &&
            number - pageNumbers[index - 1] > 1 && (
              <span className={styles.ellipsis}>...</span>
            )}

          <button
            type="button"
            className={`${styles.pageButton} ${
              currentPage === number
                ? styles.activePage
                : ''
            }`}
            onClick={() => onPageChange(number)}
            aria-current={
              currentPage === number ? 'page' : undefined
            }
          >
            {number}
          </button>
        </span>
      ))}

      <button
        type="button"
        className={styles.pageButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        ›
      </button>

      <button
        type="button"
        className={styles.pageButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        aria-label="Last page"
      >
        »
      </button>
    </nav>
  );
}
