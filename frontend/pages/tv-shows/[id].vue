<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Star, Tv, Calendar } from 'lucide-vue-next';
import type { TvShow, Comment } from '@/types/media';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const route = useRoute();
const tvShowId = computed<string>(() => route.params.id as string);

const { data: tvShow, pending: tvShowPending, error: tvShowError } = await useFetch<TvShow>(`${apiBase}/tv-shows/${tvShowId.value}`, {
  server: true,
});

useHead(() => ({
  title: tvShow.value ? `${tvShow.value.title} - CineVault` : 'TV Show Details - CineVault',
  meta: [
    { name: 'description', content: tvShow.value ? tvShow.value.description : 'Detailed information about a TV Show.' }
  ]
}));
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    <div v-if="tvShowPending" class="text-center text-white text-base md:text-xl">Loading TV Show details...</div>
    <div v-else-if="tvShowError" class="text-center text-red-500 text-base md:text-xl">Error loading TV Show: {{ tvShowError.message }}</div>
    <div v-else-if="!tvShow || !tvShowId" class="text-center text-white text-base md:text-xl">TV Show not found</div>
    <div v-else>
      <div class="grid lg:grid-cols-3 gap-12 mb-8 md:mb-16">
        <div class="lg:col-span-1">
          <img
            :src="tvShow.imageUrl" :alt="tvShow.title"
            class="w-full rounded-xl shadow-2xl"
          />
        </div>
        <div class="lg:col-span-2">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
            {{ tvShow.title }}
          </h1>
          <div class="flex items-center space-x-6 mb-4 md:mb-6">
            <div class="flex items-center text-yellow-400">
              <Star class="h-6 w-6 mr-2 fill-current" />
              <span class="text-base md:text-xl font-bold text-white">{{ tvShow.averageRating }}</span>
            </div>
            <div class="flex items-center text-sm md:text-base text-gray-300">
              <Calendar class="h-5 w-5 mr-2" />
              {{ tvShow.releaseYear }}
            </div>
            <div class="flex items-center text-sm md:text-base text-gray-300">
              <Tv class="h-5 w-5 mr-2" />
              {{tvShow.seasons}} seasons, {{tvShow.episodes}} episodes
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mb-4 md:mb-6">
            <span
              v-for="g in tvShow.genre"
              :key="g"
              class="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs md:text-sm"
            >
              {{ g }}
            </span>
          </div>
          <p class="text-gray-300 text-base md:text-lg leading-relaxed mb-4 md:mb-8">
            {{ tvShow.description }}
          </p>
          <div class="space-y-2 md:space-y-4">
            <div>
              <span class="text-sm md:text-base text-purple-400 font-semibold">Creator: </span>
              <span class="text-sm md:text-base text-white">{{ tvShow.creator }}</span>
            </div>
            <div>
              <span class="text-sm md:text-base text-purple-400 font-semibold">Cast: </span>
              <span class="text-sm md:text-base text-white">{{ tvShow.cast.join(", ") }}</span>
            </div>
          </div>
        </div>
      </div>
      <Comments
        :id="tvShowId"
        :totalComments="tvShow.totalComments"
        :initialComments="tvShow.comments || []"
        media-type="tv-shows"
      />
    </div>
  </div>
</template>