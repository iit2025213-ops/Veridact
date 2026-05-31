// ============================================================
// apiClient — Axios instance with auth interceptors
// TODO Phase 3: Activate with real backend base URL
// ============================================================
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('veridact_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401/403
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('veridact_token')
      localStorage.removeItem('veridact_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
