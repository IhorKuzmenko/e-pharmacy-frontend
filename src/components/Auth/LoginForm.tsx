
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { loginUser, type LoginData } from '@/lib/auth';

import styles from './LoginForm.module.css';

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
};

export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    mode: 'onBlur',
  });

  const onSubmit = async (values: LoginData) => {
    try {
      const result = await loginUser({
        email: values.email.trim(),
        password: values.password,
      });

      const token = result.accessToken ?? result.token;

      if (typeof token !== 'string' || !token) {
        throw new Error(
          'Login response does not contain an access token'
        );
      }

      sessionStorage.setItem('e-pharmacy-token', token);

      window.dispatchEvent(
        new Event('e-pharmacy-auth-changed')
      );

      toast.success('Login successful!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/medicine');
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Login failed'
      );
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.fields}>
        <div className={styles.field}>
          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            aria-label="Email address"
            aria-invalid={Boolean(errors.email)}
            {...register('email', {
              required: 'Enter your email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
          />

          {errors.email && (
            <span className={styles.error}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <div className={styles.passwordWrap}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              aria-label="Password"
              aria-invalid={Boolean(errors.password)}
              {...register('password', {
                required: 'Enter your password',
              })}
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {errors.password && (
            <span className={styles.error}>
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>

      <p className={styles.switchText}>
        Don&apos;t have an account?{' '}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
          >
            Sign Up
          </button>
        ) : (
          <Link href="/register">Sign Up</Link>
        )}
      </p>
    </form>
  );
}
