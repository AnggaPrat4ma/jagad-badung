<!-- Modal Add/Edit Event -->
<template v-if="showModal && (modalType === 'add' || modalType === 'edit')">
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-bold text-gray-900">
          {{ modalType === 'add' ? 'Buat Event Baru' : 'Edit Event' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nama Event <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.nama_event"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Contoh: Bali Music Festival 2024"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              v-model="formData.deskripsi"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="3"
              placeholder="Deskripsi singkat tentang event"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Lokasi <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.lokasi"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Contoh: GWK Cultural Park, Bali"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Waktu Mulai <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.start_time"
                type="datetime-local"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Waktu Selesai <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.end_time"
                type="datetime-local"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Banner Event</label>
            <input
              @change="$emit('banner-change', $event)"
              type="file"
              accept="image/*"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG. Max 2MB</p>
          </div>

          <div>
            <label class="flex items-center gap-2">
              <input
                v-model="formData.berbayar"
                type="checkbox"
                class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span class="text-sm font-medium text-gray-700">Event Berbayar</span>
            </label>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="$emit('close')"
            :disabled="submitting"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            @click="$emit('submit')"
            :disabled="submitting"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="submitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Menyimpan...' : (modalType === 'add' ? 'Buat Event' : 'Simpan Perubahan') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Modal View Event -->
<template v-if="showModal && modalType === 'view' && selectedEvent">
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="relative">
        <!-- Banner -->
        <div class="h-64 bg-gradient-to-br from-purple-400 to-blue-500">
          <img 
            v-if="selectedEvent.banner" 
            :src="`${baseURL}/storage/${selectedEvent.banner}`" 
            :alt="selectedEvent.nama_event" 
            class="w-full h-full object-cover" 
          />
        </div>
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getEventStatus(selectedEvent).color]">
              {{ getEventStatus(selectedEvent).text }}
            </span>
            <span :class="['px-3 py-1 rounded-full text-sm font-semibold', 
              selectedEvent.berbayar ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
              {{ selectedEvent.berbayar ? 'Berbayar' : 'Gratis' }}
            </span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ selectedEvent.nama_event }}</h2>
          <p class="text-gray-600">{{ selectedEvent.deskripsi }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-start gap-3">
              <svg class="text-purple-600 mt-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p class="text-sm text-gray-600 mb-1">Lokasi</p>
                <p class="font-medium text-gray-900">{{ selectedEvent.lokasi }}</p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-start gap-3">
              <svg class="text-purple-600 mt-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm text-gray-600 mb-1">Waktu</p>
                <p class="font-medium text-gray-900 text-sm">{{ formatDate(selectedEvent.start_time) }}</p>
                <p class="text-xs text-gray-500">s/d {{ formatDate(selectedEvent.end_time) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-purple-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Role Anda</p>
          <p class="font-semibold text-purple-600">{{ selectedEvent.my_role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Modal Manage Panitia -->
<template v-if="showModal && modalType === 'panitia' && selectedEvent">
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Kelola Tim Panitia</h2>
          <p class="text-sm text-gray-600">{{ selectedEvent.nama_event }}</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <!-- Owner -->
        <div v-if="panitiaList.owner" class="mb-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Event Owner</h3>
          <div class="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                {{ panitiaList.owner.nama.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ panitiaList.owner.nama }}</p>
                <p class="text-sm text-gray-600">{{ panitiaList.owner.email }}</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
              Owner
            </span>
          </div>
        </div>

        <!-- Panitia List -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            Tim Panitia ({{ panitiaList.panitia?.length || 0 }})
          </h3>
          <div class="space-y-2">
            <p v-if="panitiaList.panitia?.length === 0" class="text-center text-gray-500 py-4">
              Belum ada panitia
            </p>
            <div 
              v-else
              v-for="p in panitiaList.panitia" 
              :key="p.id_user" 
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {{ p.nama.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ p.nama }}</p>
                  <p class="text-sm text-gray-600">{{ p.email }}</p>
                </div>
              </div>
              <button
                @click="$emit('remove-panitia', p.id_user)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Add Panitia -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Tambah Panitia</h3>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div 
              v-for="user in users" 
              :key="user.id_user" 
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  {{ user.nama.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ user.nama }}</p>
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                </div>
              </div>
              <button
                @click="$emit('add-panitia', user.id_user)"
                class="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Tambah
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="$emit('close')"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventModals',
  props: {
    showModal: Boolean,
    modalType: String,
    selectedEvent: Object,
    formData: Object,
    panitiaList: Object,
    users: Array,
    submitting: Boolean,
    baseURL: String
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getEventStatus(event) {
      const now = new Date()
      const start = new Date(event.start_time)
      const end = new Date(event.end_time)
      
      if (now < start) return { text: 'Upcoming', color: 'bg-blue-100 text-blue-800' }
      if (now >= start && now <= end) return { text: 'Ongoing', color: 'bg-green-100 text-green-800' }
      return { text: 'Finished', color: 'bg-gray-100 text-gray-800' }
    }
  }
}
</script>