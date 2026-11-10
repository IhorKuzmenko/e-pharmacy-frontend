
import type { Metadata } from 'next';
import { Suspense } from 'react';

import ProductDetails from '@/components/ProductDetails/ProductDetails';

export const metadata: Metadata = {
  title: 'Product Details | E-Pharmacy',
  description: 'Medicine information and customer reviews.',
};

export default function ProductPage() {
  return (
    <Suspense fallback={<p>Loading product...</p>}>
      <ProductDetails />
    </Suspense>
  );
}
