
import type { Metadata } from 'next';

import CartPage from '@/components/Cart/CartPage';

export const metadata: Metadata = {
  title: 'Cart | E-Pharmacy',
  description: 'Review your cart and enter delivery details.',
};

export default function Page() {
  return <CartPage />;
}
