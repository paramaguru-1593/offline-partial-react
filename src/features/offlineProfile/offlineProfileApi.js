import { createAsyncThunk } from '@reduxjs/toolkit'
import ApiEndpoits from '../../api/apiEndPoints'
import { ROOT_GET, ROOT_POST } from '../../api/apiHelper'
import {
  checkLeadAvailableInProfileFailure,
  checkLeadAvailableInProfileStart,
  checkLeadAvailableInProfileSuccess,
  checkLeadAvailabilityFailure,
  checkLeadAvailabilityStart,
  checkLeadAvailabilitySuccess,
  checkRegisterOfflineFailure,
  checkRegisterOfflineStart,
  checkRegisterOfflineSuccess,
  dialerCallingFailure,
  dialerCallingStart,
  dialerCallingSuccess,
  editOfflineCallAccessFailure,
  editOfflineCallAccessStart,
  editOfflineCallAccessSuccess,
  fetchDialerListFailure,
  fetchDialerListStart,
  fetchDialerListSuccess,
  fetchOfflineCallAccessFailure,
  fetchOfflineCallAccessStart,
  fetchOfflineCallAccessSuccess,
  fetchOfflineCallReportFailure,
  fetchOfflineCallReportStart,
  fetchOfflineCallReportSuccess,
  fetchOfflineCustomerFailure,
  fetchOfflineCustomerStart,
  fetchOfflineCustomerSuccess,
  fetchOfflineManagementFailure,
  fetchOfflineManagementStart,
  fetchOfflineManagementSuccess,
  fetchOfflineProfileFailure,
  fetchOfflineProfileStart,
  fetchOfflineProfileSuccess,
  saveOfflineDataFailure,
  saveOfflineDataStart,
  saveOfflineDataSuccess,
  submitOfflineProfileFailure,
  submitOfflineProfileStart,
  submitOfflineProfileSuccess,
  uploadOfflineProfileFileFailure,
  uploadOfflineProfileFileStart,
  uploadOfflineProfileFileSuccess,
} from './offlineProfileSlice'

function clearSessionAndRedirect() {
  localStorage.clear()
  sessionStorage.clear()
  window.location.href = '/'
}

function getApiErrorMessage(error, fallbackMessage) {
  const errorData = error?.response?.data
  return errorData?.message || errorData || error?.message || fallbackMessage
}

function handleUnauthorizedResponse(response) {
  if (response?.status === 401) {
    clearSessionAndRedirect()
    return true
  }

  return false
}

function isSuccessStatus(status) {
  return String(status || '').toLowerCase() === 'success'
}

function normalizeCustomer(data) {
  return data?.usercall || data?.userCall || data || null
}

async function postCustomerJson(path, payload) {
  const response = await ROOT_POST(path, payload)
  const result = response?.data

  if (handleUnauthorizedResponse(response)) {
    throw new Error('Unauthorized')
  }

  if (result?.status !== 'Success' || !result?.data) {
    throw new Error(result?.message || 'Unable to fetch customer details')
  }

  const customer = normalizeCustomer(result.data)

  if (!customer) {
    throw new Error('Customer details not found')
  }

  return customer
}

const managementColumnKeys = ['email', 'active', 'language', 'leadTypes']

function normalizeManagementRows(rows = []) {
  return rows.map((row, index) => ({
    id: row.id || row.admUsersId || index + 1,
    email: row.email || '',
    active: row.active || '',
    language: row.language || '',
    leadTypes: row.leadTypes || row.leadtypes || '',
  }))
}

function buildManagementParams({
  page = 1,
  pageSize = 25,
  search = '',
  sortKey = 'email',
  sortDirection = 'asc',
}) {
  const effectiveSortKey = sortKey || 'email'
  const columnIndex = Math.max(managementColumnKeys.indexOf(effectiveSortKey), 0)
  const requestParams = {
    pageNo: page,
    start: (page - 1) * pageSize,
    size: pageSize,
    'order[0][column]': columnIndex,
    'order[0][dir]': sortDirection,
  }

  const trimmedSearch = search.trim()
  if (trimmedSearch) {
    requestParams['search[value]'] = trimmedSearch
  }

  managementColumnKeys.forEach((column, index) => {
    requestParams[`columns[${index}][data]`] = column
  })

  return requestParams
}

