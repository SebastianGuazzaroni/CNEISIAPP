const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function fetchJson(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options)
  const contentType = response.headers.get('content-type') || ''
  const text = await response.text()

  if (!response.ok) {
    const body = contentType.includes('application/json') ? JSON.parse(text || '{}') : {}
    throw new Error(body.message || `Request failed with ${response.status}`)
  }

  if (response.status === 204 || response.status === 205) {
    return null
  }

  if (!contentType.includes('application/json')) {
    return null
  }

  return JSON.parse(text)
}
