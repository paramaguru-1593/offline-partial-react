import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const offlineProfileFallbackData = {
  userLoggedIn: {
    admusersId: 101,
    name: 'Agent Name',
    extension: '2045',
  },
  motherTons: [
    {
      motherTongueId: 1,
      motherTongueName: 'Malayalam',
    },
    {
      motherTongueId: 2,
      motherTongueName: 'Tamil',
    },
    {
      motherTongueId: 3,
      motherTongueName: 'Hindi',
    },
    {
      motherTongueId: 4,
      motherTongueName: 'Kannada',
    },
    {
      motherTongueId: 5,
      motherTongueName: 'Telugu',
    },
    {
      motherTongueId: 6,
      motherTongueName: 'English',
    },
  ],
  casteList: [
    {
      matCasteId: 1,
      name: 'Brahmin',
    },
    {
      matCasteId: 2,
      name: 'Nadar',
    },
    {
      matCasteId: 3,
      name: 'Mudaliar',
    },
    {
      matCasteId: 4,
      name: 'Pillai',
    },
  ],
}

const initialState = {
  data: offlineProfileFallbackData,
  status: 'idle',
  submitStatus: 'idle',
  bulkUploadStatus: 'idle',
  error: '',
  submitError: '',
  bulkUploadError: '',
  isFallback: true,
}

export const fetchOfflineProfile = createAsyncThunk(
  'offlineProfile/fetchOfflineProfile',
  async (admUsersId = 301666, { rejectWithValue }) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').trim()
      const response = await fetch(`${baseUrl}/offlineprofile?admUsersId=${admUsersId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success' || !result?.data) {
        throw new Error(result?.message || 'Unable to fetch offline profile data')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch offline profile data')
    }
  },
)

export const checkLeadAvailability = createAsyncThunk(
  'offlineProfile/checkLeadAvailability',
  async ({ field, mobileNumber }, { rejectWithValue }) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').trim()
      const requestKey = field === 'alternateMobile' ? 'mobileNumber2' : 'mobileNumber1'
      const response = await fetch(`${baseUrl}/checkleadavailableinprofilewithId`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [requestKey]: mobileNumber,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'SUCCESS' || !result?.data) {
        throw new Error(result?.message || 'Unable to validate mobile number')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to validate mobile number')
    }
  },
)

export const submitOfflineProfile = createAsyncThunk(
  'offlineProfile/submitOfflineProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').trim()
      const response = await fetch(`${baseUrl}/offlineprofileSubmit`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success') {
        throw new Error(result?.message || 'Unable to submit offline profile')
      }

      return result
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to submit offline profile')
    }
  },
)

export const uploadOfflineProfileFile = createAsyncThunk(
  'offlineProfile/uploadOfflineProfileFile',
  async ({ file, leadType, admUsersId = 301666 }, { rejectWithValue }) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').trim()
      const formData = new FormData()

      formData.append('uploadfile', file)
      formData.append('leadType', leadType)
      formData.append('admUsersId', String(admUsersId))

      const response = await fetch(`${baseUrl}/fileupload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success' || !result?.data?.insertSummary) {
        throw new Error(result?.message || 'Unable to upload file')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to upload file')
    }
  },
)

const offlineProfileSlice = createSlice({
  name: 'offlineProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfflineProfile.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(fetchOfflineProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.error = ''
        state.isFallback = false
      })
      .addCase(fetchOfflineProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.data = offlineProfileFallbackData
        state.error = action.payload || action.error.message || 'Unable to fetch offline profile data'
        state.isFallback = true
      })
      .addCase(submitOfflineProfile.pending, (state) => {
        state.submitStatus = 'loading'
        state.submitError = ''
      })
      .addCase(submitOfflineProfile.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded'
        state.submitError = ''
        if (action.payload?.data) {
          state.data = {
            ...state.data,
            ...action.payload.data,
          }
        }
      })
      .addCase(submitOfflineProfile.rejected, (state, action) => {
        state.submitStatus = 'failed'
        state.submitError = action.payload || action.error.message || 'Unable to submit offline profile'
      })
      .addCase(uploadOfflineProfileFile.pending, (state) => {
        state.bulkUploadStatus = 'loading'
        state.bulkUploadError = ''
      })
      .addCase(uploadOfflineProfileFile.fulfilled, (state) => {
        state.bulkUploadStatus = 'succeeded'
        state.bulkUploadError = ''
      })
      .addCase(uploadOfflineProfileFile.rejected, (state, action) => {
        state.bulkUploadStatus = 'failed'
        state.bulkUploadError = action.payload || action.error.message || 'Unable to upload file'
      })
  },
})

export default offlineProfileSlice.reducer
