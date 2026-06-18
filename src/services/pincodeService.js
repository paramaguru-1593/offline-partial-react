import { KALYAN_GET, getResponsePayload } from '../api/apiHelper'
import ApiEndpoits from '../api/apiEndPoints'

export function mapPincodeToOptions(pincodeList = []) {
  if (!Array.isArray(pincodeList)) return []

  return pincodeList.map((item) => ({
    value: String(item.id),
    label: item.name,
  }))
}

export async function fetchPincodeOptions(query, { signal } = {}) {
  const response = await KALYAN_GET(ApiEndpoits.getPincode, {
    params: { q: query },
    signal,
  })

  const payload = getResponsePayload(response)

  if (!response || response.status >= 400) {
    const errorMessage =
      payload?.message || payload?.error || `Failed to load pincode (${response?.status || 'network'})`
    throw new Error(errorMessage)
  }

  if (payload?.status !== 'Success') {
    throw new Error(payload?.message || 'Invalid pincode response')
  }

  return mapPincodeToOptions(payload?.data?.pincode)
}
