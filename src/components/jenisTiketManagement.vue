<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Alert -->
    <div v-if="alert.show" :class="[
      'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white',
      alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ alert.message }}</span>
    </div>

    <!-- Back Button & Header -->
    <div class="mb-8">
      <button 
        @click="$router.back()"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Event
      </button>
      
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Jenis Tiket</h1>
          <p class="text-gray-600">{{ eventData.nama_event }}</p>
          <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {{ eventData.lokasi }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(eventData.start_time) }}
            </span>
          </div>
        </div>
        <button
          @click="handleAddTiket"
          class="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Jenis Tiket
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Jenis Tiket</p>
            <p class="text-2xl font-bold text-gray-900">{{ jenisTiket.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Kuota</p>
            <p class="text-2xl font-bold text-purple-600">{{ totalKuota }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Tiket Gratis</p>
            <p class="text-2xl font-bold text-green-600">{{ tiketGratis }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Tiket Berbayar</p>
            <p class="text-2xl font-bold text-orange-600">{{ tiketBerbayar }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Jenis Tiket Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tiket</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kuota</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <div class="flex justify-center items-center">
                  <svg class="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </td>
            </tr>
            <tr v-else-if="jenisTiket.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <svg class="mx-auto text-gray-400 mb-4 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <p>Belum ada jenis tiket</p>
                <p class="text-sm mt-1">Klik "Tambah Jenis Tiket" untuk membuat tiket baru</p>
              </td>
            </tr>
            <tr v-else v-for="tiket in jenisTiket" :key="tiket.id_jenis_tiket" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {{ tiket.nama_tiket.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">{{ tiket.nama_tiket }}</div>
                    <div class="text-xs text-gray-500">ID: {{ tiket.id_jenis_tiket }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-semibold" :class="tiket.harga > 0 ? 'text-green-600' : 'text-gray-600'">
                  {{ formatPrice(tiket.harga) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  <span class="font-semibold">{{ tiket.kuota }}</span> tiket
                </div>
                <div class="text-xs text-gray-500">Tersedia</div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getStatusBadge(tiket)]">
                  {{ getStatus(tiket) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="handleEditTiket(tiket)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="handleDeleteTiket(tiket)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Add/Edit Tiket -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalType === 'add' ? 'Tambah Jenis Tiket' : 'Edit Jenis Tiket' }}
          </h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Tiket <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nama_tiket"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Contoh: VIP, Regular, Early Bird"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.harga"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0 untuk tiket gratis"
                required
              />
              <p class="text-xs text-gray-500 mt-1">
                Preview: {{ formatPrice(formData.harga || 0) }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kuota <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.kuota"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Jumlah tiket tersedia"
                required
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="showModal = false"
              :disabled="submitting"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              @click="handleSubmit"
              :disabled="submitting"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <svg v-if="submitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Menyimpan...' : (modalType === 'add' ? 'Tambah Tiket' : 'Simpan Perubahan') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jenisTiketService } from '../services'

export default {
  name: 'JenisTiketManagement',
  props: {
    eventId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      jenisTiket: [],
      eventData: {},
      loading: false,
      submitting: false,
      showModal: false,
      modalType: '',
      selectedTiket: null,
      alert: { show: false, type: '', message: '' },
      formData: {
        id_event: null,
        nama_tiket: '',
        harga: 0,
        kuota: 0
      }
    }
  },
  computed: {
    totalKuota() {
      return this.jenisTiket.reduce((sum, t) => sum + t.kuota, 0)
    },
    tiketGratis() {
      return this.jenisTiket.filter(t => t.harga === 0).length
    },
    tiketBerbayar() {
      return this.jenisTiket.filter(t => t.harga > 0).length
    }
  },
  mounted() {
    this.loadJenisTiket()
  },
  methods: {
    async loadJenisTiket() {
      this.loading = true
      try {
        const response = await jenisTiketService.getByEvent(this.eventId)
        
        if (response.success) {
          this.eventData = response.data.event
          this.jenisTiket = response.data.jenis_tiket || []
        }
      } catch (error) {
        console.error('Error loading jenis tiket:', error)
        this.showAlert('error', error.message || 'Gagal memuat data jenis tiket')
      } finally {
        this.loading = false
      }
    },

    showAlert(type, message) {
      this.alert = { show: true, type, message }
      setTimeout(() => {
        this.alert = { show: false, type: '', message: '' }
      }, 3000)
    },

    handleAddTiket() {
      this.modalType = 'add'
      this.formData = {
        id_event: this.eventId,
        nama_tiket: '',
        harga: 0,
        kuota: 0
      }
      this.showModal = true
    },

    handleEditTiket(tiket) {
      this.selectedTiket = tiket
      this.modalType = 'edit'
      this.formData = {
        id_event: this.eventId,
        nama_tiket: tiket.nama_tiket,
        harga: tiket.harga,
        kuota: tiket.kuota
      }
      this.showModal = true
    },

    async handleDeleteTiket(tiket) {
      if (!confirm(`Apakah Anda yakin ingin menghapus "${tiket.nama_tiket}"?`)) {
        return
      }

      try {
        const response = await jenisTiketService.deleteJenisTiket(tiket.id_jenis_tiket)
        if (response.success) {
          this.showAlert('success', 'Jenis tiket berhasil dihapus')
          this.loadJenisTiket()
        }
      } catch (error) {
        console.error('Error deleting tiket:', error)
        this.showAlert('error', error.message || 'Gagal menghapus jenis tiket')
      }
    },

    async handleSubmit() {
      // Validation
      if (!this.formData.nama_tiket) {
        this.showAlert('error', 'Nama tiket harus diisi')
        return
      }
      if (this.formData.harga < 0) {
        this.showAlert('error', 'Harga tidak boleh negatif')
        return
      }
      if (this.formData.kuota <= 0) {
        this.showAlert('error', 'Kuota harus lebih dari 0')
        return
      }

      this.submitting = true
      
      try {
        let response
        if (this.modalType === 'add') {
          response = await jenisTiketService.createJenisTiket(this.formData)
          this.showAlert('success', 'Jenis tiket berhasil ditambahkan')
        } else if (this.modalType === 'edit') {
          response = await jenisTiketService.updateJenisTiket(this.selectedTiket.id_jenis_tiket, this.formData)
          this.showAlert('success', 'Jenis tiket berhasil diupdate')
        }
        
        this.showModal = false
        this.loadJenisTiket()
      } catch (error) {
        console.error('Error submitting form:', error)
        this.showAlert('error', error.message || 'Terjadi kesalahan')
      } finally {
        this.submitting = false
      }
    },

    formatPrice(price) {
      if (price === 0) return 'Gratis'
      return 'Rp ' + price.toLocaleString('id-ID')
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
      })
    },

    getStatus(tiket) {
      if (tiket.kuota === 0) return 'Sold Out'
      if (tiket.kuota < 10) return 'Hampir Habis'
      return 'Tersedia'
    },

    getStatusBadge(tiket) {
      if (tiket.kuota === 0) return 'bg-red-100 text-red-800'
      if (tiket.kuota < 10) return 'bg-yellow-100 text-yellow-800'
      return 'bg-green-100 text-green-800'
    }
  }
}
</script>

<style scoped>
/* Remove spinner from number input */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>