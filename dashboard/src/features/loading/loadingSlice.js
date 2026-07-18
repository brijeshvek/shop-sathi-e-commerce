import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeRequests: 0,
}

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.activeRequests += 1
    },
    stopLoading: (state) => {
      state.activeRequests = Math.max(0, state.activeRequests - 1)
    },
  },
})

export const { startLoading, stopLoading } = loadingSlice.actions
export default loadingSlice.reducer
export const selectIsAxiosLoading = (state) => state.loading.activeRequests > 0
