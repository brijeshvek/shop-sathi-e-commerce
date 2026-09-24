import axios from 'axios'
import { store } from '../app/store.js'
import { startLoading, stopLoading } from '../features/loading/loadingSlice.js'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach token and start loading
api.interceptors.request.use((config) => {
  store.dispatch(startLoading())
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
}, (error) => {
  store.dispatch(stopLoading())
  return Promise.reject(error)
})

// Response interceptor to handle session expiration (401) and stop loading
api.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading())
    return response
  },
  (error) => {
    store.dispatch(stopLoading())
    if (error.response && error.response.status === 401) {
      // Clear localStorage or redirect if not on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
