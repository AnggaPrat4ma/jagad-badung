<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router"
import EventCard from "../components/EventCard.vue";
import axiosInstance from "../config/axios.js";

const router = useRouter()

const goToDetail = (event) => {
  console.log('🔍 Navigating to event:', event)
  
  // Gunakan slug jika ada, fallback ke id_event untuk backward compatibility
  const identifier = event.slug || event.id_event
  
  console.log('📍 Using identifier:', identifier)
  
  // Navigate menggunakan slug parameter
  router.push({ 
    name: 'EventDetail', 
    params: { slug: identifier } 
  })
}

// Animasi konten
const isLoaded = ref(false);
onMounted(() => {
  setTimeout(() => (isLoaded.value = true), 100);
});

// Scroll kontrol untuk event slider
const scroller = ref(null);
const scrollByX = (x) =>
  scroller.value?.scrollBy({ left: x, behavior: "smooth" });
const scrollLeft = () => scrollByX(-400);
const scrollRight = () => scrollByX(400);

// ---------------------------------
// 🔥 FETCH EVENT DARI BACKEND
// ---------------------------------
const events = ref([]);
const loading = ref(true);

const fetchEvents = async () => {
  try {
    const res = await axiosInstance.get("/events/public");
    if (res.data.success) {
      events.value = res.data.data;
    }
  } catch (err) {
    console.error("❌ Error fetch events:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEvents);

// ---------------------------------
// 🔥 HELPER FUNGI SAMA DENGAN PAGE SATU
// ---------------------------------
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const getBannerUrl = (banner) => {
  if (!banner) return "/no-image.jpg";
  return `${axiosInstance.defaults.baseURL.replace(
    "/api",
    ""
  )}/storage/${banner}`;
};

const getKategori = (event) => {
  const nama = event.nama_event.toLowerCase();
  if (nama.includes("kecak") || nama.includes("budaya")) return "Budaya";
  if (nama.includes("konser") || nama.includes("musik")) return "Konser";
  return "Umum";
};

const getPriceDisplay = (event) => {
  if (!event.berbayar) return { type: "free" };

  const jenisTiket = event.jenis_tiket || [];

  if (!Array.isArray(jenisTiket) || jenisTiket.length === 0) {
    return { type: "none" };
  }

  const prices = jenisTiket
    .map((t) => parseFloat(t.harga || 0))
    .filter((h) => h > 0);

  if (prices.length === 0) return { type: "none" };

  if (prices.length === 1) {
    return { type: "single", value: formatPrice(prices[0]) };
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return {
    type: "range",
    min: formatPrice(min),
    max: formatPrice(max),
  };
};
</script>

<template>
  <section
    class="min-h-screen bg-gradient-to-br from-[#6e0b0b] via-[#8b1111] to-[#6e0b0b] text-white relative overflow-hidden"
  >
    <!-- Background -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse"
      ></div>
    </div>

    <!-- Konten -->
    <div class="max-w-[90rem] mx-auto px-6 py-8 space-y-12 relative z-10 pt-24">
      <!-- Banner -->
      <div
        :class="[
          'bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 transform',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        ]"
      >
        <!-- Dekorasi -->
        <div
          class="absolute -top-20 -right-20 w-64 h-64 bg-[#6e0b0b]/5 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-20 -left-20 w-64 h-64 bg-[#6e0b0b]/5 rounded-full blur-3xl"
        ></div>

        <!-- Teks -->
        <div class="md:w-1/2 space-y-4 relative z-10">
          <div
            class="inline-block px-3 py-1.5 bg-[#6e0b0b]/10 rounded-full text-[#6e0b0b] text-xs font-semibold"
          >
            🎉 Platform Tiket Terpercaya
          </div>

          <h2
            class="text-2xl md:text-4xl font-extrabold text-[#6e0b0b] leading-tight"
          >
            Selamat Datang di
            <br />
            <span
              class="bg-gradient-to-r from-[#6e0b0b] to-[#a01515] bg-clip-text text-transparent"
            >
              JAGADBADUNG!
            </span>
          </h2>

          <p class="text-gray-700 text-base md:text-lg max-w-lg">
            Pilih event terbaikmu dan pesan tiketnya sekarang juga!
          </p>

          <div class="flex gap-4 pt-2">
            <div v-for="(stat, i) in stats" :key="i" class="text-center">
              <div class="text-xl">{{ stat.icon }}</div>
              <div class="text-lg font-bold text-[#6e0b0b]">
                {{ stat.number }}
              </div>
              <div class="text-xs text-gray-600">{{ stat.label }}</div>
            </div>
          </div>

          <router-link
            to="/events"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-[#6e0b0b] to-[#8b1111] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            🎟️ Beli Sekarang →
          </router-link>
        </div>

        <!-- Gambar -->
        <div class="md:w-1/2 flex justify-center md:justify-end relative">
          <div
            class="absolute inset-0 bg-gradient-to-tr from-[#6e0b0b]/20 rounded-3xl blur-2xl"
          ></div>
          <img
            src="/pejabat.png"
            class="h-44 md:h-56 lg:h-64 object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition"
          />
        </div>
      </div>

      <!-- Judul Section -->
      <div
        :class="[
          'transition-all duration-700 transform delay-200',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        ]"
      >
        <div class="flex items-center gap-4 mb-2">
          <div
            class="h-1 w-12 bg-gradient-to-r from-white to-transparent rounded-full"
          ></div>
          <h3 class="text-3xl md:text-4xl font-extrabold">Sedang Berjalan</h3>
        </div>

        <p class="text-white/80 ml-16 text-base md:text-lg">
          Temukan event yang paling banyak dicari
        </p>
      </div>

      <!-- Event Slider -->
      <div
        :class="[
          'relative transition-all duration-700 transform delay-300',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        ]"
      >
        <div
          ref="scroller"
          class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/40"
        >
          <div
            v-for="(e, i) in events"
            :key="i"
            :style="{ animationDelay: `${i * 100}ms` }"
            class="min-w-[340px] sm:min-w-[380px] md:min-w-[400px] snap-start animate-fade-in-up"
          >
            <EventCard
              :id="e.id_event"
              :cover="getBannerUrl(e.banner)"
              :title="e.nama_event"
              :location="e.lokasi"
              :date="formatDate(e.start_time)"
              :kategori="getKategori(e)"
              :price="getPriceDisplay(e)"
              @click="goToDetail(e)"
            />
          </div>
        </div>

        <!-- Tombol Scroll -->
        <button
          @click="scrollLeft"
          class="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white"
        >
          ‹
        </button>

        <button
          @click="scrollRight"
          class="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white"
        >
          ›
        </button>
      </div>

      <!-- Footer -->
      <div
        :class="[
          'text-center py-8 transition-all duration-700 transform delay-500',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        ]"
      >
        <p class="text-white/60 text-sm">© 2025 JAGADBADUNG</p>
      </div>
    </div>
  </section>
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
</style>
