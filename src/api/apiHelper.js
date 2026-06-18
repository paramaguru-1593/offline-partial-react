import axios from 'axios'
import Constants from '../utils/constants'
import ApiEndpoits from './apiEndPoints'
import { clearAuthStoragePreservingDeviceId } from '../utils/utils'

const configuredApiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const apiBaseUrl = import.meta.env.DEV ? '' : configuredApiBaseUrl
const rootBaseUrl = import.meta.env.DEV ? '/' : apiBaseUrl
const kalyanBaseUrl = (
  import.meta.env.VITE_KALYAN_API_URL || 'https://v3-uat.kalyanmatrimony.com/api'
).replace(/\/$/, '')
const configBaseUrl = (
  import.meta.env.VITE_CONFIG_API_URL || 'https://config-uat.kalyanmatrimony.com/api'
).replace(/\/$/, '')

function attachAuthInterceptor(client, getDefaultAuthHeader) {
  client.interceptors.request.use(
    (config) => {
      const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData

      if (!config.headers?.Authorization) {
        const authHeader = getDefaultAuthHeader()
        if (authHeader) {
          config.headers = {
            ...config.headers,
            Authorization: authHeader,
          }
        }
      }

      config.headers = {
        ...config.headers,
        Accept: 'application/json',
        ...(!isFormData && { 'Content-Type': 'application/json' }),
      }

      return config
    },
    (error) => Promise.reject(error),
  )
}

const instance = axios.create({
  baseURL: `${apiBaseUrl}/api`,
})

const rootInstance = axios.create({
  baseURL: rootBaseUrl,
})

const kalyanInstance = axios.create({
  baseURL: kalyanBaseUrl,
})

const configInstance = axios.create({
  baseURL: configBaseUrl,
})

function getCrmAuthHeader() {
  const token = localStorage.getItem(Constants.localStorageKey.accessToken)
  const tokenType = localStorage.getItem(Constants.localStorageKey.tokenType) || 'Bearer'
  return token ? `${tokenType} ${token}` : null
}

function getKalyanAuthHeader() {
  return getCrmAuthHeader()
}

attachAuthInterceptor(kalyanInstance, getKalyanAuthHeader)
attachAuthInterceptor(rootInstance, getCrmAuthHeader)

let isUnauthorizedLogoutInProgress = false

const handleUnauthorizedLogout = async () => {
  if (isUnauthorizedLogoutInProgress) return

  isUnauthorizedLogoutInProgress = true
  const accessToken = localStorage.getItem(Constants.localStorageKey.accessToken)
  const tokenType = localStorage.getItem(Constants.localStorageKey.tokenType)
  const userId = Number(localStorage.getItem(Constants.localStorageKey.userId))

  try {
    if (accessToken && tokenType && userId) {
      await axios.post(
        `${apiBaseUrl}/api${ApiEndpoits.logout}`,
        { user_id: userId },
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
    }
  } catch {
    // Clear local session even if logout API fails.
  } finally {
    clearAuthStoragePreservingDeviceId()
    window.location.href = '/'
  }
}

instance.interceptors.request.use(
  (config) => {
    const authHeader = getCrmAuthHeader()
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData

    if (config.url === '/api/storeCandidates') {
      if (authHeader) {
        config.headers = {
          ...config.headers,
          Authorization: authHeader,
          Accept: 'application/json',
        }
      }
    } else if (authHeader) {
      config.headers = {
        ...config.headers,
        Authorization: authHeader,
        Accept: 'application/json',
        ...(!isFormData && { 'Content-Type': 'application/json' }),
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const requestUrl = error?.config?.url || ''
    const isLogoutApi = requestUrl.includes(ApiEndpoits.logout)
    const isLoginApi = requestUrl.includes(ApiEndpoits.login)

    if (status === 401 && !isLogoutApi && !isLoginApi) {
      handleUnauthorizedLogout()
    }

    return Promise.reject(error)
  },
)

const request = (client, method, url, data, config) => {
  if (method === 'get') {
    return client.get(url, config).catch((error) => error?.response)
  }

  return client[method](url, data, config).catch((error) => error?.response)
}

export const GET = (url, config) => request(instance, 'get', url, undefined, config)

export const POST = (url, data, config) => request(instance, 'post', url, data, config)

export const ROOT_GET = (url, config) => request(rootInstance, 'get', url, undefined, config)

export const ROOT_POST = (url, data, config) => request(rootInstance, 'post', url, data, config)

export const KALYAN_GET = (url, config) => request(kalyanInstance, 'get', url, undefined, config)

export const KALYAN_POST = (url, data, config) => request(kalyanInstance, 'post', url, data, config)

export const CONFIG_POST = (url, data, config) => request(configInstance, 'post', url, data, config)

export function getResponsePayload(response) {
  return response?.data ?? null
}

export default instance
