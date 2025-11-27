<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'

// 🧩 Props agar bisa dikontrol dari luar
defineProps({
  hideSidebar: { type: Boolean, default: false },
  hideNavbar: { type: Boolean, default: false },
  plainBackground: { type: Boolean, default: false } // 👈 tambahan baru
})

const isSidebarOpen = ref(false)
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)
const closeSidebar = () => (isSidebarOpen.value = false)
</script>

<template>
  <!-- Wrapper utama -->
  <div
    :class="[
      'min-h-screen relative overflow-hidden transition-colors duration-300',
      plainBackground
        ? 'bg-[#f6f4f4] text-[#6e0b0b]'    // 👈 background abu muda untuk halaman seperti My Ticket
        : 'bg-gradient-to-br from-[#6e0b0b] via-[#8b1111] to-[#6e0b0b] text-white'
    ]"
  >
    <!-- Sidebar -->
    <Sidebar
      v-if="!hideSidebar"
      :is-open="isSidebarOpen"
      @close="closeSidebar"
    />

    <!-- Navbar -->
    <header
      v-if="!hideNavbar"
      class="bg-white/90 backdrop-blur text-[#6e0b0b] sticky top-0 z-30 shadow border-b border-gray-200"
    >
      <div class="w-full h-16 px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Tombol burger hanya tampil jika sidebar aktif -->
          <button
            v-if="!hideSidebar"
            @click="toggleSidebar"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              class="w-6 h-6"
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
          <div class="flex items-center gap-3">
            <img src="/logo-jagad.png" class="h-10 w-10" />
            <h1 class="font-extrabold text-lg">JAGADBADUNG</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Konten utama -->
    <main class="relative z-10 p-6 md:p-10">
      <slot />
    </main>
  </div>
</template>
