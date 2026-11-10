
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://e-pharmacy-backend-qndx.onrender.com/api';

export type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    photo?: string;
    stock: number;
  } | null;
  quantity: number;
  totalPrice: number;
};

export type Cart = {
  id: string;
  user: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};

export type CheckoutData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type Order = {
  _id: string;
  user: string;
  customer: CheckoutData;
  items: {
    product: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

type UpdateCartResponse = {
  message: string;
  cart: Cart;
};

export type CheckoutResponse = {
  message: string;
  order: Order;
};

function getToken(): string {
  const token = sessionStorage.getItem('e-pharmacy-token');

  if (!token) {
    throw new Error('Please log in to continue');
  }

  return token;
}

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    if (typeof data === 'object' && data !== null) {
      const errorData = data as {
        message?: string;
        errors?: string[];
      };

      if (
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        throw new Error(errorData.errors.join('. '));
      }

      if (typeof errorData.message === 'string') {
        throw new Error(errorData.message);
      }
    }

    throw new Error('Something went wrong');
  }

  return data as T;
}

export async function getCart(): Promise<Cart> {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    cache: 'no-store',
  });

  return parseResponse<Cart>(response);
}

export async function updateCart(
  productId: string,
  quantity: number
): Promise<Cart> {
  const response = await fetch(`${API_URL}/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const result =
    await parseResponse<UpdateCartResponse>(response);

  return result.cart;
}

export async function addToCart(
  productId: string
): Promise<Cart> {
  const currentCart = await getCart();

  const existingItem = currentCart.items.find(
    (item) => item.product?._id === productId
  );

  const currentQuantity = existingItem?.quantity ?? 0;

  return updateCart(productId, currentQuantity + 1);
}

export async function checkoutCart(
  customer: CheckoutData
): Promise<CheckoutResponse> {
  const response = await fetch(`${API_URL}/cart/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(customer),
  });

  return parseResponse<CheckoutResponse>(response);
}
