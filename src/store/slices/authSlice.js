import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
    },
    clearCredentials: (state) => {
      state.user = null
      state.isLoggedIn = false
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer