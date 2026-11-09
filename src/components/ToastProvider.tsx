
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        success: {
          iconTheme: {
            primary: '#59b17a',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#e85050',
            secondary: '#ffffff',
          },
        },
        style: {
          borderRadius: '12px',
          background: '#ffffff',
          color: '#1d1e21',
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '14px',
        },
      }}
    />
  );
}
