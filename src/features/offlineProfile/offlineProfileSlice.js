import { createSlice } from '@reduxjs/toolkit'

const initialOfflineProfileData = {
  userLoggedIn: null,
  motherTons: [],
  casteList: [],
}

const initialState = {
  data: initialOfflineProfileData,
  status: 'idle',
  leadAvailabilityStatus: 'idle',
  submitStatus: 'idle',
  bulkUploadStatus: 'idle',
  error: '',
  leadAvailabilityError: '',
  submitError: '',
  bulkUploadError: '',
  isFallback: true,
  callingProcess: {
    customer: null,
    dialerList: [],
    status: 'idle',
    dialerStatus: 'idle',
    dialerCallingStatus: 'idle',
    registerCheckStatus: 'idle',
    saveStatus: 'idle',
    checkLeadStatus: 'idle',
    error: '',
    dialerError: '',
    dialerCallingError: '',
    registerCheckError: '',
    saveError: '',
    checkLeadError: '',
    isFallback: false,
    isDialerFallback: true,
  },
  management: {
    rows: [],
    pageNo: 1,
    recordsTotal: 0,
    recordsFiltered: 0,
    status: 'idle',
    error: '',
    isFallback: true,
    access: {
      leadOrder: [],
      selectedProcess: [],
      email: '',
      admUsersId: '',
    },
    accessStatus: 'idle',
    accessError: '',
    editStatus: 'idle',
    editError: '',
  },
  callReport: {
    report: [],
    totalresult: [],
    status: 'idle',
    error: '',
    isFallback: true,
  },
}

