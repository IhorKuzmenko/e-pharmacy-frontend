
'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import styles from './MedicineFilters.module.css';

type MedicineFiltersProps = {
  categories: string[];
  onFilter: (search: string, category: string) => void;
};

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

export default function MedicineFilters({
  categories,
  onFilter,
}: MedicineFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onFilter(search.trim(), category);
  }

  return (
    <form className={styles.filters} onSubmit={handleSubmit}>
      <select
        className={styles.categorySelect}
        value={category}
        onChange={(event) => setCategory(event.target.value)}
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
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={styles.searchInput}
          aria-label="Search medicine"
        />
        <SearchIcon />
      </div>

      <button type="submit" className={styles.filterButton}>
        <FilterIcon />
        Filter
      </button>
    </form>
  );
}
