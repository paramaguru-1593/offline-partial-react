import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const fallbackReport = [
  {
    id: 1,
    name: 'porubselvi.m@kalyanmatrimony.com',
    registered: 12,
    connectedCallTotal: 36,
    notConnectedCall: 19,
    totalDialout: 55,
    consentToPay: 5,
    gpsLeads: 2,
    jewelleryLeads: 3,
    phoneVerifiedCount: 1,
    leadsLoadedfreshleads: 50,
    leadsLoadedCallBack: 10,
    leadsCalledInFreshLeads: 45,
    leadsCalledInCallBack: 8,
    leadsCalledInOtherLeads: 2,
    connectedCallFreshLeads: 30,
    connectedCallCallBack: 5,
    connectedCallOtherLeads: 1,
    salecount: 4,
    SaleProfileId: 'KM-9921',
    language: 'Tamil, Eng',
    parentNumberCount: 8,
    appLoginCount: 10,
    photoCount: 9,
  },
  {
    id: 2,
    name: 'mathankumar.b@kalyanmatrimony.com',
    registered: 10,
    connectedCallTotal: 35,
    notConnectedCall: 18,
    totalDialout: 53,
    consentToPay: 4,
    gpsLeads: 1,
    jewelleryLeads: 2,
    phoneVerifiedCount: 0,
    leadsLoadedfreshleads: 40,
    leadsLoadedCallBack: 15,
    leadsCalledInFreshLeads: 38,
    leadsCalledInCallBack: 12,
    leadsCalledInOtherLeads: 3,
    connectedCallFreshLeads: 25,
    connectedCallCallBack: 8,
    connectedCallOtherLeads: 2,
    salecount: 3,
    SaleProfileId: 'KM-8842',
    language: 'Mixed',
    parentNumberCount: 6,
    appLoginCount: 7,
    photoCount: 6,
  },
]

const fallbackTotals = [
  {
    id: 1,
    totalRegistered: 22,
    connectedcalltotal: 71,
    totalNotConnectedcall: 37,
    totalTotalDialout: 108,
    totalConsentTopay: 9,
    totalGpsleads: 3,
    totalJewelleryleads: 5,
    totalPhoneVerifiedCount: 1,
    totalLeadsLoadedfreshleads: 90,
    totalLeadsLoadedCallBack: 25,
    totalLeadsCalledInFreshLeads: 83,
    totalLeadsCalledInCallBack: 20,
    totalLeadsCalledInOtherLeads: 5,
    totalConnectedCallFreshLeads: 55,
    totalConnectedCallcallback: 13,
    totalConnectedCallOtherLeads: 3,
    totalSale: 7,
    totalparentNumberCount: 14,
    totalappLoginCount: 17,
    totalphotoCount: 15,
  },
]

const initialState = {
  report: fallbackReport,
  totalresult: fallbackTotals,
  status: 'idle',
  error: '',
  isFallback: true,
}

export const fetchOfflineCallReport = createAsyncThunk(
  'offlineCallReport/fetchOfflineCallReport',
  async ({ admUsersId = 1, panel = 'offlinecalling' } = {}, { rejectWithValue }) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').trim()
      const params = new URLSearchParams({
        admUsersId: String(admUsersId),
        panel,
      })
      const response = await fetch(`${baseUrl}/getofflinecallreport?${params.toString()}`, {
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
        throw new Error(result?.message || 'Unable to fetch offline call report')
      }

      return result.data
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch offline call report')
    }
  },
)

const offlineCallReportSlice = createSlice({
  name: 'offlineCallReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfflineCallReport.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(fetchOfflineCallReport.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.report = action.payload.report || []
        state.totalresult = action.payload.totalresult || []
        state.error = ''
        state.isFallback = false
      })
      .addCase(fetchOfflineCallReport.rejected, (state, action) => {
        state.status = 'failed'
        state.report = fallbackReport
        state.totalresult = fallbackTotals
        state.error = action.payload || action.error.message || 'Unable to fetch offline call report'
        state.isFallback = true
      })
  },
})

export default offlineCallReportSlice.reducer
