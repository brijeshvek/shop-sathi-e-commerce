import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useGetMeQuery } from './features/auth/authApi.js'
import { setCredentials, setLoading } from './features/auth/authSlice.js'
import AppRoutes from './routes/AppRoutes.jsx'
import { useTranslation } from 'react-i18next'
import GlobalLoader from './components/common/GlobalLoader.jsx'

export const App = () => {
  const dispatch = useDispatch()
  const { data: meRes, error, isLoading } = useGetMeQuery()

  const { i18n } = useTranslation()

  // commint
  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true))
    } else if (error) {
      dispatch(setCredentials(null))
    } else if (meRes?.success) {
      dispatch(setCredentials(meRes.data))
      if (meRes.data?.language) {
        i18n.changeLanguage(meRes.data.language)
      }
    }
  }, [meRes, error, isLoading, dispatch, i18n])

  return (
    <>
      <GlobalLoader />
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