const offlineProfileSlice = createSlice({
  name: 'offlineProfile',
  initialState,
  reducers: {
    fetchOfflineProfileStart: (state) => {
      state.status = 'loading'
      state.error = ''
    },
    fetchOfflineProfileSuccess: (state, action) => {
      state.status = 'succeeded'
      state.data = action.payload
      state.error = ''
      state.isFallback = false
    },
    fetchOfflineProfileFailure: (state, action) => {
      state.status = 'failed'
      state.data = initialOfflineProfileData
      state.error = action.payload || 'Unable to fetch offline profile data'
      state.isFallback = true
    },
    checkLeadAvailabilityStart: (state) => {
      state.leadAvailabilityStatus = 'loading'
      state.leadAvailabilityError = ''
    },
    checkLeadAvailabilitySuccess: (state) => {
      state.leadAvailabilityStatus = 'succeeded'
      state.leadAvailabilityError = ''
    },
    checkLeadAvailabilityFailure: (state, action) => {
      state.leadAvailabilityStatus = 'failed'
      state.leadAvailabilityError = action.payload || 'Unable to validate mobile number'
    },
    submitOfflineProfileStart: (state) => {
      state.submitStatus = 'loading'
      state.submitError = ''
    },
    submitOfflineProfileSuccess: (state, action) => {
      state.submitStatus = 'succeeded'
      state.submitError = ''
      if (action.payload?.data) {
        state.data = {
          ...state.data,
          ...action.payload.data,
        }
      }
    },
    submitOfflineProfileFailure: (state, action) => {
      state.submitStatus = 'failed'
      state.submitError = action.payload || 'Unable to submit offline profile'
    },
    uploadOfflineProfileFileStart: (state) => {
      state.bulkUploadStatus = 'loading'
      state.bulkUploadError = ''
    },
    uploadOfflineProfileFileSuccess: (state) => {
      state.bulkUploadStatus = 'succeeded'
      state.bulkUploadError = ''
    },
    uploadOfflineProfileFileFailure: (state, action) => {
      state.bulkUploadStatus = 'failed'
      state.bulkUploadError = action.payload || 'Unable to upload file'
    },
    clearOfflineCustomer: (state) => {
      state.callingProcess.customer = null
      state.callingProcess.status = 'idle'
      state.callingProcess.error = ''
      state.callingProcess.isFallback = false
    },
    fetchOfflineCustomerStart: (state) => {
      state.callingProcess.status = 'loading'
      state.callingProcess.error = ''
    },
    fetchOfflineCustomerSuccess: (state, action) => {
      state.callingProcess.status = 'succeeded'
      state.callingProcess.customer = action.payload
      state.callingProcess.error = ''
      state.callingProcess.isFallback = false
    },
    fetchOfflineCustomerFailure: (state, action) => {
      state.callingProcess.status = 'failed'
      state.callingProcess.customer = null
      state.callingProcess.error = action.payload || 'Unable to fetch customer details'
      state.callingProcess.isFallback = true
    },
    saveOfflineDataStart: (state) => {
      state.callingProcess.saveStatus = 'loading'
      state.callingProcess.saveError = ''
    },
    saveOfflineDataSuccess: (state) => {
      state.callingProcess.saveStatus = 'succeeded'
      state.callingProcess.saveError = ''
    },
    saveOfflineDataFailure: (state, action) => {
      state.callingProcess.saveStatus = 'failed'
      state.callingProcess.saveError = action.payload || 'Unable to save offline data'
    },
    checkLeadAvailableInProfileStart: (state) => {
      state.callingProcess.checkLeadStatus = 'loading'
      state.callingProcess.checkLeadError = ''
    },
    checkLeadAvailableInProfileSuccess: (state) => {
      state.callingProcess.checkLeadStatus = 'succeeded'
      state.callingProcess.checkLeadError = ''
    },
    checkLeadAvailableInProfileFailure: (state, action) => {
      state.callingProcess.checkLeadStatus = 'failed'
      state.callingProcess.checkLeadError = action.payload || 'Unable to check lead availability'
    },
    fetchDialerListStart: (state) => {
      state.callingProcess.dialerStatus = 'loading'
      state.callingProcess.dialerError = ''
    },
    fetchDialerListSuccess: (state, action) => {
      state.callingProcess.dialerStatus = 'succeeded'
      state.callingProcess.dialerList = action.payload
      state.callingProcess.dialerError = ''
      state.callingProcess.isDialerFallback = false
    },
    fetchDialerListFailure: (state, action) => {
      state.callingProcess.dialerStatus = 'failed'
      state.callingProcess.dialerList = []
      state.callingProcess.dialerError = action.payload || 'Unable to fetch dialer list'
      state.callingProcess.isDialerFallback = true
    },
    dialerCallingStart: (state) => {
      state.callingProcess.dialerCallingStatus = 'loading'
      state.callingProcess.dialerCallingError = ''
    },
    dialerCallingSuccess: (state) => {
      state.callingProcess.dialerCallingStatus = 'succeeded'
      state.callingProcess.dialerCallingError = ''
    },
    dialerCallingFailure: (state, action) => {
      state.callingProcess.dialerCallingStatus = 'failed'
      state.callingProcess.dialerCallingError = action.payload || 'Unable to initiate dialer call'
    },
    checkRegisterOfflineStart: (state) => {
      state.callingProcess.registerCheckStatus = 'loading'
      state.callingProcess.registerCheckError = ''
    },
    checkRegisterOfflineSuccess: (state) => {
      state.callingProcess.registerCheckStatus = 'succeeded'
      state.callingProcess.registerCheckError = ''
    },
    checkRegisterOfflineFailure: (state, action) => {
      state.callingProcess.registerCheckStatus = 'failed'
      state.callingProcess.registerCheckError = action.payload || 'Please enter valid profileId properly then Submit'
    },
    fetchOfflineManagementStart: (state) => {
      state.management.status = 'loading'
      state.management.error = ''
    },
    fetchOfflineManagementSuccess: (state, action) => {
      state.management.status = 'succeeded'
      state.management.rows = action.payload.rows
      state.management.pageNo = action.payload.pageNo
      state.management.recordsTotal = action.payload.recordsTotal
      state.management.recordsFiltered = action.payload.recordsFiltered
      state.management.error = ''
      state.management.isFallback = false
    },
    fetchOfflineManagementFailure: (state, action) => {
      state.management.status = 'failed'
      state.management.rows = []
      state.management.pageNo = 1
      state.management.recordsTotal = 0
      state.management.recordsFiltered = 0
      state.management.error = action.payload || 'Unable to fetch offline management'
      state.management.isFallback = true
    },
    fetchOfflineCallAccessStart: (state) => {
      state.management.accessStatus = 'loading'
      state.management.accessError = ''
    },
    fetchOfflineCallAccessSuccess: (state, action) => {
      state.management.accessStatus = 'succeeded'
      state.management.access = action.payload
      state.management.accessError = ''
    },
    fetchOfflineCallAccessFailure: (state, action) => {
      state.management.accessStatus = 'failed'
      state.management.accessError = action.payload || 'Unable to fetch call access'
    },
    editOfflineCallAccessStart: (state) => {
      state.management.editStatus = 'loading'
      state.management.editError = ''
    },
    editOfflineCallAccessSuccess: (state, action) => {
      state.management.editStatus = 'succeeded'
      state.management.editError = ''
      if (action.payload) {
        state.management.access = action.payload
      }
    },
    editOfflineCallAccessFailure: (state, action) => {
      state.management.editStatus = 'failed'
      state.management.editError = action.payload || 'Unable to update call access'
    },
    setFallbackAccess: (state, action) => {
      state.management.access = {
        leadOrder: [],
        selectedProcess: [],
        email: action.payload?.email || '',
        admUsersId: action.payload?.admUsersId || '',
      }
      state.management.accessStatus = 'failed'
      state.management.accessError = action.payload?.error || ''
    },
    fetchOfflineCallReportStart: (state) => {
      state.callReport.status = 'loading'
      state.callReport.error = ''
    },
    fetchOfflineCallReportSuccess: (state, action) => {
      state.callReport.status = 'succeeded'
      state.callReport.report = action.payload.report || []
      state.callReport.totalresult = action.payload.totalresult || []
      state.callReport.error = ''
      state.callReport.isFallback = false
    },
    fetchOfflineCallReportFailure: (state, action) => {
      state.callReport.status = 'failed'
      state.callReport.report = []
      state.callReport.totalresult = []
      state.callReport.error = action.payload || 'Unable to fetch offline call report'
      state.callReport.isFallback = true
    },
  },
})

