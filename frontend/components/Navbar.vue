<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { Film, Clapperboard, Menu, X, TvMinimalPlay } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

const route = useRoute();
watch(route, () => {
  isMobileMenuOpen.value = false;
});

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden');
});
</script>

<template>
  <nav class="bg-black/20 backdrop-blur-lg border-b border-white/10 fixed top-0 left-0 right-0 w-full z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="md:hidden flex items-center">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-menu"
          >
            <span class="sr-only">Open main menu</span>
            <Menu v-if="!isMobileMenuOpen" class="block h-6 w-6" />
            <X v-else class="block h-6 w-6" />
          </button>
        </div>

        <NuxtLink to="/" class="flex items-center">
          <Film class="w-8 h-8 mr-3 text-purple-400"/>
          <h1 class="text-xl font-bold text-white">CineVault</h1>
        </NuxtLink>

        <div class="hidden md:flex space-x-8">
          <NuxtLink to="/movies" class="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
            <Clapperboard class="w-5 h-5 mr-2" />
            Movies
          </NuxtLink>
          <NuxtLink
            to="/tv-shows"
            class="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
          >
            <TvMinimalPlay class="h-5 w-5 mr-2" />
            TV Shows
          </NuxtLink>
        </div>
        
        <div class="md:hidden w-[40px]"></div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isMobileMenuOpen" @click="toggleMobileMenu" class="fixed inset-0 bg-black/60 z-40"></div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu" class="md:hidden bg-black/95 backdrop-blur-md px-4 pt-4 pb-4 space-y-3 absolute top-16 left-0 right-0 z-50 shadow-lg border-b border-white/10"
      >
        <NuxtLink
          to="/movies"
          @click="toggleMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          <Clapperboard class="w-5 h-5 inline-block mr-2" />
          Movies
        </NuxtLink>
        <NuxtLink
          to="/tv-shows"
          @click="toggleMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          <TvMinimalPlay class="h-5 w-5 inline-block mr-2" />
          TV Shows
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<style>
/* Add this to your global CSS (e.g., assets/css/main.css or similar) if you use the class-based overflow approach */
.overflow-hidden {
  overflow: hidden !important; /* !important might be needed to override Tailwind's defaults */
}

/* The existing fade transition is fine here */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>