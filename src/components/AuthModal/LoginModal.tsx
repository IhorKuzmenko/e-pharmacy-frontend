
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { loginUser, type LoginData } from '@/lib/auth';

import styles from './LoginModal.module.css';

type LoginModalProps = {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
};

export default function LoginModal({
  onSuccess,
  onSwitchToRegister,
}: LoginModalProps) {
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
      onSuccess();
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
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
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
        <button
          type="button"
          className={styles.switchButton}
          onClick={onSwitchToRegister}
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}
