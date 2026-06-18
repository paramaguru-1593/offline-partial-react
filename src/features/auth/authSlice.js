import { createSlice } from '@reduxjs/toolkit'

const AUTH_STORAGE_KEY = 'crm_auth'

const emptyState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

function loadAuthState() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return emptyState

    const parsed = JSON.parse(raw)
    if (parsed?.isAuthenticated && parsed?.token) {
      return {
        isAuthenticated: true,
        user: parsed.user ?? null,
        token: parsed.token,
      }
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return emptyState
}

function persistAuthState(state) {
  if (state.isAuthenticated) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    )
    return
  }

  localStorage.removeItem(AUTH_STORAGE_KEY)
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      persistAuthState(state)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      persistAuthState(state)
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
