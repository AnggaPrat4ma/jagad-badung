<template>
  <div class="my-tickets-page">
    <!-- Header -->
    <div class="page-header ">
      <div class="header-content">
        <h1 class="page-title">🎫 Tiket Saya</h1>
        <p class="page-subtitle" v-if="user">{{ user.nama || user.name }}</p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: filter === 'all' }"
        @click="filter = 'all'"
      >
        Semua ({{ allCount }})
      </button>
      <!-- <button 
        class="tab-btn" 
        :class="{ active: filter === 'upcoming' }"
        @click="filter = 'upcoming'"
      >
        Akan Datang ({{ upcomingCount }})
      </button> -->
      <button 
        class="tab-btn" 
        :class="{ active: filter === 'aktif' }"
        @click="filter = 'aktif'"
      >
        Aktif ({{ aktifCount }})
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: filter === 'digunakan' }"
        @click="filter = 'digunakan'"
      >
        Sudah Digunakan ({{ digunakanCount }})
      </button>
    </div>

    <!-- Loading State -->
    <div class="loading-container" v-if="loading">
      <div class="spinner"></div>
      <p>Memuat tiket...</p>
    </div>

    <!-- Error State -->
    <div class="error-container" v-else-if="error">
      <div class="error-icon">❌</div>
      <p class="error-message">{{ error }}</p>
      <button class="btn-retry" @click="fetchTickets">Coba Lagi</button>
    </div>

    <!-- Empty State -->
    <div class="empty-container" v-else-if="!tickets || tickets.length === 0">
      <div class="empty-icon">🎟</div>
      <h3>Belum Ada Tiket</h3>
      <p>Anda belum memiliki tiket. Yuk beli tiket untuk event favorit Anda!</p>
      <button class="btn-browse" @click="$router.push({ name: 'events' })">
        Jelajahi Event
      </button>
    </div>

    <!-- Tickets List -->
    <div class="tickets-container" v-else>
      <div class="tickets-grid">
        <div 
          v-for="ticket in filteredTickets" 
          :key="ticket.id_tiket"
          class="ticket-card"
          @click="showTicketDetail(ticket)"
        >
          <!-- Ticket Header -->
          <div class="ticket-header">
            <div class="event-info">
              <h3 class="event-name">{{ getEventName(ticket) }}</h3>
              <p class="event-location">📍 {{ getEventLocation(ticket) }}</p>
            </div>
            <div 
              class="ticket-status" 
              :class="getStatusClass(ticket.status)"
            >
              {{ getStatusLabel(ticket.status) }}
            </div>
          </div>

          <!-- Event Date & Time -->
          <div class="ticket-datetime">
            <div class="datetime-item">
              <span class="icon">📅</span>
              <span class="text">{{ formatDate(getEventStartTime(ticket)) }}</span>
            </div>
            <div class="datetime-item">
              <span class="icon">⏰</span>
              <span class="text">{{ formatTime(getEventStartTime(ticket)) }}</span>
            </div>
          </div>

          <!-- Ticket Type -->
          <div class="ticket-type">
            <span class="type-label">Jenis Tiket:</span>
            <span class="type-value">{{ getTicketTypeName(ticket) }}</span>
          </div>

          <!-- QR Code Preview -->
          <div class="qr-preview">
            <img 
              :src="getQrCodeUrl(ticket.qr_code)" 
              :alt="`QR Code ${ticket.qr_code}`"
              class="qr-image"
            />
          </div>

          <!-- Kehadiran Status -->
          <div class="kehadiran-status" v-if="ticket.status !== 'dibatalkan'">
            <span 
              class="kehadiran-badge" 
              :class="getKehadiranClass(ticket.kehadiran)"
            >
              {{ getKehadiranLabel(ticket.kehadiran) }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="ticket-actions">
            <button 
              class="btn-detail" 
              @click.stop="showTicketDetail(ticket)"
            >
              Lihat Detail
            </button>
            <button 
              class="btn-download" 
              @click.stop="downloadTicket(ticket)"
              v-if="ticket.status === 'aktif'"
            >
              📥 Download
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div class="modal-overlay" v-if="selectedTicket" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✕</button>
        
        <div class="modal-header">
          <h2>Detail Tiket</h2>
          <div 
            class="modal-status" 
            :class="getStatusClass(selectedTicket.status)"
          >
            {{ getStatusLabel(selectedTicket.status) }}
          </div>
        </div>

        <div class="modal-body">
          <!-- Event Info -->
          <div class="detail-section">
            <h3>📌 Informasi Event</h3>
            <div class="detail-item">
              <span class="label">Nama Event:</span>
              <span class="value">{{ getEventName(selectedTicket) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Lokasi:</span>
              <span class="value">{{ getEventLocation(selectedTicket) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Tanggal & Waktu:</span>
              <span class="value">{{ formatFullDateTime(getEventStartTime(selectedTicket)) }}</span>
            </div>
          </div>

          <!-- Ticket Info -->
          <div class="detail-section">
            <h3>🎫 Informasi Tiket</h3>
            <div class="detail-item">
              <span class="label">Jenis Tiket:</span>
              <span class="value">{{ getTicketTypeName(selectedTicket) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Kode Tiket:</span>
              <span class="value code">{{ selectedTicket.qr_code }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Status Kehadiran:</span>
              <span class="value">
                <span 
                  class="kehadiran-badge" 
                  :class="getKehadiranClass(selectedTicket.kehadiran)"
                >
                  {{ getKehadiranLabel(selectedTicket.kehadiran) }}
                </span>
              </span>
            </div>
          </div>

          <!-- QR Code -->
          <div class="detail-section qr-section">
            <h3>📱 QR Code</h3>
            <div class="qr-large">
              <img 
                :src="getQrCodeUrl(selectedTicket.qr_code)" 
                :alt="`QR Code ${selectedTicket.qr_code}`"
              />
            </div>
            <p class="qr-instruction">
              Tunjukkan QR code ini saat check-in di lokasi event
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button 
              class="btn-download-full" 
              @click="downloadTicket(selectedTicket)"
              v-if="selectedTicket.status === 'aktif'"
            >
              📥 Download Tiket
            </button>
            <button class="btn-close-modal" @click="closeModal">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../config/axios.js'

const router = useRouter()

// State
const user = ref(null)
const tickets = ref([])
const loading = ref(true)
const error = ref(null)
const filter = ref('all')
const selectedTicket = ref(null)

// Computed - Counts
const allCount = computed(() => tickets.value.length)

const upcomingCount = computed(() => {
  return tickets.value.filter(ticket => {
    const eventTime = getEventStartTime(ticket)
    return eventTime && new Date(eventTime) > new Date()
  }).length
})

const aktifCount = computed(() => {
  return tickets.value.filter(ticket => ticket.status === 'aktif').length
})

const digunakanCount = computed(() => {
  return tickets.value.filter(ticket => ticket.status === 'digunakan').length
})

// Computed - Filtered Tickets
const filteredTickets = computed(() => {
  if (!tickets.value) return []

  switch (filter.value) {
    case 'upcoming':
      return tickets.value.filter(ticket => {
        const eventTime = getEventStartTime(ticket)
        return eventTime && new Date(eventTime) > new Date()
      })
    case 'aktif':
      return tickets.value.filter(ticket => ticket.status === 'aktif')
    case 'digunakan':
      return tickets.value.filter(ticket => ticket.status === 'digunakan')
    default:
      return tickets.value
  }
})

// Load user from localStorage
const loadUser = () => {
  try {
    const userString = localStorage.getItem('user')
    if (userString) {
      user.value = JSON.parse(userString)
      console.log('👤 User loaded:', user.value)
    } else {
      console.warn('⚠ User not found in localStorage')
      router.push({ name: 'login' })
    }
  } catch (e) {
    console.error('❌ Error loading user:', e)
    router.push({ name: 'login' })
  }
}

// Fetch tickets from API
const fetchTickets = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('📡 Fetching tickets...')
    
    const response = await axiosInstance.get('/tiket/my-tickets', {
      params: {
        per_page: 100
      }
    })

    console.log('✅ Tickets response:', response.data)

    if (response.data.success) {
      // Handle pagination
      if (response.data.data.data) {
        tickets.value = response.data.data.data
      } else {
        tickets.value = response.data.data
      }
    } else {
      error.value = response.data.message || 'Gagal memuat tiket'
    }

    console.log('🎫 Total tickets:', tickets.value.length)

  } catch (err) {
    console.error('❌ Error fetching tickets:', err)
    error.value = err.response?.data?.message || 'Gagal memuat tiket. Silakan coba lagi.'
    
    if (err.response?.status === 401) {
      router.push({ name: 'login' })
    }
  } finally {
    loading.value = false
  }
}

// Modal functions
const showTicketDetail = (ticket) => {
  selectedTicket.value = ticket
  console.log('🔍 Selected ticket:', ticket)
}

const closeModal = () => {
  selectedTicket.value = null
}

// Download ticket
const downloadTicket = (ticket) => {
  const qrUrl = getQrCodeUrl(ticket.qr_code)
  const link = document.createElement('a')
  link.href = qrUrl
  link.download = `Ticket-${ticket.qr_code}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  alert('✅ Tiket berhasil didownload!')
}

// Helper functions
const getQrCodeUrl = (qrCode) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrCode)}`
}

const getEventName = (ticket) => {
  return ticket.transaksi?.jenisTiket?.event?.nama_event || 
         ticket.transaksi?.jenis_tiket?.event?.nama_event || 
         'Event'
}

const getEventLocation = (ticket) => {
  return ticket.transaksi?.jenisTiket?.event?.lokasi || 
         ticket.transaksi?.jenis_tiket?.event?.lokasi || 
         '-'
}

const getEventStartTime = (ticket) => {
  return ticket.transaksi?.jenisTiket?.event?.start_time || 
         ticket.transaksi?.jenis_tiket?.event?.start_time || 
         null
}

const getTicketTypeName = (ticket) => {
  return ticket.transaksi?.jenisTiket?.nama_tiket || 
         ticket.transaksi?.jenis_tiket?.nama_tiket || 
         'Tiket'
}

const getStatusLabel = (status) => {
  const labels = {
    'aktif': 'Aktif',
    'digunakan': 'Sudah Digunakan',
    'dibatalkan': 'Dibatalkan'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  return `status-${status}`
}

const getKehadiranLabel = (kehadiran) => {
  const labels = {
    'belum_hadir': 'Belum Check-in',
    'hadir': 'Sudah Check-in'
  }
  return labels[kehadiran] || kehadiran
}

const getKehadiranClass = (kehadiran) => {
  return `kehadiran-${kehadiran}`
}

const formatDate = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFullDateTime = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short'
  })
}

const goBack = () => {
  router.back()
}

// Lifecycle
onMounted(() => {
  loadUser()
  fetchTickets()
})
</script>

<style scoped>
.my-tickets-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #6e0b0b);
  padding: 20px;
  padding-bottom: 40px;
  padding-top: 80px;
}

.page-header {
  margin-bottom: 30px;
}

.btn-back {
  background: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.btn-back:hover {
  transform: translateX(-5px);
}

.header-content {
  text-align: center;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 5px 0;
}

.page-subtitle {
  color: #ffffff;
  font-size: 16px;
  margin: 0;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #8d0c0c;
  border-color: #fdfdfd;
  color: white;
}

.tab-btn:hover:not(.active) {
  border-color: #2563eb;
  color: #2563eb;
}

/* Loading, Error, Empty States */
.loading-container,
.error-container,
.empty-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-message {
  color: #ef4444;
  margin-bottom: 20px;
}

.btn-retry,
.btn-browse {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-retry:hover,
.btn-browse:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

/* Tickets Grid */
.tickets-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

/* Ticket Card */
.ticket-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.ticket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.2);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
}

.event-info {
  flex: 1;
}

.event-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.event-location {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.ticket-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-aktif {
  background: #d1fae5;
  color: #065f46;
}

.status-digunakan {
  background: #e2e8f0;
  color: #475569;
}

.status-dibatalkan {
  background: #fee2e2;
  color: #991b1b;
}

.ticket-datetime {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.datetime-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.datetime-item .icon {
  font-size: 16px;
}

.ticket-type {
  background: #f8fafc;
  padding: 10px 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 14px;
}

.type-label {
  color: #64748b;
  margin-right: 8px;
}

.type-value {
  color: #1e293b;
  font-weight: 600;
}

.qr-preview {
  text-align: center;
  margin: 20px 0;
  padding: 15px;
  background: #f8fafc;
  border-radius: 12px;
}

.qr-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

.kehadiran-status {
  text-align: center;
  margin-bottom: 15px;
}

.kehadiran-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
}

.kehadiran-belum_hadir {
  background: #fef3c7;
  color: #92400e;
}

.kehadiran-hadir {
  background: #d1fae5;
  color: #065f46;
}

.ticket-actions {
  display: flex;
  gap: 10px;
}

.btn-detail,
.btn-download {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-detail {
  background: #2563eb;
  color: white;
}

.btn-detail:hover {
  background: #1d4ed8;
}

.btn-download {
  background: #10b981;
  color: white;
}

.btn-download:hover {
  background: #059669;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #64748b;
  transition: all 0.3s ease;
  z-index: 1;
}

.modal-close:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.modal-header {
  padding: 30px 30px 20px;
  border-bottom: 2px solid #f1f5f9;
}

.modal-header h2 {
  margin: 0 0 10px 0;
  color: #1e293b;
  font-size: 24px;
}

.modal-status {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.modal-body {
  padding: 30px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  color: #1e293b;
  font-size: 18px;
  margin: 0 0 15px 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  gap: 15px;
}

.detail-item .label {
  color: #64748b;
  font-weight: 500;
  flex-shrink: 0;
}

.detail-item .value {
  color: #1e293b;
  font-weight: 600;
  text-align: right;
}

.detail-item .value.code {
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
}

.qr-section {
  text-align: center;
}

.qr-large {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
}

.qr-large img {
  width: 250px;
  height: 250px;
  border-radius: 12px;
}

.qr-instruction {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-download-full,
.btn-close-modal {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-download-full {
  background: #10b981;
  color: white;
}

.btn-download-full:hover {
  background: #059669;
}

.btn-close-modal {
  background: #f1f5f9;
  color: #64748b;
}

.btn-close-modal:hover {
  background: #e2e8f0;
  color: #1e293b;
}

@media (max-width: 768px) {
  .tickets-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }

  .modal-content {
    max-height: 95vh;
  }

  .qr-large img {
    width: 200px;
    height: 200px;
  }

  .filter-tabs {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 10px;
  }

  .tab-btn {
    white-space: nowrap;
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>