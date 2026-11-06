
import SharedLayout from '../components/SharedLayout/SharedLayout';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedLayout>{children}</SharedLayout>;
}
