import AuthLayout from '@/components/Auth/AuthLayout';
import RegisterForm from '@/components/Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}