import axios from 'axios'

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace(/\/$/, '')

export const apiClient = axios.create({ baseURL: apiBaseUrl })

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('streamx_access')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})