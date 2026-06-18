import { BASIC_DATA_ENDPOINT, getApiAuthToken } from '../config/api'

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
    const response = await fetch(BASIC_DATA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        userId: String(userId),
        loginFrom: 'Desktop',
        registerFrom: 'Desktop',
      }),
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const errorMessage =
        payload?.message || payload?.error || `Failed to load basic data (${response.status})`
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
