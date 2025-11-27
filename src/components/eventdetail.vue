<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import axiosInstance from '../config/axios.js'

const route = useRoute()
const router = useRouter()

// Data event dan tiket dari API
const event = ref(null)
const jenisTiket = ref([])
const loading = ref(true)
const loadingTickets = ref(false)
const error = ref(null)
const processingOrder = ref(false)

const ticketQuantity = ref(1)
const selectedTicketType = ref(null)

const canRegister = ref(true)
const checkingRegistration = ref(false)

const checkCanRegister = async () => {
  if (!event.value) return
  
  try {
    checkingRegistration.value = true
    const response = await axiosInstance.get(`/transaksi/can-register/${event.value.id_event}`)
    
    if (response.data.success) {
      canRegister.value = response.data.data.can_register
    }
  } catch (err) {
    console.error('Error checking registration:', err)
    canRegister.value = true // Default allow if check fails
  } finally {
    checkingRegistration.value = false
  }
}

// Fetch event detail dari API
const fetchEventDetail = async () => {
  try {
    loading.value = true
    const eventId = route.params.id
    const response = await axiosInstance.get(`/events/${eventId}`)
    
    if (response.data.success) {
      event.value = response.data.data
      await fetchJenisTiket(eventId)
    } else {
      error.value = 'Event tidak ditemukan'
    }
  } catch (err) {
    console.error('Error fetching event detail:', err)
    error.value = 'Gagal memuat detail event'
  } finally {
    loading.value = false
  }
}

// Fetch jenis tiket untuk event ini
const fetchJenisTiket = async (eventId) => {
  try {
    loadingTickets.value = true
    const response = await axiosInstance.get(`/jenis-tiket/event/${eventId}`)
    
    if (response.data.success) {
      jenisTiket.value = response.data.data.jenis_tiket || []
      
      if (jenisTiket.value.length > 0) {
        selectedTicketType.value = jenisTiket.value[0]
      }
    }
  } catch (err) {
    console.error('Error fetching jenis tiket:', err)
    jenisTiket.value = []
  } finally {
    loadingTickets.value = false
  }
}

onMounted(async() => {
  await fetchEventDetail()
  await checkCanRegister() // ✅ Check registration status
  loadMidtransScript()
})

// Load Midtrans Snap.js
const loadMidtransScript = () => {
  const script = document.createElement('script')
  script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
  script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'YOUR_CLIENT_KEY')
  document.head.appendChild(script)
}

