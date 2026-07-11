"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Initial load
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  // Sync with user preference when user changes
  useEffect(() => {
    if (user && user.theme && user.theme !== theme) {
      setTheme(user.theme);
      localStorage.setItem('theme', user.theme);
    }
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  // Listen for system theme changes if set to system
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (user) {
      try {
        await api.patch(`/users/${user._id}/theme`, { theme: newTheme });
      } catch (error) {
        console.error('Failed to save theme to server:', error);
      }
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
