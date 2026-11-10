
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import AuthModal, {
  type AuthModalType,
} from './AuthModal';

type AuthModalContextValue = {
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
};

const AuthModalContext =
  createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [modalType, setModalType] =
    useState<AuthModalType | null>(null);

  const openLogin = useCallback(() => {
    setModalType('login');
  }, []);

  const openRegister = useCallback(() => {
    setModalType('register');
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
  }, []);

  const value = useMemo(
    () => ({
      openLogin,
      openRegister,
      closeModal,
    }),
    [openLogin, openRegister, closeModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}

      <AuthModal
        type={modalType}
        onClose={closeModal}
        onChangeType={setModalType}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error(
      'useAuthModal must be used within AuthModalProvider'
    );
  }

  return context;
}
