"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    if (data.data.token) {
      localStorage.setItem('accessToken', data.data.token);
    }
    setUser(data.data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.data.token) {
      localStorage.setItem('accessToken', data.data.token);
    }
    setUser(data.data);
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, verifyOtp, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
