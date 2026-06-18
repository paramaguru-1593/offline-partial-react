import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const fallbackCustomer = {
  id: 10234,
  name: 'Rajesh Kumar',
  mobileNumber1: '9876543210',
  mobileNumber2: '9123456789',
  motherTongue: 'Tamil',
  motherTongueId: 3,
  mothertongueid: 3,
  email: 'rajesh@example.com',
  callbackComment: null,
  leadSource: null,
}

const initialState = {
  customer: null,
  status: 'idle',
  saveStatus: 'idle',
  error: '',
  saveError: '',
  isFallback: false,
}

function getBaseUrl() {
  return (import.meta.env.VITE_API_URL || '').trim()
}

function normalizeCustomer(data) {
  return data?.usercall || data?.userCall || data || null
}

async function postJson(path, payload) {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const result = await response.json()

  if (result?.status !== 'Success' || !result?.data) {
    throw new Error(result?.message || 'Unable to fetch customer details')
  }

  const customer = normalizeCustomer(result.data)

  if (!customer) {
    throw new Error('Customer details not found')
  }

  return customer
}

export const fetchOfflineCustomerByMobile = createAsyncThunk(
  'offlineCallingProcess/fetchOfflineCustomerByMobile',
  async ({ mobilenumber, admUsersId = 1 }, { rejectWithValue }) => {
    try {
      return await postJson('/offlinesearchbyId', { mobilenumber, admUsersId })
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch customer details')
    }
  },
)

export const fetchOfflineCustomerByLeadType = createAsyncThunk(
  'offlineCallingProcess/fetchOfflineCustomerByLeadType',
  async ({ typecategory, languagechoosen = 'Tamil', admUsersId = 1 }, { rejectWithValue }) => {
    try {
      return await postJson('/offlineregiscalluser', { typecategory, languagechoosen, admUsersId })
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch customer details')
    }
  },
)

export const fetchOfflineCustomer = createAsyncThunk(
  'offlineCallingProcess/fetchOfflineCustomer',
  async (admUsersId = 1, { rejectWithValue }) => {
    try {
      return await postJson('/offlinefetchdata', { admUsersId })
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch customer details')
    }
  },
)

export const saveOfflineData = createAsyncThunk(
  'offlineCallingProcess/saveOfflineData',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/saveofflinedata`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success') {
        throw new Error(result?.message || 'Unable to save offline data')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to save offline data')
    }
  },
)

export const checkLeadAvailableInProfile = createAsyncThunk(
  'offlineCallingProcess/checkLeadAvailableInProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/checkleadavailableinprofile`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to check lead availability')
    }
  },
)

const offlineCallingProcessSlice = createSlice({
  name: 'offlineCallingProcess',
  initialState,
  reducers: {
    clearOfflineCustomer: (state) => {
      state.customer = null
      state.status = 'idle'
      state.error = ''
      state.isFallback = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveOfflineData.pending, (state) => {
        state.saveStatus = 'loading'
        state.saveError = ''
      })
      .addCase(saveOfflineData.fulfilled, (state) => {
        state.saveStatus = 'succeeded'
        state.saveError = ''
      })
      .addCase(saveOfflineData.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.saveError = action.payload || action.error.message || 'Unable to save offline data'
      })
      .addMatcher(
        (action) => action.type.startsWith('offlineCallingProcess/fetch') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
          state.error = ''
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('offlineCallingProcess/fetch') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.status = 'succeeded'
          state.customer = action.payload
          state.error = ''
          state.isFallback = false
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('offlineCallingProcess/fetch') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.customer = fallbackCustomer
          state.error = action.payload || action.error.message || 'Unable to fetch customer details'
          state.isFallback = true
        },
      )
  },
})

export const { clearOfflineCustomer } = offlineCallingProcessSlice.actions
export default offlineCallingProcessSlice.reducer
