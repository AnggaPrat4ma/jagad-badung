<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '../config/axios' // Import axios instance yang sudah ada

const user = ref({
  nama: '',
  email: '',
  phone: '',
  photo: ''
})

const isEditing = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref(null)
const imageLoadError = ref(false)
const photoFile = ref(null)
const photoPreview = ref(null)

// Get full photo URL
const getPhotoUrl = (photoPath) => {
  if (!photoPath) return ''
  
  // Jika sudah URL lengkap (dari Google OAuth)
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath
  }
  
  // Jika path relatif dari backend (/storage/profiles/xxx.png)
  if (photoPath.startsWith('/storage/')) {
    // Gunakan base URL dari axios config
    const API_BASE_URL = 'http://192.168.1.150:8000'
    return API_BASE_URL + photoPath
  }
  
  return photoPath
}

// Fungsi untuk mendapatkan inisial dari nama
const getInitials = (name) => {
  if (!name) return '?'
  
  const words = name.trim().split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

// Handle error saat load gambar
const handleImageError = (e) => {
  console.warn('Gagal memuat foto profil:', user.value.photo)
  console.warn('Full URL yang dicoba:', e.target?.src)
  imageLoadError.value = true
}

// Handle file photo upload
const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  
  if (!file) return
  
  // Validasi tipe file
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('❌ Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP')
    return
  }
  
  // Validasi ukuran file (max 2MB)
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    alert('❌ Ukuran file terlalu besar. Maksimal 2MB')
    return
  }
  
  photoFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
    imageLoadError.value = false
  }
  reader.readAsDataURL(file)
}

// Reset photo selection
const removePhoto = () => {
  photoFile.value = null
  photoPreview.value = null
  // Reset file input
  const fileInput = document.getElementById('photoInput')
  if (fileInput) fileInput.value = ''
}

// Trigger file input click
const triggerFileInput = () => {
  const fileInput = document.getElementById('photoInput')
  if (fileInput) {
    fileInput.click()
  }
}

// Fungsi untuk mengambil data user dari backend
const fetchUserProfile = async () => {
  isLoading.value = true
  error.value = null
  imageLoadError.value = false
  
  try {
    const response = await axiosInstance.get('/auth/me')

    if (response.data.success) {
      user.value = {
        nama: response.data.data.user.nama || '',
        email: response.data.data.user.email || '',
        phone: response.data.data.user.phone || '',
        photo: response.data.data.user.photo || ''
      }
    }
  } catch (err) {
    error.value = err.message || 'Gagal mengambil data profil'
    console.error('Error fetching profile:', err)
  } finally {
    isLoading.value = false
  }
}

const toggleEdit = () => {
  if (isEditing.value) {
    // Cancel edit - reset preview
    photoPreview.value = null
    photoFile.value = null
  }
  isEditing.value = !isEditing.value
}

const saveProfile = async () => {
  isSaving.value = true
  error.value = null

  try {
    // Prepare data
    let photoData = user.value.photo
    
    // If user uploaded new photo, convert to base64
    if (photoFile.value) {
      photoData = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(e)
        reader.readAsDataURL(photoFile.value)
      })
    }
    
    const response = await axiosInstance.put('/auth/profile', {
      nama: user.value.nama,
      phone: user.value.phone,
      photo: photoData
    })

    if (response.data.success) {
      isEditing.value = false
      imageLoadError.value = false
      photoFile.value = null
      photoPreview.value = null
      
      alert('✅ Profile berhasil disimpan!')
      
      // Update data user dengan response terbaru
      user.value = {
        nama: response.data.data.nama || user.value.nama,
        email: response.data.data.email || user.value.email,
        phone: response.data.data.phone || user.value.phone,
        photo: response.data.data.photo || user.value.photo
      }
    }
  } catch (err) {
    // Handle validation error (422)
    if (err.status === 422) {
      const validationErrors = Object.values(err.errors || {}).flat()
      error.value = validationErrors.join(', ') || err.message
      alert('❌ Validasi gagal: ' + error.value)
    } else {
      error.value = err.message || 'Gagal menyimpan profil'
      alert('❌ ' + error.value)
    }
    console.error('Error saving profile:', err)
  } finally {
    isSaving.value = false
  }
}

// Load data user saat component dimount
onMounted(() => {
  fetchUserProfile()
})
</script>

