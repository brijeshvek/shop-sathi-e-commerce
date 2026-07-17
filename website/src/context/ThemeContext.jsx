"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    root.classList.remove('dark');
  }, []);

  const updateTheme = async (newTheme) => {
    // Keep theme as light, no-op
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
