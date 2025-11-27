// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { logout as firebaseLogout } from '../utils/auth'

// ✅ Reactive state (shared across all components)
const user = ref(null)
const roles = ref([])
const permissions = ref([])
const isAuthenticated = ref(false)

// ✅ Initialize from localStorage
function initializeAuth() {
  const storedUser = localStorage.getItem('user')
  const storedRoles = localStorage.getItem('roles')
  const storedPermissions = localStorage.getItem('permissions')
  const storedAuth = localStorage.getItem('isAuthenticated')

  if (storedAuth === 'true' && storedUser) {
    user.value = JSON.parse(storedUser)
    roles.value = JSON.parse(storedRoles || '[]')
    permissions.value = JSON.parse(storedPermissions || '[]')
    isAuthenticated.value = true

    console.log('✅ Auth state initialized from localStorage')
  }
}

// Initialize on module load
initializeAuth()

export function useAuth() {
  const router = useRouter()

  // ✅ Computed properties
  const isAdmin = computed(() => roles.value.includes('Admin'))
  const isEO = computed(() => roles.value.includes('EO'))
  const isUser = computed(() => roles.value.includes('User'))

  // ✅ Check if user has specific role
  const hasRole = (roleName) => {
    return roles.value.includes(roleName)
  }

  // ✅ Check if user has specific permission
  const hasPermission = (permissionName) => {
    return permissions.value.includes(permissionName)
  }

  // ✅ Check if user has any of the roles
  const hasAnyRole = (roleNames) => {
    return roleNames.some(role => roles.value.includes(role))
  }

  // ✅ Logout function
  const logout = async () => {
    try {
      console.log('🔓 Logging out...')

      // Clear state
      user.value = null
      roles.value = []
      permissions.value = []
      isAuthenticated.value = false

      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('roles')
      localStorage.removeItem('permissions')
      localStorage.removeItem('firebaseToken')
      localStorage.removeItem('isAuthenticated')

      // Firebase logout
      await firebaseLogout()

      console.log('✅ Logged out successfully')

      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
  }

  // ✅ Update user data
  const updateUser = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return {
    // State
    user,
    roles,
    permissions,
    isAuthenticated,

    // Computed
    isAdmin,
    isEO,
    isUser,

    // Methods
    hasRole,
    hasPermission,
    hasAnyRole,
    logout,
    updateUser,
    initializeAuth
  }
}