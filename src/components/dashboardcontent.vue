<script setup>
import { ref, onMounted } from 'vue'

// ====== Scroll control ======
const scroller = ref(null)
const scrollByX = (x) => scroller.value?.scrollBy({ left: x, behavior: 'smooth' })
const scrollLeft = () => scrollByX(-400)
const scrollRight = () => scrollByX(400)

// ====== Animation state ======
const isLoaded = ref(false)
onMounted(() => {
  setTimeout(() => isLoaded.value = true, 100)
})

// ====== Data dummy (ganti dengan API nanti) ======
const events = [
  {
    cover: '/event-1.jpg',
    title: 'Tari Kecak GWK',
    date: '25 Oktober 2025',
    location: 'Jimbaran, Badung',
    price: 'IDR. 100.000',
    status: 'Available'
  },
  {
    cover: '/event-2.jpg',
    title: 'Festival Seni Budaya Badung',
    date: '15 Oktober 2025',
    location: 'Jimbaran, Badung',
    price: 'Free Entry',
    status: 'Available'
  },
  {
    cover: '/event-3.jpg',
    title: 'Konser Nak Badung',
    date: '21 Oktober 2025',
    location: 'Jimbaran Hub',
    price: 'IDR. 150.000',
    status: 'Available'
  },
  {
    cover: '/event-4.jpg',
    title: 'Pesta Rakyat',
    date: '21 Oktober 2025',
    location: 'Lapangan PusPem',
    price: 'Free Entry',
    status: 'Available'
  },
  {
    cover: '/event-3.jpg',
    title: 'Badung Night Fest',
    date: '28 Oktober 2025',
    location: 'Canggu',
    price: 'IDR. 75.000',
    status: 'Available'
  }
]

const stats = [
  { icon: '🎭', number: '500+', label: 'Events' },
  { icon: '🎫', number: '50K+', label: 'Tickets Sold' },
  { icon: '⭐', number: '4.9', label: 'Rating' }
]
</script>

<template>
  <!-- Container -->
  <div class="max-w-[90rem] mx-auto px-6 py-8 space-y-12">
    <!-- Banner dengan Gradient & Shadow -->
    <div
      :class="['bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 relative overflow-hidden',
               'shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6',
               'transition-all duration-700 transform',
               isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
    >
      <!-- Decorative Elements -->
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-[#6e0b0b]/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-[#6e0b0b]/5 rounded-full blur-3xl"></div>

      <!-- Text -->
      <div class="md:w-1/2 space-y-4 relative z-10">
        <div class="inline-block px-3 py-1.5 bg-[#6e0b0b]/10 rounded-full text-[#6e0b0b] text-xs font-semibold">
          🎉 Platform Tiket Terpercaya
        </div>
        <h2 class="text-2xl md:text-4xl font-extrabold leading-tight text-[#6e0b0b]">
          Selamat Datang di <br />
          <span class="bg-gradient-to-r from-[#6e0b0b] to-[#a01515] bg-clip-text text-transparent">
            JAGADBADUNG!
          </span>
        </h2>
        <p class="text-gray-700 text-base md:text-lg max-w-lg leading-relaxed">
          Pilih event terbaikmu dan pesan tiketnya sekarang juga!
        </p>
        
        <!-- Stats Mini -->
        <div class="flex gap-4 pt-2">
          <div v-for="(stat, i) in stats" :key="i" class="text-center">
            <div class="text-xl">{{ stat.icon }}</div>
            <div class="text-lg font-bold text-[#6e0b0b]">{{ stat.number }}</div>
            <div class="text-xs text-gray-600">{{ stat.label }}</div>
          </div>
        </div>

        <router-link
          to="/events"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-[#6e0b0b] to-[#8b1111] text-white 
                 px-6 py-3 rounded-xl font-bold text-base hover:shadow-2xl hover:scale-105 
                 transition-all duration-300 group"
        >
          <span>🎟️ Beli Sekarang</span>
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </router-link>
      </div>

      <!-- Image -->
      <div class="md:w-1/2 flex justify-center md:justify-end relative">
        <div class="absolute inset-0 bg-gradient-to-tr from-[#6e0b0b]/20 to-transparent rounded-3xl blur-2xl"></div>
        <img
          src="/pejabat.png"
          alt="Pejabat Badung"
          class="h-44 md:h-56 lg:h-64 object-contain drop-shadow-2xl relative z-10 
                 hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>

    <!-- Section title dengan animasi -->
    <div 
      :class="['transition-all duration-700 transform delay-200',
               isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
    >
      <div class="flex items-center gap-4 mb-2">
        <div class="h-1 w-12 bg-gradient-to-r from-white to-transparent rounded-full"></div>
        <h3 class="text-3xl md:text-4xl font-extrabold">Sedang Berjalan</h3>
      </div>
      <p class="text-white/80 text-base md:text-lg ml-16">Temukan event yang paling banyak dicari</p>
    </div>

    <!-- Scrollable events dengan hover effects -->
    <div 
      :class="['relative transition-all duration-700 transform delay-300',
               isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
    >
      <!-- track scroll -->
      <div
        ref="scroller"
        class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory
               scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10 
               hover:scrollbar-thumb-white/60 transition-all"
      >
        <div
          v-for="(e, i) in events"
          :key="i"
          :style="{ animationDelay: `${i * 100}ms` }"
          class="min-w-[340px] sm:min-w-[380px] md:min-w-[400px] snap-start flex-shrink-0
                 animate-fade-in-up group cursor-pointer"
        >
          <!-- Card Container -->
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl 
                      hover:shadow-2xl transition-all duration-500 hover:-translate-y-2
                      border border-white/20">
            <!-- Image Container -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="e.cover" 
                :alt="e.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm 
                          rounded-full text-white text-xs font-bold shadow-lg">
                {{ e.status }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 space-y-3">
              <!-- Title -->
              <h4 class="text-xl font-bold text-[#6e0b0b] line-clamp-1 group-hover:text-[#8b1111] 
                         transition-colors">
                {{ e.title }}
              </h4>

              <!-- Date & Location -->
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#6e0b0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium">{{ e.date }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#6e0b0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="font-medium">{{ e.location }}</span>
                </div>
              </div>

              <!-- Price & Button -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p class="text-xs text-gray-500 font-medium">Harga</p>
                  <p class="text-lg font-bold text-[#6e0b0b]">{{ e.price }}</p>
                </div>
                <button class="px-5 py-2.5 bg-gradient-to-r from-[#6e0b0b] to-[#8b1111] 
                               text-white rounded-xl font-semibold text-sm
                               hover:shadow-lg hover:scale-105 transition-all duration-300
                               flex items-center gap-2 group">
                  <span>Beli</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- tombol panah dengan styling modern -->
      <button
        @click="scrollLeft"
        class="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 h-14 w-14 items-center justify-center
               rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md 
               ring-2 ring-white/30 hover:ring-white/50 transition-all hover:scale-110
               shadow-xl text-3xl font-light"
        aria-label="Scroll kiri"
      >
        ‹
      </button>
      <button
        @click="scrollRight"
        class="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 h-14 w-14 items-center justify-center
               rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md 
               ring-2 ring-white/30 hover:ring-white/50 transition-all hover:scale-110
               shadow-xl text-3xl font-light"
        aria-label="Scroll kanan"
      >
        ›
      </button>
    </div>

    <!-- Footer Info -->
    <div 
      :class="['text-center py-8 transition-all duration-700 transform delay-500',
               isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
    >
      <p class="text-white/60 text-sm">
        © 2025 JAGADBADUNG. Bringing Badung's culture to your fingertips.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

/* Custom scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.6);
}
</style>