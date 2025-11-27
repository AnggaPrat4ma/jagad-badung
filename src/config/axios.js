// src/config/axios.js
import axios from 'axios'
import { getFirebaseToken, logout } from '../utils/auth'
import router from '../router'

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.150:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// ✅ Request Interceptor - Inject Firebase Token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get Firebase token
      let token = await getFirebaseToken()
      
      // If no token from Firebase, try from localStorage (backup)
      if (!token) {
        token = localStorage.getItem('firebaseToken')
        
        if (token) {
          console.log('⚠️ Using token from localStorage (Firebase not ready)')
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('🔹 Request with token:', config.method?.toUpperCase(), config.url)
      } else {
        console.log('⚠️ Request without token:', config.method?.toUpperCase(), config.url)
      }
    } catch (err) {
      console.error('❌ Failed to retrieve Firebase token:', err)
      
      // Fallback: try localStorage token
      const fallbackToken = localStorage.getItem('firebaseToken')
      if (fallbackToken) {
        config.headers.Authorization = `Bearer ${fallbackToken}`
        console.log('⚠️ Using fallback token from localStorage')
      }
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// ✅ Response Interceptor - Handle Errors & Auto Logout on 401
axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response
    console.log('✅ Response:', response.status, response.config.url)
    return response
  },
  async (error) => {
    if (error.response) {
      const status = error.response.status
      const url = error.config?.url || 'unknown'

      console.error(`❌ Response error ${status} on ${url}:`, error.response.data)

      // ========================================
      // Handle 401 Unauthorized (Token Expired)
      // ========================================
      if (status === 401) {
        console.error('🔒 Unauthorized - Token expired or invalid')
        
        // Clear all auth data from localStorage
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        localStorage.removeItem('roles')
        localStorage.removeItem('permissions')
        localStorage.removeItem('firebaseToken')
        
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
        
        return Promise.reject(new Error('Session expired. Please login again.'))
      }

      // ========================================
      // Handle 403 Forbidden (Insufficient Permissions)
      // ========================================
      if (status === 403) {
        console.error('🚫 Forbidden - Insufficient permissions')
        
        const message = error.response.data?.message || 
                       'You do not have permission to access this resource.'
        
        // Optional: Show notification to user
        alert(message)
        
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
        alert(message)
        
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
      alert(message)
      
      return Promise.reject(new Error(message))
    }

    // ========================================
    // Handle Other Errors
    // ========================================
    console.error('❌ Unexpected error:', error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance