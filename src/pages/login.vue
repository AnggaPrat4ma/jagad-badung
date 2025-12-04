<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const API_BASE_URL = "http://172.18.196.161:8000/api";

const loading = ref(false);
const errorMessage = ref("");
const useRedirect = ref(false);

// ✅ Check if already logged in or handle redirect result
onMounted(async () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const jwtToken = localStorage.getItem('jwtToken');
  
  // Check JWT token first
  if (isAuthenticated && jwtToken) {
    console.log('✅ Already logged in with JWT, verifying...');
    
    try {
      // Verify JWT token with backend
      const response = await axios.post(`${API_BASE_URL}/auth/verify-token`, {}, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('✅ JWT token valid, redirecting...');
        const redirect = route.query.redirect || '/dashboard';
        router.push(redirect);
        return;
      }
    } catch (error) {
      console.error('❌ JWT verification failed:', error.response?.data);
      // Clear invalid token
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  }

  // Handle redirect result (if using redirect method)
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('✅ Got redirect result');
      await handleAuthSuccess(result);
    }
  } catch (error) {
    console.error('Redirect result error:', error);
    if (error.code !== 'auth/popup-closed-by-user') {
      errorMessage.value = getErrorMessage(error);
    }
  }

  // Show reason for redirect if any
  if (route.query.reason === 'session_expired') {
    errorMessage.value = 'Sesi Anda telah berakhir. Silakan login kembali.';
  }
});

// ✅ Handle successful authentication
const handleAuthSuccess = async (result) => {
  try {
    loading.value = true;
    
    const idToken = await result.user.getIdToken();
    console.log('✅ Firebase authentication successful');
    console.log('🔑 Firebase Token obtained:', idToken.substring(0, 30) + '...');

    // 🔥 Send Firebase token to backend to get JWT
    console.log('🔹 Sending Firebase token to backend...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/firebase`, {
      firebase_token: idToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Backend response:', response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Login gagal');
    }

    // Extract data from response
    const data = response.data.data;
    const user = data.user;
    const jwtToken = data.token; // 🔑 JWT Token from backend
    const tokenType = data.token_type; // Bearer
    const expiresIn = data.expires_in; // in seconds
    const expiresAt = data.expires_at; // ISO timestamp

    // 💾 Save JWT token and user data to localStorage
    localStorage.setItem("jwtToken", jwtToken); // 🔑 Save JWT token
    localStorage.setItem("tokenType", tokenType);
    localStorage.setItem("tokenExpiresAt", expiresAt);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("firebaseToken", idToken); // Keep Firebase token for reference
    localStorage.setItem("isAuthenticated", "true");

    console.log('💾 Authentication data saved to localStorage');
    console.log('🔑 JWT Token saved');
    console.log('👤 User:', user.nama);
    console.log('🎭 Roles:', user.roles);
    console.log('🔐 Permissions:', user.permissions);
    console.log('⏰ Token expires at:', expiresAt);

    // Clear any error messages
    errorMessage.value = "";
    
    // Small delay to ensure storage is saved
    setTimeout(() => {
      const redirect = route.query.redirect || '/dashboard';
      console.log('🔄 Redirecting to:', redirect);
      router.push(redirect);
    }, 100);

  } catch (error) {
    console.error("❌ Backend authentication error:", error);
    
    if (error.response) {
      console.error("Backend error details:", error.response.data);
      errorMessage.value = error.response.data.message || "Login gagal. Silakan coba lagi.";
      
      // Handle specific error cases
      if (error.response.status === 403) {
        errorMessage.value = "Akun Anda tidak aktif. Hubungi administrator.";
      } else if (error.response.status === 401) {
        errorMessage.value = "Token Firebase tidak valid. Silakan coba lagi.";
      }
    } else if (error.request) {
      errorMessage.value = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    } else {
      errorMessage.value = error.message || "Terjadi kesalahan saat login.";
    }
  } finally {
    loading.value = false;
  }
};

// ✅ Get user-friendly error message
const getErrorMessage = (error) => {
  const errorMessages = {
    'auth/popup-closed-by-user': 'Login dibatalkan. Silakan coba lagi.',
    'auth/popup-blocked': 'Popup diblokir oleh browser. Silakan izinkan popup atau gunakan mode redirect.',
    'auth/cancelled-popup-request': 'Permintaan login dibatalkan.',
    'auth/network-request-failed': 'Koneksi internet bermasalah. Periksa koneksi Anda.',
    'auth/too-many-requests': 'Terlalu banyak percobaan login. Silakan tunggu beberapa saat.',
    'auth/user-disabled': 'Akun ini telah dinonaktifkan.',
    'auth/account-exists-with-different-credential': 'Email ini sudah terdaftar dengan metode login lain.'
  };

  return errorMessages[error.code] || error.message || 'Terjadi kesalahan saat login.';
};

