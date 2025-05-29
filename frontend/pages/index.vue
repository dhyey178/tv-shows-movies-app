<template>
  <div class="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
          Discover Amazing
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Entertainment
          </span>
        </h1>
        <p class="text-sm md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Explore movies and TV shows with detailed information, ratings, and community reviews.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/movies">
            <UButton
              size="xl"
              class="text-sm md:text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Clapperboard />
              Browse Movies
            </UButton>
          </NuxtLink>

          <NuxtLink to="/tv-shows">
            <UButton
              size="xl"
              class="text-sm md:text-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              <TvMinimalPlay />             
              Explore TV Shows
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16">
    <h2 class="text-xl md:text-3xl font-bold text-white mb-6 md:mb-12 text-center">Freshly Added</h2>
    <div v-if="pendingMovie || pendingTVShow">Loading latest content...</div>
    <div v-else-if="errorMovie || errorTVShow" class="text-red-400">
      Error loading content. Please check the console.
    </div>
    <div v-else class="space-y-6">
      <div v-if="latestMovie">
        <MediaCard :media="latestMovie" type="movie" :show-header="true" />
      </div>
      <p v-else>No latest movie found.</p>
      <div v-if="latestTVShow">
        <MediaCard :media="latestTVShow" type="tv-show" :show-header="true"/>
      </div>
      <p v-else>No latest TV show found.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRuntimeConfig, useFetch } from '#app';
import type { TvShow, Movie, PaginatedResponse } from '~/types/media';
import { Clapperboard, TvMinimalPlay } from 'lucide-vue-next';

useHead({
  title: 'Home | CineVault',
  meta: [
    { name: 'description', content: 'Browse and comment on movies and TV shows with CineVault.' }
  ]
})

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const {
  data: movieResponse,
  pending: pendingMovie,
  error: errorMovie,
} = await useFetch<PaginatedResponse<Movie>>(`${apiBase}/movies`, {
  query: { page: 1, limit: 1 },
  server: true,
});
const latestMovie = movieResponse.value?.data ? movieResponse.value.data[0] : null;

const {
  data: tvShowResponse,
  pending: pendingTVShow,
  error: errorTVShow,
} = await useFetch<PaginatedResponse<TvShow>>(`${apiBase}/tv-shows`, {
  query: { page: 1, limit: 1 },
  server: true,
});
const latestTVShow = tvShowResponse.value?.data ? tvShowResponse.value.data[0] : null;

</script>
