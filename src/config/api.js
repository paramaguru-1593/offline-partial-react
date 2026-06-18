const DEFAULT_API_BASE = 'https://v3-uat.kalyanmatrimony.com/api'

export const API_BASE_URL = (
  import.meta.env.VITE_KALYAN_API_URL || DEFAULT_API_BASE
).replace(/\/$/, '')

export const BASIC_DATA_ENDPOINT = `${API_BASE_URL}/basicdata`

export function getApiAuthToken(token) {
  return import.meta.env.VITE_KALYAN_API_TOKEN || token || ''
}
