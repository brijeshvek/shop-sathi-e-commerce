import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCredentials } from '../features/auth/authSlice';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
  }, []);

  const updateTheme = async (newTheme) => {
    // Keep theme as light, no-op
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
