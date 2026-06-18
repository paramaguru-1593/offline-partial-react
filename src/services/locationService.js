import { KALYAN_GET, getResponsePayload } from '../api/apiHelper'
import ApiEndpoits from '../api/apiEndPoints'
import { normalizeCountryId } from '../data/registerOfflineOptions'

function mapLocationToOptions(items = []) {
  if (!Array.isArray(items)) return []

  return items.map((item) => ({
    value: String(item.id),
    label: item.name,
  }))
}

export async function fetchStateOptions(countryId, { signal } = {}) {
  const locationCountryId = normalizeCountryId(countryId)
  const response = await KALYAN_GET(ApiEndpoits.getStates, {
    params: { countryId: locationCountryId },
    signal,
  })

  const payload = getResponsePayload(response)

  if (!response || response.status >= 400) {
    const errorMessage =
      payload?.message || payload?.error || `Failed to load states (${response?.status || 'network'})`
    throw new Error(errorMessage)
  }

  if (payload?.status !== 'Success') {
    throw new Error(payload?.message || 'Invalid states response')
  }

  return mapLocationToOptions(payload?.data?.states)
}

export async function fetchCityOptions(stateId, { signal } = {}) {
  const response = await KALYAN_GET(ApiEndpoits.getCities, {
    params: { stateId },
    signal,
  })

  const payload = getResponsePayload(response)

  if (!response || response.status >= 400) {
    const errorMessage =
      payload?.message || payload?.error || `Failed to load cities (${response?.status || 'network'})`
    throw new Error(errorMessage)
  }

  if (payload?.status !== 'Success') {
    throw new Error(payload?.message || 'Invalid cities response')
  }

  return mapLocationToOptions(payload?.data?.cities)
}
