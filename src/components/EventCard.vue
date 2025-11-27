<template>
  <div
    class="bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer w-full"
  >
    <!-- Banner -->
    <div class="relative">
      <img
        :src="cover"
        alt="Banner Event"
        class="w-full h-48 object-cover"
      />

      <!-- Label Kategori -->
      <div
        class="absolute top-2 right-2 bg-[#7A0000] text-white text-xs font-semibold px-3 py-1 rounded-full"
      >
        {{ kategori }}
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
      <h3 class="text-lg font-bold mb-1">{{ title }}</h3>

      <!-- Lokasi -->
      <div class="flex items-center text-sm text-gray-600 mb-2">
        <i class="fas fa-map-marker-alt mr-2"></i>
        {{ location }}
      </div>

      <!-- Tanggal -->
      <div class="flex items-center text-sm text-gray-600 mb-4">
        <i class="fas fa-calendar-alt mr-2"></i>
        {{ date }}
      </div>

      <!-- Harga -->
      <div class="flex justify-between items-center">
        <div class="text-[#7A0000] font-bold text-lg leading-tight">

          <!-- Satu harga -->
          <template v-if="price.type === 'single'">
            <p>{{ price.value }}</p>
          </template>

          <!-- Harga range -->
          <template v-else-if="price.type === 'range'">
            <div class="flex flex-col leading-tight w-max">

              <!-- Min -->
              <p>{{ price.min }}</p>

              <div class="flex justify-center my-1">
                <div class="border-t-2 border-gray-700 w-4"></div>
              </div>

              <!-- Max -->
              <p>{{ price.max }}</p>
            </div>
          </template>

          <!-- Gratis -->
          <template v-else-if="price.type === 'free'">
            <p>Free Entry</p>
          </template>

          <!-- Tidak ada harga -->
          <template v-else>
            <p class="text-gray-600">Harga belum tersedia</p>
          </template>

        </div>

        <button
          class="bg-[#7A0000] hover:bg-[#9A0000] text-white px-5 py-2 rounded-full font-semibold transition"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cover: String,
  title: String,
  location: String,
  date: String,
  kategori: String,
  price: Object,
});
</script>
