<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const closeSidebar = () => emit('close')

const menuItems = [
  { icon: '👤', label: 'Profile', path: '/profile' },
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '🎭', label: 'Events', path: '/events' },
  { icon: '🎫', label: 'My Ticket', path: '/myticket' },
  { icon: 'ℹ️', label: 'About Us', path: '/aboutus' },
  { icon: '🛡️', label: 'Admin', path: '/admin' }, // ✅ ikon baru untuk admin
  { icon: '🏢', label: 'EO', path: '/eo' }, // ✅ ikon baru untuk admin
]

</script>

<template>
  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed top-0 left-0 h-full w-72 bg-white text-[#6e0b0b] shadow-2xl z-50 p-6"
    >
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <img src="/logo-jagad.png" alt="Logo" class="h-15 w-11" />
          <h2 class="font-extrabold text-lg">JAGADBADUNG</h2>
        </div>
        <button
          @click="closeSidebar"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav class="space-y-2">
        <router-link
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.path"
          @click="closeSidebar"
          class="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#6e0b0b]/10 transition group font-semibold"
        >
          <span class="text-2xl group-hover:scale-110 transition-transform">{{
            item.icon
          }}</span>
          <span class="group-hover:translate-x-1 transition-transform">{{
            item.label
          }}</span>
        </router-link>
      </nav>
    </aside>
  </transition>
</template>

<style scoped>
/* Animasi slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
