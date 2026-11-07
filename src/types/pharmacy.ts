
export interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  source?: string;
  status?: 'OPEN' | 'CLOSE';
}
