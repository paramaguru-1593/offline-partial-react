import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fallbackDataTeamReport = [
  {
    admUsersId: 1,
    name: 'admin@gmail.com',
    totalLeadInserted: 0,
    tamilLeadInserted: 0,
    teluguLeadInserted: 0,
    malayalamLeadInserted: 0,
    kannadaLeadInserted: 0,
    hindiLeadInserted: 0,
    totalCrmUploaded: 22,
    tamilCrmUploaded: 13,
    teluguCrmUploaded: 3,
    malayalamCrmUploaded: 3,
    kannadaCrmUploaded: 2,
    hindiCrmUploaded: 1,
    totalProfileIdAlreadyExisted: 0,
    tamilProfileIdAlreadyExisted: 0,
    teluguProfileIdAlreadyExisted: 0,
    malayalamProfileIdAlreadyExisted: 0,
    kannadaProfileIdAlreadyExisted: 0,
    hindiProfileIdAlreadyExisted: 0,
    totalLeadExisted: 0,
    tamilLeadExisted: 0,
    teluguLeadExisted: 0,
    malayalamLeadExisted: 0,
    kannadaLeadExisted: 0,
    hindiLeadExisted: 0,
  },
  {
    admUsersId: 45800106,
    name: 'revathy@kalyanmatrimony.com',
    totalLeadInserted: 0,
    tamilLeadInserted: 0,
    teluguLeadInserted: 0,
    malayalamLeadInserted: 0,
    kannadaLeadInserted: 0,
    hindiLeadInserted: 0,
    totalCrmUploaded: 22,
    tamilCrmUploaded: 13,
    teluguCrmUploaded: 3,
    malayalamCrmUploaded: 3,
    kannadaCrmUploaded: 2,
    hindiCrmUploaded: 1,
    totalProfileIdAlreadyExisted: 0,
    tamilProfileIdAlreadyExisted: 0,
    teluguProfileIdAlreadyExisted: 0,
    malayalamProfileIdAlreadyExisted: 0,
    kannadaProfileIdAlreadyExisted: 0,
    hindiProfileIdAlreadyExisted: 0,
    totalLeadExisted: 0,
    tamilLeadExisted: 0,
    teluguLeadExisted: 0,
    malayalamLeadExisted: 0,
    kannadaLeadExisted: 0,
    hindiLeadExisted: 0,
  },
]

const initialState = {
  rows: fallbackDataTeamReport,
  status: 'idle',
  error: '',
  isFallback: true,
}

export const fetchDataTeamReport = createAsyncThunk(
  'dataTeamReport/fetchDataTeamReport',
  async (admusersId = 301666, { rejectWithValue }) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').trim()
      const response = await fetch(`${baseUrl}/datateamreport?admusersId=${admusersId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result?.status !== 'Success' || !Array.isArray(result?.data)) {
        throw new Error(result?.message || 'Unable to fetch data team report')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch data team report')
    }
  },
)

const dataTeamReportSlice = createSlice({
  name: 'dataTeamReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataTeamReport.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(fetchDataTeamReport.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.rows = action.payload
        state.error = ''
        state.isFallback = false
      })
      .addCase(fetchDataTeamReport.rejected, (state, action) => {
        state.status = 'failed'
        state.rows = fallbackDataTeamReport
        state.error = action.payload || action.error.message || 'Unable to fetch data team report'
        state.isFallback = true
      })
  },
})

export default dataTeamReportSlice.reducer
