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

const fallbackDialerList = ['PULSE', 'EUPRAXIA2', 'VICI2', 'VICI3', 'VICI1', 'VICI5', 'TATA', 'DOOCTI']
const customerFetchPrefixes = [
  'offlineCallingProcess/fetchOfflineCustomerByMobile',
  'offlineCallingProcess/fetchOfflineCustomerByLeadType',
  'offlineCallingProcess/fetchOfflineCustomer',
]

const initialState = {
  customer: null,
  dialerList: fallbackDialerList,
  status: 'idle',
  dialerStatus: 'idle',
  dialerCallingStatus: 'idle',
  registerCheckStatus: 'idle',
  saveStatus: 'idle',
  error: '',
  dialerError: '',
  dialerCallingError: '',
  registerCheckError: '',
  saveError: '',
  isFallback: false,
  isDialerFallback: true,
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

export const fetchDialerList = createAsyncThunk(
  'offlineCallingProcess/fetchDialerList',
  async (admUsersid = '1', { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/dialerlist`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admUsersid: String(admUsersid) }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success' || !Array.isArray(result?.data?.dialerList)) {
        throw new Error(result?.message || 'Unable to fetch dialer list')
      }

      return result.data.dialerList.filter((dialer) => String(dialer).trim())
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch dialer list')
    }
  },
)

export const dialerCalling = createAsyncThunk(
  'offlineCallingProcess/dialerCalling',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/dialercalling`, {
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
        throw new Error(result?.message || 'Unable to initiate dialer call')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to initiate dialer call')
    }
  },
)

export const checkRegisterOffline = createAsyncThunk(
  'offlineCallingProcess/checkRegisterOffline',
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/registercheckingoffline`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status === 'FAILURE') {
        throw new Error('Please enter valid profileId properly then Submit')
      }

      return result
    } catch (error) {
      return rejectWithValue(error.message || 'Please enter valid profileId properly then Submit')
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
      .addCase(fetchDialerList.pending, (state) => {
        state.dialerStatus = 'loading'
        state.dialerError = ''
      })
      .addCase(fetchDialerList.fulfilled, (state, action) => {
        state.dialerStatus = 'succeeded'
        state.dialerList = action.payload
        state.dialerError = ''
        state.isDialerFallback = false
      })
      .addCase(fetchDialerList.rejected, (state, action) => {
        state.dialerStatus = 'failed'
        state.dialerList = fallbackDialerList
        state.dialerError = action.payload || action.error.message || 'Unable to fetch dialer list'
        state.isDialerFallback = true
      })
      .addCase(dialerCalling.pending, (state) => {
        state.dialerCallingStatus = 'loading'
        state.dialerCallingError = ''
      })
      .addCase(dialerCalling.fulfilled, (state) => {
        state.dialerCallingStatus = 'succeeded'
        state.dialerCallingError = ''
      })
      .addCase(dialerCalling.rejected, (state, action) => {
        state.dialerCallingStatus = 'failed'
        state.dialerCallingError = action.payload || action.error.message || 'Unable to initiate dialer call'
      })
      .addCase(checkRegisterOffline.pending, (state) => {
        state.registerCheckStatus = 'loading'
        state.registerCheckError = ''
      })
      .addCase(checkRegisterOffline.fulfilled, (state) => {
        state.registerCheckStatus = 'succeeded'
        state.registerCheckError = ''
      })
      .addCase(checkRegisterOffline.rejected, (state, action) => {
        state.registerCheckStatus = 'failed'
        state.registerCheckError = action.payload || action.error.message || 'Please enter valid profileId properly then Submit'
      })
      .addMatcher(
        (action) => customerFetchPrefixes.some((prefix) => action.type === `${prefix}/pending`),
        (state) => {
          state.status = 'loading'
          state.error = ''
        },
      )
      .addMatcher(
        (action) => customerFetchPrefixes.some((prefix) => action.type === `${prefix}/fulfilled`),
        (state, action) => {
          state.status = 'succeeded'
          state.customer = action.payload
          state.error = ''
          state.isFallback = false
        },
      )
      .addMatcher(
        (action) => customerFetchPrefixes.some((prefix) => action.type === `${prefix}/rejected`),
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
