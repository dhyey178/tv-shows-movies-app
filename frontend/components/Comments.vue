<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Star } from 'lucide-vue-next';
import type { Comment, PaginatedResponse } from '@/types/media';
import { format } from 'date-fns';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const DEFAULT_AVATAR_URL = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
const COMMENTS_PER_PAGE = 5;

const props = defineProps<{
  id: string;
  totalComments: number;
  initialComments: Comment[];
  mediaType: 'movies' | 'tv-shows';
}>();

const commentsPage = ref(1);
const allComments = ref<Comment[]>([]);
const isLoadingMoreComments = ref(false); 

watch(() => props.initialComments, (newComments) => {
  if (newComments) {
    allComments.value = newComments;
    commentsPage.value = 1;
    isLoadingMoreComments.value = false;
  }
}, { immediate: true });


const {
  error: commentsError,
  execute: fetchMoreComments,
} = await useFetch<PaginatedResponse<Comment>>(
  () => `${apiBase}/${props.mediaType}/${props.id}/comments?page=${commentsPage.value}&limit=${COMMENTS_PER_PAGE}`,
  {
    immediate: false,
    server: false,
    watch: false,
    onResponse({ response }) {
      if (response.ok && response._data) {
        const resp = response._data as PaginatedResponse<Comment>;
        allComments.value = [...allComments.value, ...resp.data];
      }
      isLoadingMoreComments.value = false;
    },
  }
);

const loadMoreComments = async () => {
  if (hasMoreComments.value && !isLoadingMoreComments.value) {
    isLoadingMoreComments.value = true;
    commentsPage.value++;
    try {
      await fetchMoreComments();
    } catch (err) {
       console.error("Failed to load more comments:", err);
    } finally {
      isLoadingMoreComments.value = false;
    }
  }
};

const hasMoreComments = computed(() => {
  return allComments.value.length < props.totalComments;
});

const formattedComments = computed(() => {
  return allComments.value.map(comment => ({
    ...comment,
    formattedDate: format(new Date(comment.createdAt), 'dd/MM/yyyy'),
  }));
});
</script>

<template>
  <div class="md:bg-white/5 md:backdrop-blur-lg md:rounded-xl md:p-8 md:border md:border-white/10">
    <h2 class="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">
      Reviews ({{ totalComments }})
    </h2>
    <div v-if="allComments.length === 0" class="text-white text-base md:text-xl" aria-live="polite">
      No reviews yet.
    </div>
    <div v-else-if="commentsError && allComments.length === 0" class="text-red-500 text-base md:text-xl" aria-live="assertive">
      Error loading reviews: {{ commentsError.message }}
    </div>
    <div v-else class="space-y-4 md:space-y-6">
      <div
        v-for="comment in formattedComments" :key="comment.id"
        class="bg-white/5 rounded-lg p-4 md:p-6 border border-white/10"
      >
        <div class="flex flex-col md:flex-row md:items-start md:space-x-4">

          <div class="flex items-center space-x-3 md:block md:space-x-0 md:flex-shrink-0">
            <img
              :src="comment.avatar || DEFAULT_AVATAR_URL" :alt="comment.author"
              class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <div class="flex-1 flex items-center justify-between md:hidden">
              <h4 class="text-white font-semibold text-base">{{ comment.author }}</h4>
              <div class="flex items-center text-yellow-400">
                <Star class="h-4 w-4 mr-1 fill-current" />
                <span class="text-white text-sm">{{ comment.rating }}</span>
              </div>
            </div>
          </div>

          <div class="flex-1 mt-3 md:mt-0">
            <div class="hidden md:flex items-center justify-between mb-2">
              <h4 class="text-white font-semibold md:text-lg">{{ comment.author }}</h4>
              <div class="flex items-center text-yellow-400">
                <Star class="h-4 w-4 mr-1 fill-current" />
                <span class="text-white md:text-base">{{ comment.rating }}</span>
              </div>
            </div>

            <p class="text-gray-300 text-sm md:text-base leading-relaxed mb-2">{{ comment.content }}</p>
            <span class="text-gray-500 text-xs md:text-sm">{{ comment.formattedDate }}</span> </div>
        </div>
      </div>
    </div>
    <div v-if="hasMoreComments" class="text-center mt-6 md:mt-8">
      <button
        @click="loadMoreComments"
        :disabled="isLoadingMoreComments"
        class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoadingMoreComments">Loading...</span>
        <span v-else>Load More Reviews</span>
      </button>
      <div v-if="commentsError && !isLoadingMoreComments" class="text-red-500 mt-2 text-sm md:text-base" aria-live="assertive">
        Error loading more comments: {{ commentsError.message }}
      </div>
    </div>
  </div>
</template>