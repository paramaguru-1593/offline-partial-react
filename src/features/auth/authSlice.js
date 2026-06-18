import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ApiEndpoits from '../../api/apiEndPoints'
import { ROOT_POST } from '../../api/apiHelper'
import Constants from '../../utils/constants'
import { clearAuthStoragePreservingDeviceId } from '../../utils/utils'

const AUTH_STORAGE_KEY = 'crm_auth'

const emptyState = {
  isAuthenticated: false,
  user: null,
  token: null,
  processes: [],
  loginStatus: 'idle',
  loginError: '',
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
        processes: parsed.processes ?? [],
        loginStatus: 'idle',
        loginError: '',
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
        processes: state.processes,
      }),
    )
    return
  }

  localStorage.removeItem(AUTH_STORAGE_KEY)
}

function clearAuthState(state) {
  state.isAuthenticated = false
  state.user = null
  state.token = null
  state.processes = []
  state.loginStatus = 'idle'
  state.loginError = ''
  clearAuthStoragePreservingDeviceId()
}

function persistCrmToken(data) {
  if (!data) return

  if (data.access_token) {
    localStorage.setItem(Constants.localStorageKey.accessToken, data.access_token)
  }

  if (data.token_type) {
    localStorage.setItem(Constants.localStorageKey.tokenType, data.token_type)
  }

  const userId = data.admUsersId || data.id
  if (userId) {
    localStorage.setItem(Constants.localStorageKey.userId, String(userId))
  }
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await ROOT_POST(ApiEndpoits.login, { email, password })
      const result = response?.data

      if (result?.status !== 'Success' || !result?.data?.access_token) {
        throw new Error(result?.message || 'Invalid email or password')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Invalid email or password')
    }
  },
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ROOT_POST(ApiEndpoits.logout)
      const result = response?.data

      if (result?.status !== 'Success') {
        throw new Error(result?.message || 'Unable to logout')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to logout')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.processes = action.payload.processes ?? []
      state.loginStatus = 'succeeded'
      state.loginError = ''
      persistAuthState(state)
    },
    logout: (state) => {
      clearAuthState(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading'
        state.loginError = ''
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const data = action.payload
        persistCrmToken(data)

        state.isAuthenticated = true
        state.user = {
          email: data.agent_email,
          name: data.agent_email,
          role: data.role,
          language: data.language,
          admUsersId: data.admUsersId,
          id: data.id,
          expiresAt: data.expires_at,
          logoutTime: data.logouttime,
          tokenType: data.token_type,
        }
        state.token = data.access_token
        state.processes = data.processes || []
        state.loginStatus = 'succeeded'
        state.loginError = ''
        persistAuthState(state)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.processes = []
        state.loginStatus = 'failed'
        state.loginError = action.payload || action.error.message || 'Invalid email or password'
        persistAuthState(state)
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearAuthState(state)
      })
      .addCase(logoutUser.rejected, (state) => {
        clearAuthState(state)
      })
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
