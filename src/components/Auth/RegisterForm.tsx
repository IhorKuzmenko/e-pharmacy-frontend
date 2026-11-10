
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
  registerUser,
  type RegisterData,
} from '@/lib/auth';

import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    mode: 'onBlur',
  });

  const onSubmit = async (values: RegisterData) => {
    try {
      await registerUser({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      });

      toast.success('Registration successful!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/login');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Registration failed'
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
            type="text"
            placeholder="User Name"
            autoComplete="name"
            aria-label="User Name"
            aria-invalid={Boolean(errors.name)}
            {...register('name', {
              required: 'Enter your name',
              minLength: {
                value: 2,
                message: 'Minimum 2 characters',
              },
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters',
              },
            })}
          />

          {errors.name && (
            <span className={styles.error}>
              {errors.name.message}
            </span>
          )}
        </div>

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
          <input
            type="tel"
            placeholder="Phone number"
            autoComplete="tel"
            aria-label="Phone number"
            aria-invalid={Boolean(errors.phone)}
            {...register('phone', {
              required: 'Enter your phone number',
              minLength: {
                value: 7,
                message: 'Minimum 7 characters',
              },
              maxLength: {
                value: 20,
                message: 'Maximum 20 characters',
              },
            })}
          />

          {errors.phone && (
            <span className={styles.error}>
              {errors.phone.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <div className={styles.passwordWrap}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="new-password"
              aria-label="Password"
              aria-invalid={Boolean(errors.password)}
              {...register('password', {
                required: 'Enter your password',
                minLength: {
                  value: 8,
                  message: 'Minimum 8 characters',
                },
                maxLength: {
                  value: 128,
                  message: 'Maximum 128 characters',
                },
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
        {isSubmitting ? 'Registering...' : 'Sign Up'}
      </button>

      <p className={styles.switchText}>
        Already have an account?{' '}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
          >
            Log in
          </button>
        ) : (
          <Link href="/login">Log in</Link>
        )}
      </p>
    </form>
  );
}