const getBannerUrl = (banner) => {
  if (!banner) return '/no-image.jpg'
  return `${axiosInstance.defaults.baseURL.replace('/api', '')}/storage/${banner}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatTime = (startTime, endTime) => {
  if (!startTime) return '-'
  const start = new Date(startTime).toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Asia/Makassar'
  })
  
  if (endTime) {
    const end = new Date(endTime).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Makassar'
    })
    return `${start} - ${end} WITA`
  }
  
  return `${start} WITA`
}

const formatPrice = (price) => {
  if (!price || price === 0) return 'Free Entry'
  return `IDR ${parseInt(price).toLocaleString('id-ID')}`
}

const currentPrice = computed(() => {
  if (!event.value) return 0
  if (!event.value.berbayar || event.value.harga === 0) return 0
  if (selectedTicketType.value) {
    return selectedTicketType.value.harga
  }
  return event.value.harga || 0
})

const totalPrice = computed(() => {
  if (currentPrice.value === 0) return 'Free Entry'
  return `IDR ${(currentPrice.value * ticketQuantity.value).toLocaleString('id-ID')}`
})

const displayPrice = computed(() => {
  if (!selectedTicketType.value) return 'Pilih Tiket'
  return formatPrice(selectedTicketType.value.harga)
})

const isFreeEvent = computed(() => {
  console.log('🔍 Checking isFreeEvent...')
  console.log('📊 event.value:', event.value)
  console.log('📊 jenisTiket.value:', jenisTiket.value)
  
  if (!event.value) {
    console.log('❌ No event data')
    return false
  }
  
  // Method 1: Check dari jenis tiket (PRIORITAS UTAMA)
  if (jenisTiket.value && jenisTiket.value.length > 0) {
    const allFree = jenisTiket.value.every(t => {
      const harga = parseFloat(t.harga)
      console.log(`  - Tiket "${t.nama_tiket}": harga = ${harga}`)
      return harga === 0
    })
    
    if (allFree) {
      console.log('✅ All tickets are FREE (from jenisTiket)')
      return true
    }
  }
  
  // Method 2: Check dari event.berbayar
  if (event.value.berbayar === false || event.value.berbayar === 0 || event.value.berbayar === '0') {
    console.log('✅ Event is FREE (from event.berbayar)')
    return true
  }
  
  // Method 3: Check dari selectedTicketType
  if (selectedTicketType.value) {
    const harga = parseFloat(selectedTicketType.value.harga)
    if (harga === 0) {
      console.log('✅ Selected ticket is FREE')
      return true
    }
  }
  
  console.log('❌ Event is NOT free')
  return false
})

const getKategori = () => {
  if (!event.value) return 'Umum'
  const nama = event.value.nama_event?.toLowerCase() || ''
  if (nama.includes('kecak') || nama.includes('budaya')) return 'Budaya'
  if (nama.includes('konser') || nama.includes('musik')) return 'Konser'
  if (nama.includes('seni')) return 'Seni'
  if (nama.includes('festival')) return 'Festival'
  return 'Umum'
}

const incrementQuantity = () => {
  if (ticketQuantity.value < 10) ticketQuantity.value++
}

const decrementQuantity = () => {
  if (ticketQuantity.value > 1) ticketQuantity.value--
}

const goBack = () => {
  router.push({ name: 'events' })
}

const selectTicketType = (ticketType) => {
  selectedTicketType.value = ticketType
  ticketQuantity.value = 1
}

// Ganti fungsi buyTicket dengan versi yang sudah diperbaiki ini:

const buyTicket = async () => {
  console.log('🎯 buyTicket called')
  console.log('📊 isFreeEvent:', isFreeEvent.value)
  console.log('📊 canRegister:', canRegister.value)
  console.log('📊 event:', event.value)
  console.log('📊 jenisTiket:', jenisTiket.value)
  console.log('📊 selectedTicketType:', selectedTicketType.value)
  
  // ✅ Validasi untuk FREE event
  if (isFreeEvent.value) {
    console.log('✅ FREE EVENT - Starting registration')
    
    if (!canRegister.value) {
      alert('Anda sudah terdaftar untuk event ini')
      return
    }

    if (!jenisTiket.value || jenisTiket.value.length === 0) {
      console.error('❌ No jenisTiket available')
      alert('Belum ada tiket tersedia untuk event ini')
      return
    }

    const freeTicket = selectedTicketType.value || jenisTiket.value[0]
    console.log('🎟️ Selected free ticket:', freeTicket)

    if (!freeTicket) {
      alert('Tiket tidak tersedia')
      return
    }

    const confirmed = confirm(`Daftar untuk ${event.value.nama_event}?\n\nTiket: ${freeTicket.nama_tiket}\nGRATIS`)
    if (!confirmed) return

    try {
      processingOrder.value = true

      const payload = {
        id_jenis_tiket: parseInt(freeTicket.id_jenis_tiket),
        jumlah_tiket: 1
      }
      
      console.log('📤 Sending payload:', payload)
      console.log('🔗 Endpoint:', '/transaksi/register-free')

      const response = await axiosInstance.post('/transaksi/register-free', payload)

      console.log('✅ Registration response:', response.data)

      if (response.data.success) {
        alert(`🎉 Pendaftaran berhasil!\n\nEvent: ${event.value.nama_event}\nTiket: ${freeTicket.nama_tiket}\n\nTiket Anda sudah dibuat dan dapat dilihat di My Tickets`)
        router.push({ name: 'myticket' })
      } else {
        alert(response.data.message || 'Gagal melakukan pendaftaran')
      }

    } catch (err) {
      console.error('❌ Error registering free ticket:', err)
      console.error('❌ Error response:', err.response)
      console.error('❌ Error data:', err.response?.data)
      
      let errorMessage = 'Gagal melakukan pendaftaran'
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Kuota tiket habis atau Anda sudah terdaftar'
      }
      
      alert(errorMessage)
    } finally {
      processingOrder.value = false
    }
    return // ✅ PENTING: harus return di sini
  }

  // ✅ Validasi untuk PAID event (existing logic)
  if (!selectedTicketType.value) {
    alert('Silakan pilih tipe tiket terlebih dahulu')
    return
  }

  if (ticketQuantity.value < 1) {
    alert('Jumlah tiket minimal 1')
    return
  }

  try {
    processingOrder.value = true

    // Get user data
    console.log('🔍 Fetching user data...')
    const userResponse = await axiosInstance.get('/auth/me')
    
    console.log('📦 User Response:', JSON.stringify(userResponse.data, null, 2))

    let userId = null
    
    if (userResponse.data.data?.id_user) {
      userId = userResponse.data.data.id_user
    } else if (userResponse.data.id_user) {
      userId = userResponse.data.id_user
    } else if (userResponse.data.data?.id) {
      userId = userResponse.data.data.id
    } else if (userResponse.data.id) {
      userId = userResponse.data.id
    } else {
      const user = localStorage.getItem('user')
      if (user) {
        const userData = JSON.parse(user)
        userId = userData.id_user || userData.id
      }
    }

    console.log('👤 User ID yang ditemukan:', userId)

    if (!userId) {
      console.error('❌ User ID tidak ditemukan')
      alert('Gagal mengambil data user. Silakan login kembali.')
      router.push({ name: 'login' })
      return
    }

    // Create paid transaction
    const payload = {
      id_user: parseInt(userId),
      id_jenis_tiket: parseInt(selectedTicketType.value.id_jenis_tiket),
      jumlah_tiket: parseInt(ticketQuantity.value)
    }

    console.log('📤 Payload yang dikirim:', JSON.stringify(payload, null, 2))

    const response = await axiosInstance.post('/midtrans/create-transaction', payload)

    console.log('✅ Response dari API:', response.data)

    if (response.data.success) {
      const { snap_token } = response.data.data

      // Open Midtrans Snap Payment
      if (window.snap) {
        window.snap.pay(snap_token, {
          onSuccess: function(result) {
            console.log('Payment success:', result)
            alert('Pembayaran berhasil! Tiket Anda sedang diproses.')
            router.push({ name: 'myticket' })
          },
          onPending: function(result) {
            console.log('Payment pending:', result)
            alert('Pembayaran pending. Silakan selesaikan pembayaran Anda.')
            router.push({ name: 'myticket' })
          },
          onError: function(result) {
            console.error('Payment error:', result)
            alert('Terjadi kesalahan pada pembayaran. Silakan coba lagi.')
          },
          onClose: function() {
            console.log('Payment popup closed')
            alert('Anda menutup halaman pembayaran. Transaksi masih tersimpan dan dapat dilanjutkan dari My Tickets.')
            router.push({ name: 'myticket' })
          }
        })
      } else {
        console.error('Midtrans Snap not loaded')
        alert('Sistem pembayaran belum siap. Silakan refresh halaman.')
      }
    }

  } catch (err) {
    console.error('❌ Error creating transaction:', err)
    console.error('❌ Error response:', err.response?.data)
    
    let errorMessage = 'Gagal membuat transaksi'
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.response?.status === 400) {
      errorMessage = 'Kuota tiket tidak mencukupi'
    } else if (err.response?.status === 422) {
      const errors = err.response?.data?.errors
      if (errors) {
        console.error('📋 Validation Errors:', errors)
        const errorList = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        errorMessage = 'Validasi gagal:\n' + errorList
      } else {
        errorMessage = 'Data tidak valid. Silakan coba lagi.'
      }
    } else if (err.response?.status === 401) {
      errorMessage = 'Silakan login terlebih dahulu'
      router.push({ name: 'login' })
      return
    } else if (err.message) {
      errorMessage = err.message
    }
    
    alert(errorMessage)
  } finally {
    processingOrder.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-4xl text-[#6e0b0b]"></i>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-bold text-red-800 mb-2">{{ error }}</h3>
        <button 
          @click="goBack"
          class="mt-4 bg-[#6e0b0b] text-white px-6 py-2 rounded-full hover:bg-[#8b1818] transition"
        >
          Kembali ke Events
        </button>
      </div>
    </div>

    <!-- Event Detail Content -->
    <section v-else-if="event" class="text-[#6e0b0b] max-w-6xl mx-auto">
      <!-- Back Button -->
      <button 
        @click="goBack"
        class="flex items-center gap-2 text-[#6e0b0b] hover:text-[#5a0909] font-semibold mb-6 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <!-- Hero Image -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#6e0b0b] mb-8">
        <div class="relative h-96 overflow-hidden">
          <img 
            :src="getBannerUrl(event.banner)" 
            :alt="event.nama_event" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          
          <!-- Status Badge -->
          <div class="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full text-base font-bold shadow-lg flex items-center gap-2">
            <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Available
          </div>

          <!-- Title -->
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <span class="inline-block bg-[#6e0b0b] text-white px-4 py-2 rounded-full text-sm font-bold mb-3">
              {{ getKategori() }}
            </span>
            <h1 class="text-5xl font-black text-white">{{ event.nama_event }}</h1>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#6e0b0b]/20">
            <h2 class="text-2xl font-black text-[#6e0b0b] mb-4">Tentang Event</h2>
            <p class="text-gray-700 leading-relaxed text-lg">
              {{ event.deskripsi || 'Deskripsi event akan segera hadir.' }}
            </p>
          </div>

          <!-- Event Details -->
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#6e0b0b]/20">
            <h2 class="text-2xl font-black text-[#6e0b0b] mb-6">Detail Event</h2>
            <div class="space-y-4">
              <!-- Date -->
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="bg-[#6e0b0b]/10 p-3 rounded-lg">
                  <svg class="w-6 h-6 text-[#6e0b0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">Tanggal</p>
                  <p class="font-bold text-gray-800 text-lg">{{ formatDate(event.start_time) }}</p>
                </div>
              </div>

              <!-- Time -->
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="bg-[#6e0b0b]/10 p-3 rounded-lg">
                  <svg class="w-6 h-6 text-[#6e0b0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">Waktu</p>
                  <p class="font-bold text-gray-800 text-lg">{{ formatTime(event.start_time, event.end_time) }}</p>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="bg-[#6e0b0b]/10 p-3 rounded-lg">
                  <svg class="w-6 h-6 text-[#6e0b0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">Lokasi</p>
                  <p class="font-bold text-gray-800 text-lg">{{ event.lokasi }}</p>
                </div>
              </div>

              <!-- Capacity -->
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="bg-[#6e0b0b]/10 p-3 rounded-lg">
                  <svg class="w-6 h-6 text-[#6e0b0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <!-- <div>
                  <p class="text-sm text-gray-500 font-medium">Kapasitas</p>
                  <p class="font-bold text-gray-800 text-lg">{{ event.kapasitas || 'Unlimited' }} orang</p>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Ticket Purchase -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-2xl p-6 border-4 border-[#6e0b0b] sticky top-6">
            <h3 class="text-xl font-black text-[#6e0b0b] mb-6">Pesan Tiket</h3>

            <!-- Already Registered Alert -->
            <div v-if="isFreeEvent && !canRegister && !checkingRegistration" class="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-bold text-blue-900">Sudah Terdaftar</p>
                  <p class="text-sm text-blue-700 mt-1">Anda sudah terdaftar untuk event ini. Lihat tiket Anda di halaman My Tickets.</p>
                  <button 
                    @click="$router.push({ name: 'myticket' })"
                    class="mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Lihat Tiket Saya
                  </button>
                </div>
              </div>
            </div>

            <!-- Checking Registration Status -->
            <div v-if="checkingRegistration" class="mb-6 flex items-center justify-center py-4">
              <i class="fas fa-spinner fa-spin text-xl text-[#6e0b0b] mr-2"></i>
              <span class="text-sm text-gray-600">Memeriksa status pendaftaran...</span>
            </div>
            
            <!-- Loading Tickets -->
            <div v-if="loadingTickets" class="flex justify-center py-8">
              <i class="fas fa-spinner fa-spin text-2xl text-[#6e0b0b]"></i>
            </div>

            <!-- Ticket Types Selection -->
            <div v-else-if="!isFreeEvent && jenisTiket.length > 0" class="mb-6">
              <label class="block text-sm font-bold text-gray-700 mb-3">Pilih Tipe Tiket</label>
              <div class="space-y-3">
                <div 
                  v-for="ticketType in jenisTiket" 
                  :key="ticketType.id_jenis_tiket"
                  
                  @click="ticketType.kuota > 0 && selectTicketType(ticketType)" 

                  class="p-4 rounded-xl border-2 transition-all"
                  :class="[
                    ticketType.kuota <= 0 
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60' 
                      : (selectedTicketType?.id_jenis_tiket === ticketType.id_jenis_tiket 
                          ? 'cursor-pointer border-[#6e0b0b] bg-[#6e0b0b]/5' 
                          : 'cursor-pointer border-gray-200 hover:border-[#6e0b0b]/30')
                  ]"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <!-- Radio circle -->
                      <div 
                        class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        :class="ticketType.kuota <= 0 
                          ? 'border-gray-400' 
                          : (selectedTicketType?.id_jenis_tiket === ticketType.id_jenis_tiket 
                              ? 'border-[#6e0b0b]' 
                              : 'border-gray-300')"
                      >
                        <div 
                          v-if="ticketType.kuota > 0 && selectedTicketType?.id_jenis_tiket === ticketType.id_jenis_tiket"
                          class="w-3 h-3 rounded-full bg-[#6e0b0b]"
                        ></div>
                      </div>

                      <span class="font-bold text-gray-800">{{ ticketType.nama_tiket }}</span>
                    </div>

                    <!-- Harga atau Sold Out -->
                    <span class="font-black"
                      :class="ticketType.kuota <= 0 ? 'text-gray-500' : 'text-[#6e0b0b]'"
                    >
                      {{ ticketType.kuota <= 0 ? 'Sold Out' : formatPrice(ticketType.harga) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Tickets Available -->
            <div v-else-if="!isFreeEvent && jenisTiket.length === 0" class="mb-6">
              <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p class="text-sm text-yellow-800">Belum ada tiket tersedia untuk event ini</p>
              </div>
            </div>

            <!-- Price Display -->
            <div v-if="!isFreeEvent && selectedTicketType" class="bg-gradient-to-br from-[#6e0b0b]/10 to-[#8b1818]/10 rounded-xl p-6 mb-6 border-2 border-[#6e0b0b]/20">
              <p class="text-sm text-gray-600 font-medium mb-2">Harga Per Tiket</p>
              <p class="text-3xl font-black text-[#6e0b0b]">{{ displayPrice }}</p>
            </div>

            <!-- Free Event Badge -->
            <div v-else-if="isFreeEvent" class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
              <p class="text-sm text-green-600 font-medium mb-2">Event Gratis</p>
              <p class="text-3xl font-black text-green-600">FREE ENTRY</p>
            </div>

            <!-- Quantity Selector -->
            <div v-if="!isFreeEvent && selectedTicketType" class="mb-6">
              <label class="block text-sm font-bold text-gray-700 mb-3">Jumlah Tiket</label>
              <div class="flex items-center justify-center gap-4">
                <button 
                  @click="decrementQuantity"
                  :disabled="ticketQuantity <= 1"
                  class="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#6e0b0b] w-12 h-12 rounded-xl font-bold text-xl"
                >
                  -
                </button>
                <span class="text-3xl font-black text-[#6e0b0b] w-12 text-center">{{ ticketQuantity }}</span>
                <button 
                  @click="incrementQuantity"
                  :disabled="ticketQuantity >= 10"
                  class="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#6e0b0b] w-12 h-12 rounded-xl font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Total Price -->
            <div v-if="!isFreeEvent && selectedTicketType" class="bg-gradient-to-r from-[#6e0b0b] to-[#8b1818] rounded-xl p-6 mb-6">
              <p class="text-sm text-white/80 font-medium mb-1">Total Pembayaran</p>
              <p class="text-3xl font-black text-white">{{ totalPrice }}</p>
            </div>

            <!-- Buy Button -->
            <button 
              @click="buyTicket"
              :disabled="processingOrder || (!isFreeEvent && !selectedTicketType) || (isFreeEvent && !canRegister)"
              class="w-full bg-gradient-to-r from-[#6e0b0b] to-[#8b1818] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span v-if="processingOrder">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Memproses...
              </span>
              <span v-else-if="isFreeEvent && !canRegister">
                Sudah Terdaftar
              </span>
              <span v-else>
                {{ isFreeEvent ? '🎉 Daftar Gratis' : '💳 Bayar Sekarang' }}
              </span>
            </button>

            <!-- Info Text -->
            <div class="mt-4 p-3 rounded-lg"
              :class="isFreeEvent && !canRegister ? 'bg-blue-50 border border-blue-200' : 'bg-blue-50 border border-blue-200'"
            >
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5"
                  :class="isFreeEvent && !canRegister ? 'text-blue-600' : 'text-blue-600'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs"
                  :class="isFreeEvent && !canRegister ? 'text-blue-800' : 'text-blue-800'"
                >
                  <span v-if="isFreeEvent && !canRegister">
                    Anda telah terdaftar untuk event ini. Tiket dapat dilihat di halaman My Tickets.
                  </span>
                  <span v-else-if="isFreeEvent">
                    Klik tombol di atas untuk mendaftar event gratis ini. Tiket akan langsung dibuat setelah pendaftaran berhasil.
                  </span>
                  <span v-else>
                    Anda akan diarahkan ke halaman pembayaran Midtrans yang aman. Tiket akan dikirim setelah pembayaran berhasil.
                  </span>
                </p>
              </div>
            </div>

            <!-- Payment Methods Info -->
            <div v-if="!isFreeEvent" class="mt-4">
              <p class="text-xs text-gray-500 text-center mb-2">Metode Pembayaran:</p>
              <div class="flex flex-wrap gap-2 justify-center">
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">Transfer Bank</span>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">GoPay</span>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">QRIS</span>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">Kartu Kredit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>