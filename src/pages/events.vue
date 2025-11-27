<template>
  <div class="min-h-screen bg-[#7A0000] text-white">
    <!-- Header -->
    <header class="flex justify-between items-center px-8 py-4 bg-[#7A0000]/90 shadow-md">
      <div class="flex items-center gap-3">
        <button class="text-white lg:hidden" @click="toggleMenu">
          <i class="fas fa-bars text-2xl"></i>
        </button>
        <img src="/logo-jagad.png" alt="Logo" class="w-10 h-10" />
        <h1 class="text-xl font-bold tracking-wide">JAGADBADUNG</h1>
      </div>
      <button
        @click="logout"
        class="flex items-center gap-2 border border-white/70 text-white px-4 py-2 rounded-full hover:bg-white hover:text-[#7A0000] transition"
      >
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </header>

    <!-- Hero Section -->
    <section class="text-center mt-10">
      <h2 class="text-4xl font-extrabold mb-2">Event Terbaru</h2>
      <p class="text-white/80 text-lg mb-8">
        Temukan pengalaman tak terlupakan di Badung
      </p>

      <!-- Search Bar -->
      <div class="flex justify-center items-center gap-3 w-full px-4 sm:px-0">
        <div
          class="flex items-center bg-white text-gray-700 w-full sm:w-[600px] rounded-full px-4 py-2 shadow-md"
        >
          <i class="fas fa-search text-gray-500 mr-3"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari event..."
            class="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>
        <button
          @click="toggleFilter"
          class="bg-[#9B1C1C] hover:bg-[#b01f1f] text-white px-5 py-2 rounded-full shadow-md transition"
        >
          <i class="fas fa-filter mr-2"></i> Filter
        </button>
      </div>
    </section>

    <!-- Event Cards -->
    <section
      v-if="!loading"
      class="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 sm:px-16 py-16"
    >
      <div
        v-for="event in filteredEvents"
        :key="event.id_event"
        class="bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer"
        @click="goToDetail(event.id_event)"
      >
        <!-- Banner -->
        <div class="relative">
          <img
            :src="getBannerUrl(event.banner)"
            alt="Banner Event"
            class="w-full h-48 object-cover"
          />

          <!-- Label Kategori -->
          <div
            class="absolute top-2 right-2 bg-[#7A0000] text-white text-xs font-semibold px-3 py-1 rounded-full"
          >
            {{ getKategori(event) }}
          </div>

          <!-- Status -->
          <div
            class="absolute top-2 left-2 bg-white text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
          >
            <span class="w-2 h-2 bg-green-500 rounded-full"></span> Available
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5">
          <h3 class="text-lg font-bold mb-1">{{ event.nama_event }}</h3>
          <div class="flex items-center text-sm text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-2"></i>
            {{ event.lokasi }}
          </div>

          <div class="flex items-center text-sm text-gray-600 mb-4">
            <i class="fas fa-calendar-alt mr-2"></i>
            {{ formatDate(event.start_time) }}
          </div>

          <!-- ✅ PRICE DISPLAY (FIXED) -->
          <div class="flex justify-between items-center">
            <div class="text-[#7A0000] font-bold text-lg">
              <!-- Satu harga -->
              <template v-if="getPriceDisplay(event).type === 'single'">
                <p>{{ getPriceDisplay(event).value }}</p>
              </template>

              <!-- Harga range -->
              <template v-else-if="getPriceDisplay(event).type === 'range'">
  <div class="flex flex-col leading-tight w-max">

    <!-- Harga minimum -->
    <p>{{ getPriceDisplay(event).min }}</p>

    <!-- Garis di tengah berdasarkan lebar teks -->
    <div class="flex justify-center my-1">
      <div class="border-t-2 border-gray-700 w-4"></div>
    </div>

    <!-- Harga maksimum -->
    <p>{{ getPriceDisplay(event).max }}</p>

  </div>
</template>

              
              <!-- Gratis -->
              <template v-else-if="getPriceDisplay(event).type === 'free'">
                <p>Free Entry</p>
              </template>

              <!-- Tidak ada harga -->
              <template v-else>
                <p class="text-gray-600">Harga belum tersedia</p>
              </template>
            </div>

            <button
              @click.stop="goToDetail(event.id_event)"
              class="bg-[#7A0000] hover:bg-[#9B1C1C] text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-3xl"></i>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && filteredEvents.length === 0"
      class="text-center text-white/80 py-20"
    >
      <p>Tidak ada event yang ditemukan.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../config/axios.js'

const router = useRouter()
const events = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterVisible = ref(false)

// ✅ Fetch events dengan jenis_tiket
const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get('/events/public')
    
    console.log('📡 Events response:', response.data)
    
    if (response.data.success) {
      events.value = response.data.data
      
      // Debug: Log event pertama untuk lihat struktur
      if (events.value.length > 0) {
        console.log('📊 Sample event structure:', events.value[0])
      }
    }
  } catch (error) {
    console.error('❌ Gagal mengambil event:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchEvents)

const filteredEvents = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return events.value.filter((e) => e.nama_event.toLowerCase().includes(q))
})

// ✅ Get price display berdasarkan jenis_tiket
const getPriceDisplay = (event) => {
  if (!event.berbayar) {
    return { type: 'free' }
  }

  const jenisTiket = event.jenis_tiket || event.jenisTiket || []

  if (!Array.isArray(jenisTiket) || jenisTiket.length === 0) {
    return { type: 'none' }
  }

  const prices = jenisTiket
    .map(t => parseFloat(t.harga || 0))
    .filter(h => h > 0)

  if (prices.length === 0) {
    return { type: 'none' }
  }

  if (prices.length === 1) {
    return { type: 'single', value: formatPrice(prices[0]) }
  }

  // More than one price → range format
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  return {
    type: 'range',
    min: formatPrice(minPrice),
    max: formatPrice(maxPrice)
  }
}



const getBannerUrl = (banner) => {
  if (!banner) return '/no-image.jpg'
  return `${axiosInstance.defaults.baseURL.replace('/api', '')}/storage/${banner}`
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const getKategori = (event) => {
  const nama = event.nama_event.toLowerCase()
  if (nama.includes('kecak') || nama.includes('budaya')) return 'Budaya'
  if (nama.includes('konser') || nama.includes('musik')) return 'Konser'
  return 'Umum'
}

const toggleFilter = () => {
  filterVisible.value = !filterVisible.value
}

const toggleMenu = () => {
  console.log('Toggle menu')
}

const goToDetail = (id) => {
  router.push({ name: 'EventDetail', params: { id } })
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>