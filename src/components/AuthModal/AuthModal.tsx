
'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

import styles from './AuthModal.module.css';

export type AuthModalType = 'login' | 'register';

type AuthModalProps = {
  type: AuthModalType | null;
  onClose: () => void;
  onChangeType: (type: AuthModalType) => void;
};

export default function AuthModal({
  type,
  onClose,
  onChangeType,
}: AuthModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!type) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current;

    dialog?.querySelector<HTMLInputElement>('input')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled])'
        )
      );

      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [type, onClose]);

  if (!type || typeof document === 'undefined') {
    return null;
  }

  const isLogin = type === 'login';

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2
          id="auth-modal-title"
          className={styles.title}
        >
          {isLogin ? 'Log in to your account' : 'Sign Up'}
        </h2>

        <p
          id="auth-modal-description"
          className={styles.description}
        >
          {isLogin
            ? 'Please login to your account before continuing.'
            : 'Before proceeding, please register on our site.'}
        </p>

        {isLogin ? (
          <LoginModal
            onSuccess={onClose}
            onSwitchToRegister={() => onChangeType('register')}
          />
        ) : (
          <RegisterModal
            onSuccess={() => onChangeType('login')}
            onSwitchToLogin={() => onChangeType('login')}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