// ✅ Login with Google (Popup Method - Default)
const loginWithGoogle = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    console.log('🔹 Starting Google login with popup...');

    // Login via Firebase Popup
    const result = await signInWithPopup(auth, provider);
    
    // Handle success
    await handleAuthSuccess(result);
    
  } catch (error) {
    console.error("❌ Login error:", error);

    // Don't show error if user just closed the popup
    if (error.code === "auth/popup-closed-by-user") {
      console.log('ℹ️ User closed the popup');
    } else if (error.code === "auth/popup-blocked") {
      errorMessage.value = "Popup diblokir! Menggunakan redirect method...";
      // Fallback to redirect method if popup is blocked
      setTimeout(() => loginWithRedirect(), 1000);
    } else {
      errorMessage.value = getErrorMessage(error);
    }
  } finally {
    loading.value = false;
  }
};

// ✅ Login with Google (Redirect Method - Fallback)
const loginWithRedirect = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";
    
    console.log('🔹 Starting Google login with redirect...');
    
    // This will redirect the page
    await signInWithRedirect(auth, provider);
    
  } catch (error) {
    console.error("❌ Redirect login error:", error);
    errorMessage.value = getErrorMessage(error);
    loading.value = false;
  }
};

// ✅ Retry login
const retryLogin = () => {
  errorMessage.value = "";
  loginWithGoogle();
};
</script>

<template>
  <section class="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden">
    <!-- Background -->
    <img src="/hero-bg.jpg" alt="" class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-[#6e0b0b]/85"></div>

    <!-- Card -->
    <div class="relative z-10 w-[92%] max-w-5xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
      <!-- Left -->
      <div class="bg-[#7b1212] text-white p-7 md:p-9">
        <div class="flex items-center gap-3 mb-6">
          <img src="/logo-jagad.png" alt="Jagad Badung" class="h-8 w-8" />
          <span class="text-xl font-extrabold tracking-wide">
            JAGAD<span class="opacity-90">BADUNG</span>
          </span>
        </div>

        <h2 class="text-2xl font-extrabold mb-2">Mulai Bergabung Bersama Kami</h2>
        <p class="text-white/80 text-sm mb-7">
          Ikuti langkah ini untuk menggunakan Jagad Badung
        </p>

        <ol class="space-y-4">
          <li class="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3">
            <span class="h-8 w-8 grid place-content-center rounded-full bg-white/25 font-semibold">1</span>
            <span>Login ke akun anda</span>
          </li>
          <li class="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3">
            <span class="h-8 w-8 grid place-content-center rounded-full bg-white/25 font-semibold">2</span>
            <span>Cari dan pilih acara</span>
          </li>
          <li class="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3">
            <span class="h-8 w-8 grid place-content-center rounded-full bg-white/25 font-semibold">3</span>
            <span>Pesan dan bayar tiket anda</span>
          </li>
        </ol>
      </div>

      <!-- Right -->
      <div class="bg-[#efefef]/95 p-7 md:p-9 relative">
        <div class="hidden md:block absolute left-0 top-0 h-full w-px bg-black/10"></div>

        <div class="h-full flex flex-col items-center justify-center">
          <h3 class="text-xl font-bold text-[#6e0b0b] mb-6 text-center">
            Masuk ke Akun Anda
          </h3>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="mb-4 w-full max-w-[320px] p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-start gap-2"
          >
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div class="flex-1">
              <p>{{ errorMessage }}</p>
              <button 
                v-if="errorMessage.includes('dibatalkan') || errorMessage.includes('closed')"
                @click="retryLogin"
                class="mt-2 text-xs underline hover:no-underline"
              >
                Coba lagi
              </button>
            </div>
          </div>

          <!-- Login Button (Popup) -->
          <button
            @click="loginWithGoogle"
            :disabled="loading"
            class="flex items-center justify-center gap-3 rounded-full border border-[#b43a3a]
                   px-6 py-3 text-[#b43a3a] font-medium hover:bg-[#b43a3a] hover:text-white transition
                   w-[320px] disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            aria-label="Login dengan Google"
          >
            <!-- Loading Spinner -->
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>

            <!-- Google Icon -->
            <img
              v-else
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              class="h-5 w-5"
            />

            <!-- Button Text -->
            <span v-if="loading">Memproses...</span>
            <span v-else>Login dengan Google</span>
          </button>

          <!-- Alternative: Redirect Method -->
          <button
            v-if="!loading"
            @click="loginWithRedirect"
            class="text-xs text-gray-600 hover:text-gray-800 underline"
          >
            Popup tidak bekerja? Gunakan redirect
          </button>

          <!-- Info Text -->
          <p class="text-xs text-gray-500 mt-4 text-center max-w-[320px]">
            Dengan login, Anda menyetujui syarat dan ketentuan kami
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>