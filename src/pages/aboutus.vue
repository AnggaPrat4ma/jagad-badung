<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#6e0b0b] flex flex-col items-center justify-center px-6 py-20 text-white text-center">
      <!-- Judul -->
      <div class="max-w-4xl">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-wide mb-6">ABOUT US</h1>
        <div class="w-24 h-1 bg-white/70 mx-auto mb-10 rounded-full"></div>

        <!-- Isi Konten -->
        <p class="text-lg leading-relaxed text-white/90">
          <strong>Jagad Badung</strong> adalah platform digital inovatif yang dirancang khusus 
          untuk mengelola dan mempromosikan berbagai event di Kabupaten Badung. 
          Melalui website ini, penyelenggara dapat dengan mudah membuat, mengatur, 
          dan menyebarkan informasi acara, sementara masyarakat dapat menemukan 
          beragam kegiatan menarik mulai dari budaya, pariwisata, pendidikan, hingga hiburan.
        </p>

        <p class="mt-6 text-lg leading-relaxed text-white/90">
          Dengan hadirnya <strong>Jagad Badung</strong>, setiap event dapat terhubung lebih luas 
          dengan masyarakat, mendorong transparansi informasi, dan memperkuat partisipasi publik. 
          Kami berkomitmen untuk menjadi jembatan antara penyelenggara dan peserta, 
          menghadirkan pengalaman acara yang lebih mudah, cepat, dan terintegrasi.
        </p>

        <!-- Divider dekoratif -->
        <div class="mt-10 mb-8 flex justify-center">
          <div class="h-1 w-32 bg-gradient-to-r from-white/40 via-white to-white/40 rounded-full"></div>
        </div>

        <!-- Nilai inti -->
        <div class="grid sm:grid-cols-3 gap-6 mt-8 text-center">
          <div class="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md hover:bg-white/20 transition-all duration-300">
            <svg class="w-10 h-10 mx-auto mb-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 class="font-semibold text-lg mb-1">Transparan</h3>
            <p class="text-sm text-white/80">Mendukung akses terbuka dan informasi yang jujur bagi publik.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md hover:bg-white/20 transition-all duration-300">
            <svg class="w-10 h-10 mx-auto mb-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 class="font-semibold text-lg mb-1">Cepat & Efisien</h3>
            <p class="text-sm text-white/80">Pengelolaan event lebih praktis dengan sistem digital terpadu.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md hover:bg-white/20 transition-all duration-300">
            <svg class="w-10 h-10 mx-auto mb-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4h-1V9a4 4 0 00-8 0v5H7a4 4 0 00-4 4v2h5" />
            </svg>
            <h3 class="font-semibold text-lg mb-1">Kolaboratif</h3>
            <p class="text-sm text-white/80">Menghubungkan penyelenggara, peserta, dan masyarakat secara sinergis.</p>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue'
</script>

<style scoped>
section {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
