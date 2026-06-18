import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dataTeamReportReducer from '../features/dataTeamReport/dataTeamReportSlice'
import offlineProfileReducer from '../features/offlineProfile/offlineProfileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dataTeamReport: dataTeamReportReducer,
    offlineProfile: offlineProfileReducer,
  },
})