export const {
  fetchOfflineProfileStart,
  fetchOfflineProfileSuccess,
  fetchOfflineProfileFailure,
  checkLeadAvailabilityStart,
  checkLeadAvailabilitySuccess,
  checkLeadAvailabilityFailure,
  submitOfflineProfileStart,
  submitOfflineProfileSuccess,
  submitOfflineProfileFailure,
  uploadOfflineProfileFileStart,
  uploadOfflineProfileFileSuccess,
  uploadOfflineProfileFileFailure,
  clearOfflineCustomer,
  fetchOfflineCustomerStart,
  fetchOfflineCustomerSuccess,
  fetchOfflineCustomerFailure,
  saveOfflineDataStart,
  saveOfflineDataSuccess,
  saveOfflineDataFailure,
  checkLeadAvailableInProfileStart,
  checkLeadAvailableInProfileSuccess,
  checkLeadAvailableInProfileFailure,
  fetchDialerListStart,
  fetchDialerListSuccess,
  fetchDialerListFailure,
  dialerCallingStart,
  dialerCallingSuccess,
  dialerCallingFailure,
  checkRegisterOfflineStart,
  checkRegisterOfflineSuccess,
  checkRegisterOfflineFailure,
  fetchOfflineManagementStart,
  fetchOfflineManagementSuccess,
  fetchOfflineManagementFailure,
  fetchOfflineCallAccessStart,
  fetchOfflineCallAccessSuccess,
  fetchOfflineCallAccessFailure,
  editOfflineCallAccessStart,
  editOfflineCallAccessSuccess,
  editOfflineCallAccessFailure,
  setFallbackAccess,
  fetchOfflineCallReportStart,
  fetchOfflineCallReportSuccess,
  fetchOfflineCallReportFailure,
} = offlineProfileSlice.actions

export default offlineProfileSlice.reducer
