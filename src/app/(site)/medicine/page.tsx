
import type { Metadata } from 'next';
import MedicineCatalog from "./MedicineCatalog";

export const metadata: Metadata = {
  title: 'Medicine | E-Pharmacy',
  description: 'Browse medicines and healthcare products.',
};

export default function MedicinePage() {
  return <MedicineCatalog />;
}