function serializeQueryParams(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

export const fetchOfflineProfile = createAsyncThunk(
  'offlineProfile/fetchOfflineProfile',
  async (admUsersId, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch offline profile data'

    try {
      dispatch(fetchOfflineProfileStart())

      const response = await ROOT_POST(ApiEndpoits.offlineProfile, { admUsersId })

      if (handleUnauthorizedResponse(response)) {
        dispatch(fetchOfflineProfileFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (!isSuccessStatus(result?.status) || !result?.data) {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(fetchOfflineProfileSuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchOfflineProfileFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const checkLeadAvailability = createAsyncThunk(
  'offlineProfile/checkLeadAvailability',
  async ({ field, mobileNumber }, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to validate mobile number'

    try {
      dispatch(checkLeadAvailabilityStart())

      const requestKey = field === 'alternateMobile' ? 'mobileNumber2' : 'mobileNumber1'
      const response = await ROOT_POST(
        ApiEndpoits.checkLeadAvailableInProfileWithId,
        {
          [requestKey]: mobileNumber,
        },
      )

      if (handleUnauthorizedResponse(response)) {
        dispatch(checkLeadAvailabilityFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'SUCCESS' || !result?.data) {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(checkLeadAvailabilitySuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(checkLeadAvailabilityFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const submitOfflineProfile = createAsyncThunk(
  'offlineProfile/submitOfflineProfile',
  async (profileData, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to submit offline profile'

    try {
      dispatch(submitOfflineProfileStart())

      const response = await ROOT_POST(ApiEndpoits.offlineProfileSubmit, profileData)

      if (handleUnauthorizedResponse(response)) {
        dispatch(submitOfflineProfileFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (!isSuccessStatus(result?.status)) {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(submitOfflineProfileSuccess(result))
      return result
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(submitOfflineProfileFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const uploadOfflineProfileFile = createAsyncThunk(
  'offlineProfile/uploadOfflineProfileFile',
  async ({ file, leadType, admUsersId }, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to upload file'

    try {
      dispatch(uploadOfflineProfileFileStart())

      const formData = new FormData()

      formData.append('uploadfile', file)
      formData.append('leadType', leadType)
      formData.append('admUsersId', String(admUsersId))

      const response = await ROOT_POST(ApiEndpoits.fileUpload, formData)

      if (handleUnauthorizedResponse(response)) {
        dispatch(uploadOfflineProfileFileFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'Success' || !result?.data?.insertSummary) {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(uploadOfflineProfileFileSuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(uploadOfflineProfileFileFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export function downloadOfflineProfileUploadResult(leadType) {
  return ROOT_GET(ApiEndpoits.fileUploadDownload, {
    params: { leadType },
    responseType: 'blob',
  })
}

export const fetchOfflineCustomerByMobile = createAsyncThunk(
  'offlineProfile/fetchOfflineCustomerByMobile',
  async ({ mobilenumber, admUsersId }, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch customer details'

    try {
      dispatch(fetchOfflineCustomerStart())
      const customer = await postCustomerJson(ApiEndpoits.offlineSearchById, { mobilenumber, admUsersId })
      dispatch(fetchOfflineCustomerSuccess(customer))
      return customer
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchOfflineCustomerFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchOfflineCustomerByLeadType = createAsyncThunk(
  'offlineProfile/fetchOfflineCustomerByLeadType',
  async ({ typecategory, languagechoosen = 'Tamil', admUsersId }, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch customer details'

    try {
      dispatch(fetchOfflineCustomerStart())
      const customer = await postCustomerJson(ApiEndpoits.offlineRegisCallUser, { typecategory, languagechoosen, admUsersId })
      dispatch(fetchOfflineCustomerSuccess(customer))
      return customer
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchOfflineCustomerFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchOfflineCustomer = createAsyncThunk(
  'offlineProfile/fetchOfflineCustomer',
  async (admUsersId, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch customer details'

    try {
      dispatch(fetchOfflineCustomerStart())
      const customer = await postCustomerJson(ApiEndpoits.offlineFetchData, { admUsersId })
      dispatch(fetchOfflineCustomerSuccess(customer))
      return customer
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchOfflineCustomerFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const saveOfflineData = createAsyncThunk(
  'offlineProfile/saveOfflineData',
  async (payload, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to save offline data'

    try {
      dispatch(saveOfflineDataStart())
      const response = await ROOT_POST(ApiEndpoits.saveOfflineData, payload)

      if (handleUnauthorizedResponse(response)) {
        dispatch(saveOfflineDataFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'Success') {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(saveOfflineDataSuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(saveOfflineDataFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const checkLeadAvailableInProfile = createAsyncThunk(
  'offlineProfile/checkLeadAvailableInProfile',
  async (payload, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to check lead availability'

    try {
      dispatch(checkLeadAvailableInProfileStart())
      const response = await ROOT_POST(ApiEndpoits.checkLeadAvailableInProfile, payload)

      if (handleUnauthorizedResponse(response)) {
        dispatch(checkLeadAvailableInProfileFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      dispatch(checkLeadAvailableInProfileSuccess(response?.data))
      return response?.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(checkLeadAvailableInProfileFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchDialerList = createAsyncThunk(
  'offlineProfile/fetchDialerList',
  async (admUsersid = '1', { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch dialer list'

    try {
      dispatch(fetchDialerListStart())
      const response = await ROOT_POST(ApiEndpoits.dialerList, { admUsersid: String(admUsersid) })

      if (handleUnauthorizedResponse(response)) {
        dispatch(fetchDialerListFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'Success' || !Array.isArray(result?.data?.dialerList)) {
        throw new Error(result?.message || fallbackMessage)
      }

      const dialerList = result.data.dialerList.filter((dialer) => String(dialer).trim())
      dispatch(fetchDialerListSuccess(dialerList))
      return dialerList
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchDialerListFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const dialerCalling = createAsyncThunk(
  'offlineProfile/dialerCalling',
  async (payload, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to initiate dialer call'

    try {
      dispatch(dialerCallingStart())
      const response = await ROOT_POST(ApiEndpoits.dialerCalling, payload)

      if (handleUnauthorizedResponse(response)) {
        dispatch(dialerCallingFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'Success') {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(dialerCallingSuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(dialerCallingFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const checkRegisterOffline = createAsyncThunk(
  'offlineProfile/checkRegisterOffline',
  async (profileId, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Please enter valid profileId properly then Submit'

    try {
      dispatch(checkRegisterOfflineStart())
      const response = await ROOT_POST(ApiEndpoits.registerCheckingOffline, { profileId })

      if (handleUnauthorizedResponse(response)) {
        dispatch(checkRegisterOfflineFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status === 'FAILURE') {
        throw new Error(fallbackMessage)
      }

      dispatch(checkRegisterOfflineSuccess(result))
      return result
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(checkRegisterOfflineFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchOfflineManagement = createAsyncThunk(
  'offlineProfile/fetchOfflineManagement',
  async (params, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch offline management'

    try {
      dispatch(fetchOfflineManagementStart())
      const response = await ROOT_GET(ApiEndpoits.offlineManagement, {
        params: buildManagementParams(params),
        paramsSerializer: { serialize: serializeQueryParams },
      })

      if (handleUnauthorizedResponse(response)) {
        dispatch(fetchOfflineManagementFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'SUCCESS' || !result?.data) {
        throw new Error(result?.message || fallbackMessage)
      }

      const managementData = {
        pageNo: result.data.pageNo || params.page || 1,
        recordsTotal: result.data.recordsTotal || 0,
        recordsFiltered: result.data.recordsFiltered || 0,
        rows: normalizeManagementRows(result.data.data),
        isFallback: false,
      }

      dispatch(fetchOfflineManagementSuccess(managementData))
      return managementData
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchOfflineManagementFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchOfflineCallAccess = createAsyncThunk(
  'offlineProfile/fetchOfflineCallAccess',
  async ({ admUsersId, email }, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch call access'

    try {
      dispatch(fetchOfflineCallAccessStart())
      const response = await ROOT_POST(ApiEndpoits.offlineCallAccess, { admUsersId, email })

      if (handleUnauthorizedResponse(response)) {
        dispatch(fetchOfflineCallAccessFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'Success' || !result?.data) {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(fetchOfflineCallAccessSuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchOfflineCallAccessFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const editOfflineCallAccess = createAsyncThunk(
  'offlineProfile/editOfflineCallAccess',
  async ({ admUsersId, selectedProcess }, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to update call access'

    try {
      dispatch(editOfflineCallAccessStart())
      const response = await ROOT_POST(ApiEndpoits.editOfflineCallAccess, { admUsersId, selectedProcess })

      if (handleUnauthorizedResponse(response)) {
        dispatch(editOfflineCallAccessFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'Success') {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(editOfflineCallAccessSuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(editOfflineCallAccessFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchOfflineCallReport = createAsyncThunk(
  'offlineProfile/fetchOfflineCallReport',
  async ({ admUsersId, panel = 'offlinecalling' } = {}, { rejectWithValue, dispatch }) => {
    const fallbackMessage = 'Unable to fetch offline call report'

    try {
      dispatch(fetchOfflineCallReportStart())
      const params = new URLSearchParams({
        admUsersId: String(admUsersId),
        panel,
      })
      const response = await ROOT_GET(`${ApiEndpoits.offlineCallReport}?${params.toString()}`)

      if (handleUnauthorizedResponse(response)) {
        dispatch(fetchOfflineCallReportFailure('Unauthorized'))
        return rejectWithValue('Unauthorized')
      }

      const result = response?.data

      if (result?.status !== 'Success' || !result?.data) {
        throw new Error(result?.message || fallbackMessage)
      }

      dispatch(fetchOfflineCallReportSuccess(result.data))
      return result.data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, fallbackMessage)
      dispatch(fetchOfflineCallReportFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)
