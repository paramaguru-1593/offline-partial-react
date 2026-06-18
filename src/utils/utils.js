import Constants from './constants'

export function clearAuthStoragePreservingDeviceId() {
  const deviceId = localStorage.getItem(Constants.localStorageKey.deviceId)

  localStorage.removeItem(Constants.localStorageKey.accessToken)
  localStorage.removeItem(Constants.localStorageKey.tokenType)
  localStorage.removeItem(Constants.localStorageKey.userId)
  localStorage.removeItem('crm_auth')

  if (deviceId) {
    localStorage.setItem(Constants.localStorageKey.deviceId, deviceId)
  }
}
