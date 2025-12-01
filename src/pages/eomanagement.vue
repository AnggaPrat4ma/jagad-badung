<template>
  <div class="min-h-screen bg-gray-50 p-6 pt-24">
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

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
      <p class="text-gray-600">Kelola event Anda dan tim panitia</p>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Events</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.totalEvents }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">As Owner</p>
            <p class="text-2xl font-bold text-purple-600">{{ statistics.asOwner }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">As Panitia</p>
            <p class="text-2xl font-bold text-green-600">{{ statistics.asPanitia }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Upcoming</p>
            <p class="text-2xl font-bold text-orange-600">{{ statistics.upcomingEvents }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Button -->
    <div class="mb-6 flex justify-end">
      <button
        @click="handleAddEvent"
        class="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Event Baru
      </button>
    </div>

    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" class="col-span-full flex justify-center items-center py-12">
        <svg class="animate-spin h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="events.length === 0" class="col-span-full text-center py-12 bg-white rounded-lg">
        <svg class="mx-auto text-gray-400 mb-4 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500">Belum ada event</p>
      </div>

      <div v-else v-for="event in events" :key="event.id_event" class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <!-- Event Banner -->
        <div class="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative">
          <img v-if="event.banner" :src="`${baseURL}/storage/${event.banner}?t=${Date.now()}`" :alt="event.nama_event" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="text-white opacity-50 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="absolute top-4 right-4">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getEventStatus(event).color]">
              {{ getEventStatus(event).text }}
            </span>
          </div>
          <div class="absolute top-4 left-4">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold', 
              event.my_role === 'Owner' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700']">
              {{ event.my_role }}
            </span>
          </div>
        </div>

        <!-- Event Info -->
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{{ event.nama_event }}</h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ event.deskripsi }}</p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="line-clamp-1">{{ event.lokasi }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ formatDate(event.start_time) }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ event.berbayar ? 'Berbayar' : 'Gratis' }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t">
            <button
              @click="handleViewEvent(event)"
              class="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Detail
            </button>
            
            <template v-if="event.can_manage">
              <button
                @click="handleManageTiket(event)"
                class="flex-1 px-3 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Tiket
              </button>
              <button
                @click="handleManagePanitia(event)"
                class="flex-1 px-3 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Panitia
              </button>
              <button
                @click="handleEditEvent(event)"
                class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="handleDeleteEvent(event)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Add/Edit Event -->
    <div v-if="showModal && (modalType === 'add' || modalType === 'edit')" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalType === 'add' ? 'Buat Event Baru' : 'Edit Event' }}
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
                @change="handleBannerChange"
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
              {{ submitting ? 'Menyimpan...' : (modalType === 'add' ? 'Buat Event' : 'Simpan Perubahan') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal View Event -->
    <div v-if="showModal && modalType === 'view' && selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="relative">
          <div class="h-64 bg-gradient-to-br from-purple-400 to-blue-500">
            <img 
              v-if="selectedEvent.banner" 
              :src="`${baseURL}/storage/${selectedEvent.banner}`" 
              :alt="selectedEvent.nama_event" 
              class="w-full h-full object-cover" 
            />
          </div>
          <button
            @click="showModal = false"
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

    <!-- Modal Manage Panitia -->
    <div v-if="showModal && modalType === 'panitia' && selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Kelola Tim Panitia</h2>
            <p class="text-sm text-gray-600">{{ selectedEvent.nama_event }}</p>
          </div>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
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
                  @click="handleRemovePanitia(p.id_user)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Tambah Panitia</h3>
            <div v-if="availableUsers.length === 0" class="text-center text-gray-500 py-4">
              Semua user sudah ditambahkan atau tidak ada user lain
            </div>
            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div 
                v-for="user in availableUsers" 
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
                  @click="handleAddPanitia(user.id_user)"
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
              @click="showModal = false"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Manage Jenis Tiket -->
    <div v-if="showModal && modalType === 'tiket' && selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Kelola Jenis Tiket</h2>
            <p class="text-sm text-gray-600">{{ selectedEvent.nama_event }}</p>
          </div>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <!-- Statistics Cards -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 rounded-lg p-4">
              <p class="text-sm text-blue-600 mb-1">Total Jenis Tiket</p>
              <p class="text-2xl font-bold text-blue-900">{{ jenisTiketList.length }}</p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <p class="text-sm text-purple-600 mb-1">Total Kuota</p>
              <p class="text-2xl font-bold text-purple-900">{{ jenisTiketList.reduce((sum, t) => sum + t.kuota, 0) }}</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <p class="text-sm text-green-600 mb-1">Tiket Gratis</p>
              <p class="text-2xl font-bold text-green-900">{{ jenisTiketList.filter(t => t.harga == 0).length }}</p>
            </div>
          </div>

          <!-- Add Button -->
          <button
            @click="handleAddJenisTiket"
            class="w-full mb-4 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Jenis Tiket
          </button>

          <!-- Jenis Tiket List -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              Daftar Jenis Tiket ({{ jenisTiketList.length }})
            </h3>
            
            <div v-if="loadingJenisTiket" class="text-center py-8">
              <svg class="animate-spin h-8 w-8 text-purple-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            <div v-else-if="jenisTiketList.length === 0" class="text-center py-8 text-gray-500">
              <svg class="mx-auto w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p>Belum ada jenis tiket</p>
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="tiket in jenisTiketList" 
                :key="tiket.id_jenis_tiket"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center gap-4 flex-1">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {{ tiket.nama_tiket.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <p class="font-semibold text-gray-900">{{ tiket.nama_tiket }}</p>
                      <span :class="['px-2 py-1 text-xs font-semibold rounded-full', getTiketStatus(tiket).color]">
                        {{ getTiketStatus(tiket).text }}
                      </span>
                    </div>
                    <div class="flex items-center gap-4 mt-1">
                      <p class="text-sm font-semibold" :class="tiket.harga > 0 ? 'text-green-600' : 'text-gray-600'">
                        {{ formatPriceDisplay(tiket.harga) }}
                      </p>
                      <p class="text-sm text-gray-600">
                        Kuota: <span class="font-semibold">{{ tiket.kuota }}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="handleEditJenisTiket(tiket)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="handleDeleteJenisTiket(tiket)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="showModal = false"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Add/Edit Jenis Tiket (Sub-modal) -->
    <div v-if="showTiketFormModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-bold text-gray-900">
            {{ tiketModalType === 'add' ? 'Tambah Jenis Tiket' : 'Edit Jenis Tiket' }}
          </h2>
          <button @click="showTiketFormModal = false" class="text-gray-400 hover:text-gray-600">
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
                v-model="tiketFormData.nama_tiket"
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
                v-model.number="tiketFormData.harga"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0 untuk tiket gratis"
                required
              />
              <p class="text-xs text-gray-500 mt-1">
                Preview: {{ formatPriceDisplay(tiketFormData.harga || 0) }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kuota <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="tiketFormData.kuota"
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
              @click="showTiketFormModal = false"
              :disabled="submittingTiket"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              @click="handleSubmitJenisTiket"
              :disabled="submittingTiket"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <svg v-if="submittingTiket" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submittingTiket ? 'Menyimpan...' : (tiketModalType === 'add' ? 'Tambah Tiket' : 'Simpan Perubahan') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventService, userService, jenisTiketService } from '../services'

export default {
  name: 'EOEventManagement',
  data() {
    return {
      events: [],
      users: [],
      availableUsers: [], // Users yang bisa ditambahkan sebagai panitia
      loading: false,
      submitting: false,
      showModal: false,
      modalType: '',
      selectedEvent: null,
      panitiaList: { owner: null, panitia: [] },
      alert: { show: false, type: '', message: '' },
      baseURL: 'http://172.18.216.143:8000',
      formData: {
        nama_event: '',
        deskripsi: '',
        lokasi: '',
        start_time: '',
        end_time: '',
        berbayar: false,
        banner: null
      },

      bannerPreview: null,

      statistics: {
        totalEvents: 0,
        asOwner: 0,
        asPanitia: 0,
        upcomingEvents: 0
      },
      // Jenis Tiket Management
      jenisTiketList: [],
      loadingJenisTiket: false,
      showTiketFormModal: false,
      tiketModalType: '',
      selectedTiket: null,
      submittingTiket: false,
      tiketFormData: {
        id_event: null,
        nama_tiket: '',
        harga: 0,
        kuota: 0
      }
    }
  },
  mounted() {
    this.loadMyEvents()
    this.loadAllUsers()
  },
  methods: {
    async loadMyEvents() {
      this.loading = true
      try {
        const response = await eventService.getMyManagedEvents()
        
        if (response.success) {
          // ✅ Add timestamp to force image refresh
          const timestamp = Date.now()
          this.events = (response.data.events || []).map(event => ({
            ...event,
            // Add cache-busting timestamp
            banner_cache: timestamp
          }))
          
          this.statistics = {
            totalEvents: response.data.total || 0,
            asOwner: response.data.as_owner || 0,
            asPanitia: response.data.as_panitia || 0,
            upcomingEvents: this.events.filter(e => new Date(e.start_time) > new Date()).length
          }
        }
      } catch (error) {
        console.error('Error loading events:', error)
        this.showAlert('error', error.message || 'Gagal memuat data event')
      } finally {
        this.loading = false
      }
    },

    async loadAllUsers() {
      try {
        const response = await userService.getUsers()
        if (response.success) {
          this.users = response.data.data || response.data || []
        }
      } catch (error) {
        console.error('Error loading users:', error)
      }
    },

    async loadPanitiaList(eventId) {
      try {
        const response = await eventService.getEventPanitia(eventId)
        if (response.success) {
          this.panitiaList = {
            owner: response.data.owner,
            panitia: response.data.panitia || []
          }
          
          // Filter users yang belum jadi panitia
          this.filterAvailableUsers()
        }
      } catch (error) {
        console.error('Error loading panitia:', error)
        // Don't show error if it's first load
        if (this.panitiaList.panitia.length === 0) {
          this.panitiaList = {
            owner: null,
            panitia: []
          }
        }
      }
    },

    filterAvailableUsers() {
      // Get list of user IDs yang sudah jadi panitia atau owner
      const assignedUserIds = [
        ...(this.panitiaList.owner ? [this.panitiaList.owner.id_user] : []),
        ...this.panitiaList.panitia.map(p => p.id_user)
      ]
      
      // Filter users yang belum assigned
      this.availableUsers = this.users.filter(user => !assignedUserIds.includes(user.id_user))
    },

    showAlert(type, message) {
      this.alert = { show: true, type, message }
      setTimeout(() => {
        this.alert = { show: false, type: '', message: '' }
      }, 3000)
    },

    handleAddEvent() {
      this.modalType = 'add'
      this.selectedEvent = null
      this.formData = {
        nama_event: '',
        deskripsi: '',
        lokasi: '',
        start_time: '',
        end_time: '',
        berbayar: false,
        banner: null
      }
      this.bannerPreview = null
      this.showModal = true
      console.log('📝 Opening ADD modal')
    },

    handleEditEvent(event) {
      this.selectedEvent = event
      this.modalType = 'edit'
      this.formData = {
        nama_event: event.nama_event,
        deskripsi: event.deskripsi || '',
        lokasi: event.lokasi,
        start_time: event.start_time?.substring(0, 16),
        end_time: event.end_time?.substring(0, 16),
        berbayar: event.berbayar,
        banner: null  // ✅ Don't set old banner, only new upload
      }
      this.bannerPreview = null  // ✅ Reset preview
      this.showModal = true
      console.log('✏️ Opening EDIT modal for:', event.nama_event)
    },

    handleViewEvent(event) {
      this.selectedEvent = event
      this.modalType = 'view'
      this.showModal = true
    },

    handleManageTiket(event) {
      this.selectedEvent = event
      this.modalType = 'tiket'
      this.loadJenisTiket(event.id_event)
      this.showModal = true
    },

    async loadJenisTiket(eventId) {
      this.loadingJenisTiket = true
      try {
        const response = await jenisTiketService.getByEvent(eventId)
        if (response.success) {
          this.jenisTiketList = response.data.jenis_tiket || []
        }
      } catch (error) {
        console.error('Error loading jenis tiket:', error)
      } finally {
        this.loadingJenisTiket = false
      }
    },

    handleAddJenisTiket() {
      this.tiketModalType = 'add'
      this.tiketFormData = {
        id_event: this.selectedEvent.id_event,
        nama_tiket: '',
        harga: 0,
        kuota: 0
      }
      this.showTiketFormModal = true
    },

    handleEditJenisTiket(tiket) {
      this.selectedTiket = tiket
      this.tiketModalType = 'edit'
      this.tiketFormData = {
        id_event: this.selectedEvent.id_event,
        nama_tiket: tiket.nama_tiket,
        harga: tiket.harga,
        kuota: tiket.kuota
      }
      this.showTiketFormModal = true
    },

    async handleDeleteJenisTiket(tiket) {
      if (!confirm(`Apakah Anda yakin ingin menghapus "${tiket.nama_tiket}"?`)) {
        return
      }

      try {
        const response = await jenisTiketService.deleteJenisTiket(tiket.id_jenis_tiket)
        if (response.success) {
          this.showAlert('success', 'Jenis tiket berhasil dihapus')
          await this.loadJenisTiket(this.selectedEvent.id_event)
        }
      } catch (error) {
        console.error('Error deleting tiket:', error)
        this.showAlert('error', error.message || 'Gagal menghapus jenis tiket')
      }
    },

    async handleSubmitJenisTiket() {
      // Validation
      if (!this.tiketFormData.nama_tiket) {
        this.showAlert('error', 'Nama tiket harus diisi')
        return
      }
      if (this.tiketFormData.harga < 0) {
        this.showAlert('error', 'Harga tidak boleh negatif')
        return
      }
      if (this.tiketFormData.kuota <= 0) {
        this.showAlert('error', 'Kuota harus lebih dari 0')
        return
      }

      this.submittingTiket = true
      
      try {
        let response
        if (this.tiketModalType === 'add') {
          response = await jenisTiketService.createJenisTiket(this.tiketFormData)
          this.showAlert('success', 'Jenis tiket berhasil ditambahkan')
        } else if (this.tiketModalType === 'edit') {
          response = await jenisTiketService.updateJenisTiket(this.selectedTiket.id_jenis_tiket, this.tiketFormData)
          this.showAlert('success', 'Jenis tiket berhasil diupdate')
        }
        
        this.showTiketFormModal = false
        await this.loadJenisTiket(this.selectedEvent.id_event)
      } catch (error) {
        console.error('Error submitting tiket form:', error)
        this.showAlert('error', error.message || 'Terjadi kesalahan')
      } finally {
        this.submittingTiket = false
      }
    },

    formatPriceDisplay(price) {
      if (price === 0 || price === '0') return 'Gratis'
      return 'Rp ' + parseFloat(price).toLocaleString('id-ID')
    },

    getTiketStatus(tiket) {
      if (tiket.kuota === 0) return { text: 'Sold Out', color: 'bg-red-100 text-red-800' }
      if (tiket.kuota < 10) return { text: 'Hampir Habis', color: 'bg-yellow-100 text-yellow-800' }
      return { text: 'Tersedia', color: 'bg-green-100 text-green-800' }
    },

    handleManagePanitia(event) {
      this.selectedEvent = event
      this.modalType = 'panitia'
      this.loadPanitiaList(event.id_event)
      this.showModal = true
    },

    async handleDeleteEvent(event) {
      if (!confirm(`Apakah Anda yakin ingin menghapus event "${event.nama_event}"?`)) {
        return
      }

      try {
        const response = await eventService.deleteEvent(event.id_event)
        if (response.success) {
          this.showAlert('success', 'Event berhasil dihapus')
          this.loadMyEvents()
        }
      } catch (error) {
        console.error('Error deleting event:', error)
        this.showAlert('error', error.message || 'Gagal menghapus event')
      }
    },

    async handleSubmit() {
      // ✅ Validasi form
      if (!this.formData.nama_event || !this.formData.lokasi || 
          !this.formData.start_time || !this.formData.end_time) {
        this.showAlert('error', 'Mohon lengkapi semua field yang wajib diisi')
        return
      }
      
      // ✅ Validasi waktu
      if (new Date(this.formData.start_time) >= new Date(this.formData.end_time)) {
        this.showAlert('error', 'Waktu selesai harus setelah waktu mulai')
        return
      }
      
      this.submitting = true
      
      try {
        let response
        
        if (this.modalType === 'add') {
          console.log('🔄 Creating event with data:', {
            ...this.formData,
            banner: this.formData.banner ? 'File attached' : 'No file'
          })
          
          response = await eventService.createEvent(this.formData)
          
          if (response.success) {
            this.showAlert('success', 'Event berhasil ditambahkan! 🎉')
            this.showModal = false
            this.bannerPreview = null
            await this.loadMyEvents()
          } else {
            this.showAlert('error', response.message || 'Gagal membuat event')
          }
          
        } else if (this.modalType === 'edit') {
          console.log('🔄 Updating event with data:', {
            id: this.selectedEvent.id_event,
            ...this.formData,
            banner: this.formData.banner ? 'New file attached' : 'No new file'
          })
          
          response = await eventService.updateEvent(this.selectedEvent.id_event, this.formData)
          
          if (response.success) {
            this.showAlert('success', 'Event berhasil diupdate! ✅')
            this.showModal = false
            this.bannerPreview = null
            
            // ✅ Force reload untuk refresh gambar
            await this.loadMyEvents()
            
            console.log('✅ Event updated successfully:', response.data)
          } else {
            this.showAlert('error', response.message || 'Gagal update event')
          }
        }
        
      } catch (error) {
        console.error('❌ Error submitting form:', error)
        this.showAlert('error', error.message || 'Terjadi kesalahan saat menyimpan')
      } finally {
        this.submitting = false
      }
    },

    async handleAddPanitia(userId) {
      try {
        const response = await eventService.addPanitia(this.selectedEvent.id_event, userId)
        if (response.success) {
          this.showAlert('success', 'Panitia berhasil ditambahkan')
          await this.loadPanitiaList(this.selectedEvent.id_event)
        }
      } catch (error) {
        console.error('Error adding panitia:', error)
        this.showAlert('error', error.message || 'Gagal menambahkan panitia')
      }
    },

    async handleRemovePanitia(userId) {
      if (!confirm('Apakah Anda yakin ingin menghapus panitia ini?')) {
        return
      }

      try {
        const response = await eventService.removePanitia(this.selectedEvent.id_event, userId)
        if (response.success) {
          this.showAlert('success', 'Panitia berhasil dihapus')
          await this.loadPanitiaList(this.selectedEvent.id_event)
        }
      } catch (error) {
        console.error('Error removing panitia:', error)
        this.showAlert('error', error.message || 'Gagal menghapus panitia')
      }
    },

    handleBannerChange(event) {
      const file = event.target.files[0]
      
      if (!file) {
        this.formData.banner = null
        this.bannerPreview = null
        return
      }
      
      // ✅ Validasi ukuran file (max 2MB)
      if (file.size > 2048000) {
        this.showAlert('error', 'Ukuran file maksimal 2MB')
        event.target.value = ''
        this.formData.banner = null
        this.bannerPreview = null
        return
      }
      
      // ✅ Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        this.showAlert('error', 'Format file harus JPG atau PNG')
        event.target.value = ''
        this.formData.banner = null
    this.bannerPreview = null
    return
  }
  
  // ✅ Set file ke formData
  this.formData.banner = file
  
  // ✅ Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    this.bannerPreview = e.target.result
  }
  reader.readAsDataURL(file)
  
  console.log('✅ Banner selected:', file.name, file.size, 'bytes')
},

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
    },
  }
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>