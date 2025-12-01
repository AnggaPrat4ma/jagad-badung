<script setup>
import { useRouter } from 'vue-router'
import { logout } from '../utils/auth'
import { useAuth } from '../composable/useAuth'

const router = useRouter()
const emit = defineEmits(['toggle-sidebar'])

// Get auth composable
const { logout: logoutFromComposable } = useAuth()

// ✅ Open sidebar
const openSidebar = () => {
  emit('toggle-sidebar')
}

// ✅ Logout function with confirmationn
const handleLogout = async () => {
  // Ask for confirmation
  const confirmed = confirm('Are you sure you want to logout?')
  
  if (!confirmed) {
    return
  }

  try {
    console.log('🔓 Logging out...')

    // Clear all localStorage data
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('roles')
    localStorage.removeItem('permissions')
    localStorage.removeItem('firebaseToken')
    localStorage.removeItem('token') // legacy token if exists
    
    // Clear sessionStorage
    sessionStorage.clear()

    console.log('🗑️ Local storage cleared')

    // Logout from Firebase
    try {
      await logout()
      console.log('✅ Firebase logout successful')
    } catch (firebaseError) {
      console.error('⚠️ Firebase logout error:', firebaseError)
      // Continue even if Firebase logout fails
    }

    // Use composable logout to clear state
    try {
      await logoutFromComposable()
    } catch (composableError) {
      console.error('⚠️ Composable logout error:', composableError)
    }

    console.log('✅ Logout completed, redirecting to login...')

    // Redirect to login
    router.push('/login')
    
  } catch (error) {
    console.error('❌ Logout error:', error)
    
    // Force logout anyway - clear everything and redirect
    localStorage.clear()
    sessionStorage.clear()
    router.push('/login')
  }
}
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 bg-white text-[#6e0b0b] shadow-md border-b border-gray-100"
  >
    <div class="flex items-center justify-between h-16 px-6 md:px-10">
      <!-- 🔹 Kiri: Tombol hamburger + logo -->
      <div class="flex items-center gap-3">
        <!-- Tombol Hamburger -->
        <button
          @click="openSidebar"
          class="inline-flex items-center justify-center p-2 rounded-lg hover:bg-red-50 transition"
          aria-label="Open sidebar"
        >
          <svg
            class="w-7 h-7 text-[#6e0b0b]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <img
            src="/logo-jagad.png"
            alt="Jagad Badung"
            class="h-9 w-auto object-contain"
          />
          <span class="font-extrabold text-lg tracking-wide text-[#6e0b0b]">
            JAGADBADUNG
          </span>
        </router-link>
      </div>

      <!-- 🔸 Kanan: Tombol Logout -->
      <div class="flex items-center">
        <button
          @click="handleLogout"
          class="flex items-center gap-2 rounded-full border border-[#6e0b0b]/40 px-5 py-2 text-[#6e0b0b] font-semibold hover:bg-[#6e0b0b] hover:text-white transition"
          aria-label="Logout"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>