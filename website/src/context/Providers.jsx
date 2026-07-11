"use client";

import '../i18n';

import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ThemeProvider } from './ThemeContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
