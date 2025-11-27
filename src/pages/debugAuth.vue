<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFirebaseToken, checkAuthSession, refreshFirebaseToken } from '../utils/auth'
import { useAuth } from '../composable/useAuth'

const router = useRouter()
const { user, roles, permissions, isAuthenticated } = useAuth()

const authData = ref({
  localStorage: {},
  composable: {},
  firebase: {},
  session: {}
})

const loading = ref(false)
const message = ref('')

onMounted(() => {
  loadAuthData()
})

const loadAuthData = async () => {
  loading.value = true
  
  try {
    // Check localStorage
    authData.value.localStorage = {
      isAuthenticated: localStorage.getItem('isAuthenticated'),
      hasUser: localStorage.getItem('user') !== null,
      hasRoles: localStorage.getItem('roles') !== null,
      hasPermissions: localStorage.getItem('permissions') !== null,
      hasFirebaseToken: localStorage.getItem('firebaseToken') !== null,
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
      roles: localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : null,
      permissions: localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions')) : null
    }

    // Check composable state
    authData.value.composable = {
      isAuthenticated: isAuthenticated.value,
      user: user.value,
      roles: roles.value,
      permissions: permissions.value
    }

    // Check Firebase token
    try {
      const token = await getFirebaseToken()
      authData.value.firebase = {
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 50) + '...' : null
      }
    } catch (error) {
      authData.value.firebase = {
        error: error.message
      }
    }

    // Check session validity
    authData.value.session = {
      isValid: checkAuthSession()
    }

  } catch (error) {
    console.error('Error loading auth data:', error)
    message.value = 'Error: ' + error.message
  } finally {
    loading.value = false
  }
}

const handleRefreshToken = async () => {
  loading.value = true
  message.value = ''
  
  try {
    const token = await refreshFirebaseToken()
    
    if (token) {
      message.value = '✅ Token refreshed successfully'
      await loadAuthData()
    } else {
      message.value = '❌ Failed to refresh token'
    }
  } catch (error) {
    message.value = '❌ Error: ' + error.message
  } finally {
    loading.value = false
  }
}

const handleClearAuth = () => {
  if (confirm('Clear all auth data?')) {
    localStorage.clear()
    sessionStorage.clear()
    message.value = '🗑️ Auth data cleared'
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
}

const handleGoBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">🔍 Debug Auth State</h1>
          <button
            @click="handleGoBack"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back
          </button>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mb-6">
          <button
            @click="loadAuthData"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            🔄 Reload Data
          </button>
          <button
            @click="handleRefreshToken"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            🔑 Refresh Token
          </button>
          <button
            @click="handleClearAuth"
            :disabled="loading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            🗑️ Clear Auth
          </button>
        </div>

        <!-- Message -->
        <div v-if="message" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">{{ message }}</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600">Loading...</p>
        </div>

        <!-- Auth Data -->
        <div v-else class="space-y-6">
          <!-- Session Status -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-3 text-gray-800">📊 Session Status</h2>
            <div class="bg-gray-50 p-3 rounded">
              <p class="font-mono text-sm">
                Valid: 
                <span :class="authData.session.isValid ? 'text-green-600' : 'text-red-600'" class="font-bold">
                  {{ authData.session.isValid ? '✅ YES' : '❌ NO' }}
                </span>
              </p>
            </div>
          </div>

          <!-- LocalStorage -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-3 text-gray-800">💾 LocalStorage</h2>
            <pre class="bg-gray-50 p-3 rounded overflow-x-auto text-xs">{{ JSON.stringify(authData.localStorage, null, 2) }}</pre>
          </div>

          <!-- Composable State -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-3 text-gray-800">⚛️ Composable State</h2>
            <pre class="bg-gray-50 p-3 rounded overflow-x-auto text-xs">{{ JSON.stringify(authData.composable, null, 2) }}</pre>
          </div>

          <!-- Firebase -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-3 text-gray-800">🔥 Firebase</h2>
            <pre class="bg-gray-50 p-3 rounded overflow-x-auto text-xs">{{ JSON.stringify(authData.firebase, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>