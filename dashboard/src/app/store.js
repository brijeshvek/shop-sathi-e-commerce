import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice.js'
import authReducer from '../features/auth/authSlice.js'
import loadingReducer from '../features/loading/loadingSlice.js'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
})
