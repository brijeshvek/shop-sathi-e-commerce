"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
        if (data.data.language) {
          i18n.changeLanguage(data.data.language);
        }
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
    if (data.data.token) {
      localStorage.setItem('accessToken', data.data.token);
    }
    setUser(data.data);
    if (data.data?.language) i18n.changeLanguage(data.data.language);
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    if (data.data.token) {
      localStorage.setItem('accessToken', data.data.token);
    }
    setUser(data.data);
    if (data.data.language) i18n.changeLanguage(data.data.language);
    return data;
  };

  const loginWithPhone = async (phone) => {
    const { data } = await api.post('/auth/login-phone', { phone });
    return data;
  };

  const verifyPhoneOtp = async (phone, otp) => {
    const { data } = await api.post('/auth/verify-phone-otp', { phone, otp });
    if (data.data.token) {
      localStorage.setItem('accessToken', data.data.token);
    }
    setUser(data.data);
    if (data.data.language) i18n.changeLanguage(data.data.language);
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

  const socialLogin = async (socialData) => {
    const { data } = await api.post('/auth/social-login', socialData);
    if (data.data?.token) {
      localStorage.setItem('accessToken', data.data.token);
    }
    setUser(data.data);
    if (data.data?.language) i18n.changeLanguage(data.data.language);
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, verifyOtp, loginWithPhone, verifyPhoneOtp, register, socialLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
