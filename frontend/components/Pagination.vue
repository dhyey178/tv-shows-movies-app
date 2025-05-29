<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { computed } from 'vue';

interface PaginationProps {
  page: number;
  totalPages: number;
  pending: boolean;
}

const props = defineProps<PaginationProps>();

const emit = defineEmits(['update:page', 'changePage']);

const handlePrevPage = () => {
  if (props.page > 1) {
    emit('update:page', props.page - 1);
    emit('changePage', props.page - 1);
  }
};

const handleNextPage = () => {
  if (props.page < props.totalPages) {
    emit('update:page', props.page + 1);
    emit('changePage', props.page + 1);
  }
};

const setCurrentPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= props.totalPages && newPage !== props.page) {
    emit('update:page', newPage);
    emit('changePage', newPage);
  }
};

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 3;
  const boundaryPages = 1;
  const ellipsis = '...';

  if (props.totalPages <= maxVisiblePages) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    let start = Math.max(2, props.page - Math.floor((maxVisiblePages - 3) / 2));
    let end = Math.min(props.totalPages - 1, props.page + Math.ceil((maxVisiblePages - 3) / 2));

    if (props.page < (boundaryPages + Math.floor(maxVisiblePages / 2))) {
      end = maxVisiblePages - 2;
    } else if (props.page > props.totalPages - (boundaryPages + Math.floor(maxVisiblePages / 2))) {
      start = props.totalPages - (maxVisiblePages - 3);
    }
    
    if (start > 2) {
      pages.push(ellipsis);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < props.totalPages - 1) {
      pages.push(ellipsis);
    }

    if (!pages.includes(props.totalPages)) {
      pages.push(props.totalPages);
    }
  }

  const generatedPages: (number | string)[] = [];
  let rangeStart = props.page - Math.floor(maxVisiblePages / 2);
  let rangeEnd = props.page + Math.floor(maxVisiblePages / 2);

  if (rangeStart < 1) {
    rangeEnd += (1 - rangeStart);
    rangeStart = 1;
  }

  if (rangeEnd > props.totalPages) {
    rangeStart -= (rangeEnd - props.totalPages);
    rangeEnd = props.totalPages;
  }

  rangeStart = Math.max(1, rangeStart);

  if (rangeStart > 1) {
    generatedPages.push(1);
    if (rangeStart > 2) {
      generatedPages.push(ellipsis);
    }
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    generatedPages.push(i);
  }

  if (rangeEnd < props.totalPages) {
    if (rangeEnd < props.totalPages - 1) {
      generatedPages.push(ellipsis);
    }
    generatedPages.push(props.totalPages);
  }

  return generatedPages;
});
</script>

<template>
  <div v-if="totalPages > 1 && !pending" class="flex items-center justify-center space-x-2">
    <button
      @click="handlePrevPage"
      :disabled="!(page > 1) || pending"
      aria-label="Previous page"
      class="flex items-center px-2 py-1 sm:px-3 sm:py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-sm md:text-base text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
    >
      <ChevronLeft class="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
      <span class="hidden sm:inline">Previous</span>
    </button>
    
    <div class="flex items-center space-x-1 sm:space-x-2">
      <template v-for="p in visiblePages" :key="p">
        <span
          v-if="p === '...'"
          class="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base text-gray-400"
          aria-hidden="true"
        >
          ...
        </span>
        <button
          v-else
          @click="setCurrentPage(p as number)"
          :disabled="pending"
          :aria-current="page === p ? 'page' : undefined"
          :class="`px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base rounded-lg transition-all duration-200 ${
            page === p
              ? 'bg-purple-600 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`"
        >
          {{ p }}
        </button>
      </template>
    </div>

    <button
      @click="handleNextPage"
      :disabled="!(page < totalPages) || pending"
      aria-label="Next page"
      class="flex items-center px-2 py-1 sm:px-3 sm:py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-sm md:text-base text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
    >
      <span class="hidden sm:inline">Next</span>
      <ChevronRight class="h-3 w-3 sm:h-4 sm:w-4 ml-0 sm:ml-1" />
    </button>
  </div>
</template>