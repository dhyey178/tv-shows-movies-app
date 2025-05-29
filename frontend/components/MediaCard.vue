<script setup lang="ts">
import { Star, Clock, Calendar, User, ChevronDown, Tv } from 'lucide-vue-next';
import type { TvShow, Movie } from '../types/media';
import { formatDuration } from '#imports';

interface MediaCardProps {
  media: Movie | TvShow;
  type: 'movie' | 'tv-show';
  showHeader?: boolean;
}

const props = defineProps<MediaCardProps>();

const displayedComments = computed(() => props.media.comments);

const headerText = computed(() => {
  if (props.type === 'movie') {
    return 'Movie';
  } else if (props.type === 'tv-show') {
    return 'TV Show';
  }
  return '';
});

const commentsContainerRef = ref<HTMLElement | null>(null);

const showScrollIndicator = ref(false);

const checkIfScrollable = () => {
  if (commentsContainerRef.value) {
    showScrollIndicator.value = commentsContainerRef.value.scrollHeight > commentsContainerRef.value.clientHeight;
  }
};

onMounted(() => {
  checkIfScrollable();
});

watch(() => props.media.comments.length, () => {
  nextTick(() => {
    checkIfScrollable();
  });
});

defineExpose({
  commentsContainerRef,
  checkIfScrollable,
  showScrollIndicator
});

</script>

<template>
  <NuxtLink
    :to="`/${props.type === 'movie' ? 'movies' : 'tv-shows'}/${props.media.id}`"
    class="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-[1.02] block"
  >
    <div
      v-if="props.showHeader"
      class="absolute top-3 left-3 bg-purple-600 text-white text-xs md:text-sm font-semibold px-3 py-1 rounded-full z-10"
    >
      {{ headerText }}
    </div>

    <div class="flex flex-col md:flex-row">
      <div class="md:w-48 md:flex-shrink-0 bg-gray-800">
        <img
          :src="props.media.imageUrl"
          :alt="props.media.title"
          class="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div class="flex-1 p-6">
        <div class="flex flex-col md:flex-row md:gap-8">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center text-yellow-400">
                <Star class="h-4 w-4 mr-1 fill-current" />
                <span class="text-white text-sm md:text-base font-medium">{{ props.media.averageRating }}</span>
              </div>
              <div class="flex items-center text-gray-400 text-sm md:text-base">
                <Calendar class="h-4 w-4 mr-1" />
                {{ props.media.releaseYear }}
              </div>
            </div>
            <h3 class="text-base md:text-xl font-bold text-white mb-2">{{ props.media.title }}</h3>
            <div class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="g in props.media.genre.slice(0, 3)"
                :key="g"
                class="px-2 py-1 text-xs md:text-sm bg-purple-600/30 text-purple-300 rounded-full"
              >
                {{ g }}
              </span>
            </div>
            <p class="text-gray-300 text-xs md:text-sm leading-relaxed mb-3">
              {{ props.media.description }}
            </p>
            <div class="flex items-center text-gray-400 text-xs md:text-sm">
              <template v-if="props.type === 'movie'">
                <Clock class="h-4 w-4 mr-1" />
                {{ formatDuration((props.media as any).duration) }}
              </template>
              <template v-else>
                <Tv class="h-4 w-4 mr-1" />
                {{ (props.media as any).seasons }} seasons
              </template>
            </div>
          </div>
          <div class="md:w-80 mt-4 md:mt-0">
            <div class="border-t md:border-t-0 md:border-l border-white/10 md:pl-6 pt-4 md:pt-0">
              <div class="flex items-center justify-between text-gray-300 text-xs sm:text-sm mb-3">
                <div class="flex items-center">
                  <User class="h-4 w-4 mr-1" />
                  <span>{{ props.media.totalComments }} Reviews</span>
                </div>
                <div v-if="showScrollIndicator" class="flex items-center text-xs md:text-sm text-gray-400">
                  <span>Scroll</span>
                  <ChevronDown class="h-3 w-3 ml-1 animate-bounce" />
                </div>
              </div>
              <div class="relative">
                <div 
                  ref="commentsContainerRef"
                  class="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-purple-400/30 hover:scrollbar-thumb-purple-400/50"
                  :style="{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(168, 85, 247, 0.3) rgba(255, 255, 255, 0.05)'
                  }"
                >
                  <div v-for="comment in displayedComments" :key="comment.id" class="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-white text-xs md:text-sm font-medium">{{ comment.author }}</span>
                      <div class="flex items-center text-yellow-400">
                        <Star class="h-3 w-3 mr-1 fill-current" />
                        <span class="text-white text-xs md:text-sm">{{ comment.rating }}</span>
                      </div>
                    </div>
                    <p class="text-gray-300 text-xs md:text-sm line-clamp-2">{{ comment.content }}</p>
                  </div>
                </div>
                <div v-if="showScrollIndicator" class="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
              <div v-if="props.media.totalComments > displayedComments.length" class="mt-3 text-center">
                <span class="text-purple-400 text-xs md:text-sm">
                  View all reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>