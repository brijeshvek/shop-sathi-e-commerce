import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Only access window and localStorage if we are in the browser
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('axios-request-start'));
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('axios-request-end'));
  }
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('axios-request-end'));
  }
  return response;
}, (error) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('axios-request-end'));
  }
  return Promise.reject(error);
});

export default api;
