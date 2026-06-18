const DEFAULT_API_BASE = 'https://v3-uat.kalyanmatrimony.com/api'
const DEFAULT_CONFIG_API_BASE = 'https://config-uat.kalyanmatrimony.com/api'

export const API_BASE_URL = (
  import.meta.env.VITE_KALYAN_API_URL || DEFAULT_API_BASE
).replace(/\/$/, '')

export const CONFIG_API_BASE_URL = (
  import.meta.env.VITE_CONFIG_API_URL || DEFAULT_CONFIG_API_BASE
).replace(/\/$/, '')

export const BASIC_DATA_ENDPOINT = `${API_BASE_URL}/basicdata`
export const GET_PINCODE_ENDPOINT = `${API_BASE_URL}/getpincode`
export const GET_STATES_ENDPOINT = `${API_BASE_URL}/getstates`
export const GET_CITIES_ENDPOINT = `${API_BASE_URL}/getcities`
export const GET_STAR_DETAIL_ENDPOINT = `${CONFIG_API_BASE_URL}/getStarDetail`

export function getApiAuthToken(token) {
  return import.meta.env.VITE_KALYAN_API_TOKEN || token || ''
}
