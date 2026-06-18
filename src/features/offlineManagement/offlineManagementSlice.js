import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const fallbackRows = [
  { id: 1, email: 'porubselvi.m@kalyanmatrimony.com', active: 'Active', language: 'Tamil', leadTypes: 'Fresh-leads, Call Back' },
  { id: 2, email: 'mathankumar.b@kalyanmatrimony.com', active: 'Active', language: 'Telugu', leadTypes: 'Fresh-leads' },
  { id: 3, email: 'sangeetha.r@kalyanmatrimony.com', active: 'Active', language: 'Malayalam', leadTypes: 'Call Back, Other Leads' },
  { id: 4, email: 'priya.k@kalyanmatrimony.com', active: 'Active', language: 'Kannada', leadTypes: 'Fresh-leads, Call Back' },
  { id: 5, email: 'anitha.s@kalyanmatrimony.com', active: 'Active', language: 'Hindi', leadTypes: 'Fresh-leads' },
  { id: 6, email: 'deepa.v@kalyanmatrimony.com', active: 'Active', language: 'Tamil', leadTypes: 'Call Back' },
  { id: 7, email: 'kavitha.m@kalyanmatrimony.com', active: 'Active', language: 'Mixed', leadTypes: 'Fresh-leads, Other Leads' },
]

const fallbackLeadOrder = [
  { id: 18, orderNo: 1, leadtype: 'newleads', label: 'New leads' },
  { id: 12, orderNo: 2, leadtype: 'reentry_leads', label: 're-entry leads' },
  { id: 13, orderNo: 3, leadtype: 'yesterdaycallback_and_notconnected_leads', label: 'Yesterday Callback & notconnected leads' },
  { id: 14, orderNo: 4, leadtype: 'greaterthan1_and_lessthan7_callback_and_notconnected_leads', label: '>1 to <7 Callback & notconnected leads' },
  { id: 15, orderNo: 5, leadtype: 'greaterthan7_and_lessthan20_callback_and_notconnected_leads', label: '>7 to <20 Callback & notconnected leads' },
  { id: 16, orderNo: 6, leadtype: 'greaterthan20_and_lessthan60_callback_and_notconnected_leads', label: '>20 to <60 Callback & notconnected leads' },
  { id: 17, orderNo: 7, leadtype: 'greaterthan60_callback_and_notconnected_leads', label: '>60 Callback & notconnected leads' },
]

const columnKeys = ['email', 'active', 'language', 'leadTypes', 'actions']

function getBaseUrl() {
  return (import.meta.env.VITE_API_URL || '').trim()
}

function normalizeRows(rows = []) {
  return rows.map((row, index) => ({
    id: row.id || row.admUsersId || index + 1,
    email: row.email || '',
    active: row.active || '',
    language: row.language || '',
    leadTypes: row.leadTypes || row.leadtypes || '',
  }))
}

function buildManagementUrl({ page = 1, pageSize = 25, search = '', sortKey = 'email', sortDirection = 'asc' }) {
  const columnIndex = Math.max(columnKeys.indexOf(sortKey), 0)
  const params = new URLSearchParams()

  params.set('draw', String(page))
  params.set('start', String((page - 1) * pageSize))
  params.set('length', String(pageSize))
  params.set('search[value]', search)
  params.set('order[0][column]', String(columnIndex))
  params.set('order[0][dir]', sortDirection)
  columnKeys.forEach((column, index) => {
    params.set(`columns[${index}][data]`, column)
  })

  return `${getBaseUrl()}/getofflinemanagement?${params.toString()}`
}

export const fetchOfflineManagement = createAsyncThunk(
  'offlineManagement/fetchOfflineManagement',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch(buildManagementUrl(params), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'SUCCESS' || !result?.data) {
        throw new Error(result?.message || 'Unable to fetch offline management')
      }

      return {
        pageNo: result.data.pageNo || params.page || 1,
        recordsTotal: result.data.recordsTotal || 0,
        recordsFiltered: result.data.recordsFiltered || 0,
        rows: normalizeRows(result.data.data),
        isFallback: false,
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch offline management')
    }
  },
)

export const fetchOfflineCallAccess = createAsyncThunk(
  'offlineManagement/fetchOfflineCallAccess',
  async ({ admUsersId, email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/getofflinecallaccess`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admUsersId, email }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success' || !result?.data) {
        throw new Error(result?.message || 'Unable to fetch call access')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch call access')
    }
  },
)

export const editOfflineCallAccess = createAsyncThunk(
  'offlineManagement/editOfflineCallAccess',
  async ({ admUsersId, selectedProcess }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/editofflinecallaccess`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admUsersId, selectedProcess }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success') {
        throw new Error(result?.message || 'Unable to update call access')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to update call access')
    }
  },
)

const initialState = {
  rows: fallbackRows,
  pageNo: 1,
  recordsTotal: fallbackRows.length,
  recordsFiltered: fallbackRows.length,
  status: 'idle',
  error: '',
  isFallback: true,
  access: {
    leadOrder: fallbackLeadOrder,
    selectedProcess: [5, 6],
    email: '',
    admUsersId: '',
  },
  accessStatus: 'idle',
  accessError: '',
  editStatus: 'idle',
  editError: '',
}

const offlineManagementSlice = createSlice({
  name: 'offlineManagement',
  initialState,
  reducers: {
    setFallbackAccess: (state, action) => {
      state.access = {
        leadOrder: fallbackLeadOrder,
        selectedProcess: [5, 6],
        email: action.payload?.email || '',
        admUsersId: action.payload?.admUsersId || '',
      }
      state.accessStatus = 'failed'
      state.accessError = action.payload?.error || ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfflineManagement.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(fetchOfflineManagement.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.rows = action.payload.rows
        state.pageNo = action.payload.pageNo
        state.recordsTotal = action.payload.recordsTotal
        state.recordsFiltered = action.payload.recordsFiltered
        state.error = ''
        state.isFallback = false
      })
      .addCase(fetchOfflineManagement.rejected, (state, action) => {
        state.status = 'failed'
        state.rows = fallbackRows
        state.pageNo = 1
        state.recordsTotal = fallbackRows.length
        state.recordsFiltered = fallbackRows.length
        state.error = action.payload || action.error.message || 'Unable to fetch offline management'
        state.isFallback = true
      })
      .addCase(fetchOfflineCallAccess.pending, (state) => {
        state.accessStatus = 'loading'
        state.accessError = ''
      })
      .addCase(fetchOfflineCallAccess.fulfilled, (state, action) => {
        state.accessStatus = 'succeeded'
        state.access = action.payload
        state.accessError = ''
      })
      .addCase(fetchOfflineCallAccess.rejected, (state, action) => {
        state.accessStatus = 'failed'
        state.accessError = action.payload || action.error.message || 'Unable to fetch call access'
      })
      .addCase(editOfflineCallAccess.pending, (state) => {
        state.editStatus = 'loading'
        state.editError = ''
      })
      .addCase(editOfflineCallAccess.fulfilled, (state, action) => {
        state.editStatus = 'succeeded'
        state.editError = ''
        if (action.payload) {
          state.access = action.payload
        }
      })
      .addCase(editOfflineCallAccess.rejected, (state, action) => {
        state.editStatus = 'failed'
        state.editError = action.payload || action.error.message || 'Unable to update call access'
      })
  },
})

export const { setFallbackAccess } = offlineManagementSlice.actions
export default offlineManagementSlice.reducer
