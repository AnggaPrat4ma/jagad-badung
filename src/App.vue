<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from './components/navbar.vue'
import Sidebar from './components/sidebar.vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composable/useAuth'

const isSidebarOpen = ref(false)
const route = useRoute()

// Auth initialization
const { initializeAuth } = useAuth()

onMounted(() => {
  initializeAuth()
  console.log('🚀 App mounted - Auth state initialized')
})

// ✅ Hide layout (navbar & sidebar) if route.meta.hideNavbar = true
const hideLayout = computed(() => {
  return route.meta?.hideNavbar === true
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen">
    <!-- ✅ Navbar -->
    <Navbar 
      v-if="!hideLayout"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- ✅ Sidebar -->
    <Sidebar 
      v-if="!hideLayout"
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false"
    />

    <!-- ✅ Page Content -->
    <router-view />
  </div>
</template>
