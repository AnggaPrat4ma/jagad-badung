<template>
  <section
    id="hero"
    class="relative isolate w-full min-h-screen flex items-center overflow-hidden"
  >
    <!-- Background image -->
    <img
      src="/hero-bg.jpg"
      alt="Festival Badung"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Maroon overlay -->
    <div class="absolute inset-0 bg-[#6e0b0b]/80"></div>

    <!-- Content -->
    <div class="relative z-10 w-full px-6 md:px-16 flex flex-col md:flex-row items-center justify-center gap-10">
      <!-- Left image -->
      <div class="flex-1 flex justify-center">
        <img
          src="/pejabat.png"
          alt="Bupati & Wabup Badung"
          class="w-[300px] md:w-[450px] lg:w-[900px] drop-shadow-2xl"
        />
      </div>

      <!-- Right text -->
      <div class="flex-1 text-center md:text-left text-white">
        <p class="uppercase tracking-widest font-semibold text-white/90">Festival Badung</p>
        <h1 class="mt-2 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          SHOW TICKET PACKAGE
        </h1>
        <p class="mt-4 text-base md:text-lg text-white/85 max-w-xl mx-auto md:mx-0">
          Jangan lewatkan Festival Badung! Pesan di sini untuk membeli tiket dan rasakan keseruannya.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-start justify-center">

          <!-- ✅ Get Ticket → Redirect to /dashboard -->
          <router-link
            to="/dashboard"
            class="inline-flex justify-center items-center rounded-full px-6 py-3 bg-[#c43c3c] hover:bg-[#b23737] text-white font-semibold shadow-lg shadow-black/20 transition"
          >
            Get Ticket
          </router-link>

          <!-- Learn More -->
          <a
            href="#learn-more"
            class="inline-flex justify-center items-center rounded-full px-6 py-3 border border-white/70 text-white hover:bg-white hover:text-[#6e0b0b] transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
