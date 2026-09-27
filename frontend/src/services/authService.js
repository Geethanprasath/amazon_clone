import { apiClient } from './apiClient.js'

const ACCESS_TOKEN_KEY = 'streamx_access'
const REFRESH_TOKEN_KEY = 'streamx_refresh'

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export async function fetchProfile() {
  const { data } = await apiClient.get('/auth/profile/')
  return data
}

export async function loginUser(credentials) {
  const { data: tokens } = await apiClient.post('/auth/login/', credentials)
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)

  try {
    return await fetchProfile()
  } catch (error) {
    clearAuthTokens()
    throw error
  }
}

export async function registerUser(credentials) {
  const { data } = await apiClient.post('/auth/register/', credentials)
  return data
}

export async function logoutUser() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  try {
    if (refreshToken) {
      await apiClient.post('/auth/logout/', { refresh: refreshToken })
    }
  } finally {
    clearAuthTokens()
  }
}