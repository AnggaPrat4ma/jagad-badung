// src/config/axios.js
import axios from 'axios'
import { getJwtToken, getFirebaseToken, logout, refreshJwtToken } from '../utils/auth'
import router from '../router'

// ✅ API Base URL - hardcoded or from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.18.196.161:8000/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// ✅ Request Interceptor - Inject JWT Token (with Firebase fallback)
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // 🔑 Priority 1: Try JWT token first
      let token = getJwtToken()
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('🔹 Request with JWT token:', config.method?.toUpperCase(), config.url)
        return config
      }
      
      // 🔥 Priority 2: Try Firebase token (backward compatibility)
      token = await getFirebaseToken()
      
      if (!token) {
        // Priority 3: Try from localStorage (backup)
        token = localStorage.getItem('firebaseToken')
        
        if (token) {
          console.log('⚠️ Using Firebase token from localStorage')
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('🔹 Request with Firebase token:', config.method?.toUpperCase(), config.url)
      } else {
        console.log('⚠️ Request without token:', config.method?.toUpperCase(), config.url)
      }
    } catch (err) {
      console.error('❌ Failed to retrieve token:', err)
      
      // Fallback: try localStorage tokens
      const jwtToken = localStorage.getItem('jwtToken')
      const firebaseToken = localStorage.getItem('firebaseToken')
      
      if (jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`
        console.log('⚠️ Using fallback JWT token from localStorage')
      } else if (firebaseToken) {
        config.headers.Authorization = `Bearer ${firebaseToken}`
        console.log('⚠️ Using fallback Firebase token from localStorage')
      }
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// ✅ Response Interceptor - Handle Errors & Auto Logout/Refresh on 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response
    console.log('✅ Response:', response.status, response.config.url)
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response) {
      const status = error.response.status
      const url = error.config?.url || 'unknown'

      console.error(`❌ Response error ${status} on ${url}:`, error.response.data)

      // ========================================
      // Handle 401 Unauthorized (Token Expired/Invalid)
      // ========================================
      if (status === 401) {
        console.error('🔒 Unauthorized - Token expired or invalid')
        
        // Check if we have JWT token to refresh
        const jwtToken = getJwtToken()
        
        if (jwtToken && !originalRequest._retry) {
          // Try to refresh JWT token
          if (isRefreshing) {
            // Wait for token refresh to complete
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return axiosInstance(originalRequest)
            }).catch(err => {
              return Promise.reject(err)
            })
          }

          originalRequest._retry = true
          isRefreshing = true

          try {
            console.log('🔄 Attempting to refresh JWT token...')
            const newToken = await refreshJwtToken()
            
            if (newToken) {
              console.log('✅ JWT token refreshed successfully')
              
              // Update authorization header
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              
              processQueue(null, newToken)
              isRefreshing = false
              
              // Retry original request
              return axiosInstance(originalRequest)
            } else {
              throw new Error('Failed to refresh token')
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError)
            processQueue(refreshError, null)
            isRefreshing = false
            
            // Token refresh failed - logout user
            await handleLogout()
            return Promise.reject(new Error('Session expired. Please login again.'))
          }
        } else {
          // No JWT token or already retried - logout user
          await handleLogout()
          return Promise.reject(new Error('Session expired. Please login again.'))
        }
      }

      // ========================================
      // Handle 403 Forbidden (Insufficient Permissions)
      // ========================================
      if (status === 403) {
        console.error('🚫 Forbidden - Insufficient permissions')
        
        const message = error.response.data?.message || 
                       'You do not have permission to access this resource.'
        
        // Optional: Show notification to user
        if (typeof alert !== 'undefined') {
          alert(message)
        }
        
        return Promise.reject(new Error(message))
      }

      // ========================================
      // Handle 404 Not Found
      // ========================================
      if (status === 404) {
        console.error('🔍 Not Found')
        
        const message = error.response.data?.message || 
                       'The requested resource was not found.'
        
        return Promise.reject(new Error(message))
      }

      // ========================================
      // Handle 422 Validation Error
      // ========================================
      if (status === 422) {
        console.error('⚠️ Validation error')
        
        const errors = error.response.data?.errors || {}
        const message = error.response.data?.message || 'Validation failed'
        
        console.error('Validation errors:', errors)
        
        return Promise.reject({
          message,
          errors,
          status: 422
        })
      }

      // ========================================
      // Handle 500 Internal Server Error
      // ========================================
      if (status === 500) {
        console.error('⚠️ Server error')
        
        const message = error.response.data?.message || 
                       'Server error. Please try again later.'
        
        // Optional: Show notification
        if (typeof alert !== 'undefined') {
          alert(message)
        }
        
        return Promise.reject(new Error(message))
      }

      // ========================================
      // Handle Other HTTP Errors
      // ========================================
      const errorMessage = error.response.data?.message || 
                          `HTTP Error ${status}`
      
      console.error(`❌ HTTP ${status}:`, errorMessage)
      
      return Promise.reject(new Error(errorMessage))
    } 
    
    // ========================================
    // Handle Network Errors (No Response)
    // ========================================
    if (error.request) {
      console.error('🌐 Network error - No response received')
      console.error('Request:', error.request)
      
      const message = 'Network error. Please check your internet connection.'
      
      // Optional: Show notification
      if (typeof alert !== 'undefined') {
        alert(message)
      }
      
      return Promise.reject(new Error(message))
    }

    // ========================================
    // Handle Other Errors
    // ========================================
    console.error('❌ Unexpected error:', error.message)
    return Promise.reject(error)
  }
)

// ========================================
// Helper: Handle Logout
// ========================================
async function handleLogout() {
  console.log('🚪 Logging out user...')
  
  // Clear all auth data from localStorage
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  localStorage.removeItem('roles')
  localStorage.removeItem('permissions')
  localStorage.removeItem('firebaseToken')
  localStorage.removeItem('jwtToken')
  localStorage.removeItem('tokenType')
  localStorage.removeItem('tokenExpiresAt')
  
  console.log('🗑️ Auth data cleared from localStorage')
  
  // Logout from Firebase
  try {
    await logout()
    console.log('✅ Firebase logout successful')
  } catch (logoutError) {
    console.error('❌ Firebase logout error:', logoutError)
  }
  
  // Redirect to login (only if not already on login page)
  if (router.currentRoute.value.path !== '/login') {
    console.log('🔄 Redirecting to login...')
    router.push({
      path: '/login',
      query: { 
        redirect: router.currentRoute.value.fullPath,
        reason: 'session_expired'
      }
    })
  }
}

export default axiosInstance