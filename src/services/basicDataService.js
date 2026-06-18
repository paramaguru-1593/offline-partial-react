import { KALYAN_POST, getResponsePayload } from '../api/apiHelper'
import ApiEndpoits from '../api/apiEndPoints'
import { getApiAuthToken } from '../config/api'

const basicDataCache = new Map()

function getCacheKey(userId) {
  return String(userId)
}

export function clearBasicDataCache(userId) {
  if (userId) {
    basicDataCache.delete(getCacheKey(userId))
    return
  }
  basicDataCache.clear()
}

export async function fetchBasicData({ userId, token } = {}) {
  const cacheKey = getCacheKey(userId)
  const authToken = getApiAuthToken(token)

  if (basicDataCache.has(cacheKey)) {
    return basicDataCache.get(cacheKey)
  }

  const request = (async () => {
    const response = await KALYAN_POST(
      ApiEndpoits.basicData,
      {
        userId: String(userId),
        loginFrom: 'Desktop',
        registerFrom: 'Desktop',
      },
      authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : undefined,
    )

    const payload = getResponsePayload(response)

    if (!response || response.status >= 400) {
      const errorMessage =
        payload?.message || payload?.error || `Failed to load basic data (${response?.status || 'network'})`
      throw new Error(errorMessage)
    }

    if (payload?.status !== 'Success' || !payload?.data) {
      throw new Error(payload?.message || 'Invalid basic data response')
    }

    return payload.data
  })()

  basicDataCache.set(cacheKey, request)

  try {
    return await request
  } catch (error) {
    basicDataCache.delete(cacheKey)
    throw error
  }
}
