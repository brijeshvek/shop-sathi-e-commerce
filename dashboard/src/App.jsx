import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useGetMeQuery } from './features/auth/authApi.js'
import { setCredentials, setLoading } from './features/auth/authSlice.js'
import AppRoutes from './routes/AppRoutes.jsx'

export const App = () => {
  const dispatch = useDispatch()
  const { data: meRes, error, isLoading } = useGetMeQuery()

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true))
    } else if (error) {
      dispatch(setCredentials(null))
    } else if (meRes?.success) {
      dispatch(setCredentials(meRes.data))
    }
  }, [meRes, error, isLoading, dispatch])

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '14px',
            borderRadius: '10px',
            background: '#0f172a',
            color: '#ffffff',
          }
        }}
      />
      <AppRoutes />
    </>
  )
}

export default App
