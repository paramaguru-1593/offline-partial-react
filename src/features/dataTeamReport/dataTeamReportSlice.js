import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ApiEndpoits from '../../api/apiEndPoints'
import { ROOT_GET } from '../../api/apiHelper'

const initialState = {
  rows: [],
  status: 'idle',
  error: '',
  isFallback: true,
}

export const fetchDataTeamReport = createAsyncThunk(
  'dataTeamReport/fetchDataTeamReport',
  async (admusersId, { rejectWithValue }) => {
    try {
      const response = await ROOT_GET(ApiEndpoits.dataTeamReport, {
        params: { admusersId },
      })
      const result = response?.data

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
        state.rows = []
        state.error = action.payload || action.error.message || 'Unable to fetch data team report'
        state.isFallback = true
      })
  },
})

export default dataTeamReportSlice.reducer
