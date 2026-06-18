import { CONFIG_POST, getResponsePayload } from '../api/apiHelper'
import ApiEndpoits from '../api/apiEndPoints'
import { DOB_MONTHS } from '../data/registerOfflineOptions'

export function formatRegistrationDob(selYear, selMonth, seldate) {
  if (!selYear || !selMonth || !seldate) return ''

  const monthIndex = DOB_MONTHS.indexOf(selMonth)
  if (monthIndex === -1) return ''

  const month = String(monthIndex + 1).padStart(2, '0')
  const day = String(seldate).padStart(2, '0')

  return `${selYear}-${month}-${day}`
}

export function mapStarDetailToOptions(stars = []) {
  if (!Array.isArray(stars)) return []

  return stars.map((star) => ({
    value: String(star.id),
    label: star.value || star.name,
  }))
}

export async function fetchStarDetail({ dob, motherTongueId }) {
  const response = await CONFIG_POST(ApiEndpoits.getStarDetail, {
    dob,
    motherTongueId: Number(motherTongueId),
  })

  const payload = getResponsePayload(response)

  if (!response || response.status >= 400) {
    const errorMessage =
      payload?.message || payload?.error || `Failed to load star details (${response?.status || 'network'})`
    throw new Error(errorMessage)
  }

  if (payload?.status !== 'Success') {
    throw new Error(payload?.message || 'Invalid star detail response')
  }

  return payload
}
