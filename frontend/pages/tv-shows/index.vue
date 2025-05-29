<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import type { TvShow, PaginatedResponse } from '@/types/media';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const ITEMS_PER_PAGE = 5;

const currentPage = ref(1);

const apiUrl = computed(() => {
  return `${apiBase}/tv-shows?page=${currentPage.value}&limit=${ITEMS_PER_PAGE}`;
});

const { data: fetchedPaginatedData, pending, error } = await useFetch<PaginatedResponse<TvShow>>(apiUrl, {
  server: true,
});

const paginatedData = computed<PaginatedResponse<TvShow>>(() => {
  const defaultResponse: PaginatedResponse<TvShow> = {
    data: [],
    meta : {
      total: 0,
      page: 1,
      limit: ITEMS_PER_PAGE,
      totalPages: 1,
    },
  };

  if (!fetchedPaginatedData.value) {
    return defaultResponse;
  }
  return {
    ...fetchedPaginatedData.value,
  };
});

useHead({
  title: 'TV Shows - CineVault',
  meta: [
    { name: 'description', content: 'Dive into our extensive collection of TV series with detailed information and fan reviews.' }
  ]
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-6 md:mb-12">
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
        Explore TV Shows
      </h1>
      <p class="text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
        Dive into our extensive collection of TV series with detailed information and fan reviews.
      </p>
    </div>
    <div v-if="pending" class="text-center text-white text-base md:text-xl">Loading TV Shows...</div>
    <div v-else-if="error" class="text-center text-red-500 text-base md:text-xl">Error fetching TV Shows: {{ error.message }}</div>
    <div v-else-if="!paginatedData.data || paginatedData.data.length === 0" class="text-center text-gray-400 text-base md:text-xl">
      No TV Shows found.
    </div>
    <div v-else class="space-y-6 mb-12">
      <MediaCard
        v-for="tvShow in paginatedData.data"
        :key="tvShow.id"
        :media="tvShow"
        type="tv-show"
        :showHeader="false"
      />
    </div>
    <Pagination
      v-model:page="currentPage"
      :totalPages="paginatedData.meta.totalPages"
      :pending="pending"
    />
  </div>
</template>