
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://e-pharmacy-backend-qndx.onrender.com/api';

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    const error = data as ApiErrorResponse;

    throw new Error(
      error.errors?.join('. ') ||
        error.message ||
        'Something went wrong',
    );
  }

  return data as T;
}

export async function registerUser(
  values: RegisterData,
) {
  const response = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  return parseResponse<{
    message: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
  }>(response);
}

export async function loginUser(values: LoginData) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  return parseResponse<Record<string, unknown>>(response);
}
