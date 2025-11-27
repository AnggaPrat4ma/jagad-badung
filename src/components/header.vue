<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const signOut = () => {
  router.push('/login')
}

const emit = defineEmits(['toggle-sidebar'])
</script>

<template>
  <header
    class="bg-[#faf5f5]/95 backdrop-blur-md text-[#6e0b0b] sticky top-0 z-30 shadow-sm border-b border-[#6e0b0b]/10"
  >
    <div class="w-full h-16 px-6 flex items-center justify-between">
      <!-- Kiri: tombol & logo -->
      <div class="flex items-center gap-4">
        <!-- Tombol menu -->
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 hover:bg-[#6e0b0b]/10 rounded-lg transition-colors"
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

        <!-- Logo dan judul -->
        <div class="flex items-center gap-3">
          <img
            src="/logo-jagad.png"
            alt="Jagad Badung"
            class="h-9 w-auto object-contain drop-shadow-sm"
          />
          <h1 class="font-extrabold tracking-wide text-lg">
            JAGAD<span class="opacity-90">BADUNG</span>
          </h1>
        </div>
      </div>

      <!-- Kanan: Sign Out -->
      <button
        @click="signOut"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#6e0b0b]/30 
               text-[#6e0b0b] hover:bg-[#6e0b0b] hover:text-white hover:border-[#6e0b0b]
               font-semibold text-sm transition-all duration-300 group"
      >
        <svg
          class="w-5 h-5 group-hover:rotate-12 transition-transform"
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
        <span>Sign Out</span>
      </button>
    </div>
  </header>
</template>
