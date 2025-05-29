<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Star, Clock, Calendar } from 'lucide-vue-next';
import type { Movie } from '@/types/media';
import { formatDuration } from '#imports';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const route = useRoute();
const movieId = computed<string>(() => route.params.id as string);

const { data: movie, pending: moviePending, error: movieError } = await useFetch<Movie>(`${apiBase}/movies/${movieId.value}`, {
  server: true,
});

useHead(() => ({
  title: movie.value ? `${movie.value.title} - CineVault` : 'Movie Details - CineVault',
  meta: [
    { name: 'description', content: movie.value ? movie.value.description : 'Detailed information about a movie.' }
  ]
}));
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    <div v-if="moviePending" class="text-center text-white text-base md:text-xl">Loading movie details...</div>
    <div v-else-if="movieError" class="text-center text-red-500 text-base md:text-xl">Error loading movie: {{ movieError.message }}</div>
    <div v-else-if="!movie || !movieId" class="text-center text-white text-base md:text-xl">Movie not found</div>
    <div v-else>
      <div class="grid lg:grid-cols-3 gap-12 mb-8 md:mb-16">
        <div class="lg:col-span-1">
          <img
            :src="movie.imageUrl" :alt="movie.title"
            class="w-full rounded-xl shadow-2xl"
          />
        </div>
        <div class="lg:col-span-2">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
            {{ movie.title }}
          </h1>
          <div class="flex items-center space-x-6 mb-4 md:mb-6">
            <div class="flex items-center text-yellow-400">
              <Star class="h-6 w-6 mr-2 fill-current" />
              <span class="text-base md:text-xl font-bold text-white">{{ movie.averageRating }}</span> </div>
            <div class="flex items-center text-sm md:text-base text-gray-300">
              <Calendar class="h-5 w-5 mr-2" />
              {{ movie.releaseYear }} 
            </div>
            <div class="flex items-center text-sm md:text-base text-gray-300">
              <Clock class="h-5 w-5 mr-2" />
              {{ formatDuration(movie.duration) }}
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mb-4 md:mb-6">
            <span
              v-for="g in movie.genre"
              :key="g"
              class="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs md:text-sm"
            >
              {{ g }}
            </span>
          </div>
          <p class="text-gray-300 text-base md:text-lg leading-relaxed mb-4 md:mb-8">
            {{ movie.description }}
          </p>
          <div class="space-y-2 md:space-y-4">
            <div>
              <span class="text-sm md:text-base text-purple-400 font-semibold">Director: </span>
              <span class="text-sm md:text-base text-white">{{ movie.director }}</span>
            </div>
            <div>
              <span class="text-sm md:text-base text-purple-400 font-semibold">Cast: </span>
              <span class="text-sm md:text-base text-white">{{ movie.cast.join(", ") }}</span>
            </div>
          </div>
        </div>
      </div>
      <Comments
        :id="movieId"
        :totalComments="movie.totalComments"
        :initialComments="movie.comments || []"
        media-type="movies"
      />
    </div>
  </div>
</template>