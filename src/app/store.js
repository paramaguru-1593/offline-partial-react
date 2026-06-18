import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import offlineCallReportReducer from '../features/offlineCallReport/offlineCallReportSlice'
import offlineCallingProcessReducer from '../features/offlineCallingProcess/offlineCallingProcessSlice'
import dataTeamReportReducer from '../features/dataTeamReport/dataTeamReportSlice'
import offlineManagementReducer from '../features/offlineManagement/offlineManagementSlice'
import offlineProfileReducer from '../features/offlineProfile/offlineProfileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dataTeamReport: dataTeamReportReducer,
    offlineCallReport: offlineCallReportReducer,
    offlineCallingProcess: offlineCallingProcessReducer,
    offlineManagement: offlineManagementReducer,
    offlineProfile: offlineProfileReducer,
  },
})
