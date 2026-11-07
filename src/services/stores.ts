
import type { Pharmacy } from '@/types/pharmacy';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://e-pharmacy-backend-qndx.onrender.com/api';

export async function getNearestStores(): Promise<Pharmacy[]> {
  const response = await fetch(`${API_URL}/stores/nearest`, {
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch nearest stores: ${response.status}`,
    );
  }

  const result: unknown = await response.json();

  let stores: unknown;

  if (Array.isArray(result)) {
    stores = result;
  } else if (
    result !== null &&
    typeof result === 'object' &&
    'data' in result
  ) {
    stores = result.data;
  }

  if (!Array.isArray(stores)) {
    throw new Error('Invalid stores API response');
  }

  return (stores as Pharmacy[]).slice(0, 6);
}