<template>
  <section
    class="min-h-screen bg-gradient-to-br from-[#6e0b0b] via-[#8b1111] to-[#6e0b0b] text-white flex flex-col items-center pt-24 pb-10 px-4"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p class="mt-4 text-white">Memuat data profil...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !user.nama" class="bg-red-500/90 backdrop-blur-md rounded-xl p-6 max-w-md">
      <p class="text-white font-semibold">⚠️ Error: {{ error }}</p>
      <button 
        @click="fetchUserProfile"
        class="mt-4 bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Container -->
    <div
      v-else
      class="bg-[#f8f5f5]/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl grid md:grid-cols-2 border border-white/10"
    >
      <!-- 🧍 Left: Foto Profil -->
      <div
        class="bg-[#ece6e6]/90 flex flex-col items-center justify-center p-10 space-y-6 border-r border-[#6e0b0b]/20"
      >
        <div class="relative">
          <div
            class="w-32 h-32 rounded-full overflow-hidden border-4 border-[#6e0b0b]/50 shadow-lg bg-gradient-to-br from-[#6e0b0b] to-[#8b1111]"
          >
            <img
              v-if="(photoPreview || user.photo) && !imageLoadError"
              :src="photoPreview || getPhotoUrl(user.photo)"
              :alt="user.nama"
              class="w-full h-full object-cover"
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
              @error="handleImageError"
            />
            <!-- Fallback: Inisial jika tidak ada foto atau error -->
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
            >
              {{ getInitials(user.nama) }}
            </div>
          </div>

          <!-- Edit Photo Button (Overlay) -->
          <button
            v-if="isEditing"
            @click="triggerFileInput"
            class="absolute bottom-0 right-0 bg-[#6e0b0b] text-white p-2.5 rounded-full shadow-lg hover:bg-[#5d0a0a] transition-all"
            title="Ubah foto"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <!-- Hidden File Input -->
          <input
            id="photoInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            class="hidden"
            @change="handlePhotoChange"
          />
        </div>

        <!-- Remove Photo Button -->
        <button
          v-if="isEditing && (photoPreview || photoFile)"
          @click="removePhoto"
          class="text-sm text-red-600 hover:text-red-700 font-semibold transition-all flex items-center gap-1"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Hapus Foto
        </button>

        <div class="text-center">
          <h2 class="text-xl font-bold text-[#6e0b0b]">{{ user.nama || 'Nama User' }}</h2>
          <p class="text-sm text-gray-600">Member sejak 2024</p>
        </div>

        <!-- Tombol Edit -->
        <div v-if="!isEditing" class="flex flex-col items-center">
          <button
            @click="toggleEdit"
            class="bg-[#6e0b0b] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5d0a0a] transition-all flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </button>
        </div>

        <!-- Tombol Simpan / Batal -->
        <div v-else class="flex flex-col w-full space-y-3">
          <button
            @click="saveProfile"
            :disabled="isSaving"
            class="w-full bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="!isSaving"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
          </button>
          <button
            @click="toggleEdit"
            :disabled="isSaving"
            class="w-full bg-gray-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
        </div>
      </div>

      <!-- 📝 Right: Informasi Akun -->
      <div class="p-10 flex flex-col justify-center">
        <h2
          class="text-2xl font-extrabold text-[#6e0b0b] mb-8 text-center tracking-wide"
        >
          Informasi Akun
        </h2>

        <div class="space-y-6">
          <!-- Nama -->
          <div>
            <label class="block text-[#6e0b0b] font-semibold mb-1">Nama</label>
            <div
              class="flex items-center bg-white rounded-xl px-4 py-3 border border-[#6e0b0b]/30 group focus-within:border-[#6e0b0b] transition-all"
            >
              <input
                v-model="user.nama"
                :disabled="!isEditing"
                type="text"
                placeholder="Nama Lengkap"
                class="flex-1 bg-transparent outline-none text-[#6e0b0b] font-medium"
              />
              <svg
                v-if="isEditing"
                class="w-4 h-4 text-[#6e0b0b] opacity-70 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>

          <!-- Email (Read Only) -->
          <div>
            <label class="block text-[#6e0b0b] font-semibold mb-1">Email</label>
            <div
              class="flex items-center bg-gray-100 rounded-xl px-4 py-3 border border-[#6e0b0b]/30"
            >
              <input
                v-model="user.email"
                disabled
                type="email"
                class="flex-1 bg-transparent outline-none text-[#6e0b0b] font-medium cursor-not-allowed"
              />
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p class="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
          </div>

          <!-- No. Hp -->
          <div>
            <label class="block text-[#6e0b0b] font-semibold mb-1">No. Hp</label>
            <div
              class="flex items-center bg-white rounded-xl px-4 py-3 border border-[#6e0b0b]/30 group focus-within:border-[#6e0b0b] transition-all"
            >
              <input
                v-model="user.phone"
                :disabled="!isEditing"
                type="text"
                placeholder="081234567890"
                class="flex-1 bg-transparent outline-none text-[#6e0b0b] font-medium"
              />
              <svg
                v-if="isEditing"
                class="w-4 h-4 text-[#6e0b0b] opacity-70 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Info tambahan -->
        <div
          class="mt-8 p-4 bg-[#6e0b0b]/10 border border-[#6e0b0b]/30 rounded-xl text-[#6e0b0b]"
        >
          <p class="text-sm">
            💡 <span class="font-semibold">Tips:</span> Pastikan informasi Anda
            selalu up-to-date agar proses pemesanan tiket berjalan lancar.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
input:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>