import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isLoading = false
    },
    logOut: (state) => {
      localStorage.removeItem('accessToken')
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, logOut, setLoading } = authSlice.actions
export default authSlice.reducer
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthIsLoading = (state) => state.auth.isLoading
