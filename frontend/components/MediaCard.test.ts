import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import MediaCard from './MediaCard.vue';
import { NuxtLink } from '#components';
import type { Movie, TvShow } from '../types/media';

vi.mock('#imports', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#imports')>();
  return {
    ...actual,
    formatDuration: vi.fn((minutes: number) => {
      if (minutes === null || minutes === undefined || minutes < 0) {
        return 'N/A';
      }
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours > 0 && remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else if (remainingMinutes > 0) {
        return `${remainingMinutes}m`;
      } else {
        return '0m';
      }
    }),
  };
});

const mockNuxtLink = { template: '<a :href="to"><slot /></a>', props: ['to'] };
const mockLucideIcons = {
  Star: { template: '<span class="icon-star" />' },
  Clock: { template: '<span class="icon-clock" />' },
  Calendar: { template: '<span class="icon-calendar" />' },
  User: { template: '<span class="icon-user" />' },
  ChevronDown: { template: '<svg class="lucide-chevron-down-icon" />' },
  Tv: { template: '<span class="icon-tv" />' },
};

type MediaCardInstance = InstanceType<typeof MediaCard> & {
  commentsContainerRef: HTMLElement | null;
};


describe('MediaCard.vue', () => {

  const baseMovie: Movie = {
    id: '1',
    title: 'Test Movie',
    description: 'A test movie description.',
    imageUrl: 'http://example.com/movie.jpg',
    averageRating: 7.5,
    releaseYear: 2023,
    genre: ['Action', 'Comedy'],
    duration: 120,
    director: 'Test Director',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    cast: ['Actor 1', 'Actor 2'],
    comments: [
      { id: 'c1', author: 'User A', rating: 5, content: 'Great movie!', avatar: null, createdAt: '2023-01-02T00:00:00Z' },
      { id: 'c2', author: 'User B', rating: 4, content: 'Enjoyable.', avatar: 'http://example.com/avatar2.jpg', createdAt: '2023-01-03T00:00:00Z' },
    ],
    totalComments: 2,
  };

  const baseTvShow: TvShow = {
    id: '2',
    title: 'Test TV Show',
    description: 'A test TV show description.',
    imageUrl: 'http://example.com/tvshow.jpg',
    averageRating: 8.0,
    releaseYear: 2022,
    genre: ['Drama', 'Sci-Fi'],
    seasons: 3,
    episodes: 25,
    creator: 'Test Creator',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2022-01-01T00:00:00Z',
    cast: ['Actor A', 'Actor B'],
    comments: [
      { id: 'c3', author: 'User C', rating: 5, content: 'Amazing series!', avatar: 'http://example.com/avatar3.jpg', createdAt: '2022-01-02T00:00:00Z' },
      { id: 'c4', author: 'User D', rating: 3, content: 'Could be better.', avatar: null, createdAt: '2022-01-03T00:00:00Z' },
      { id: 'c5', author: 'User E', rating: 4, content: 'Worth watching.', avatar: 'http://example.com/avatar5.jpg', createdAt: '2022-01-04T00:00:00Z' },
    ],
    totalComments: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render a movie card with correct details', () => {
    const wrapper = mount(MediaCard, {
      props: {
        media: baseMovie,
        type: 'movie',
        showHeader: true,
      },
      global: {
        stubs: {
          NuxtLink: mockNuxtLink,
          ...mockLucideIcons,
        },
      },
    });

    expect(wrapper.find('h3').text()).toBe(baseMovie.title);
    expect(wrapper.find('img').attributes('src')).toBe(baseMovie.imageUrl);
    expect(wrapper.find('img').attributes('alt')).toBe(baseMovie.title);
    expect(wrapper.text()).toContain(baseMovie.averageRating.toString());
    expect(wrapper.text()).toContain(baseMovie.releaseYear.toString());
    expect(wrapper.text()).toContain(baseMovie.genre[0]);
    expect(wrapper.text()).toContain(baseMovie.description);

    expect(wrapper.text()).toContain('2h');
    expect(wrapper.find('.lucide-clock-icon').exists()).toBe(true);
    expect(wrapper.find('.lucide-tv-icon').exists()).toBe(false);

    expect(wrapper.find('.top-3.left-3').text()).toBe('Movie');

    expect(wrapper.findComponent(NuxtLink).props().to).toBe(`/movies/${baseMovie.id}`);

    expect(wrapper.text()).toContain(`${baseMovie.totalComments} Reviews`);
    expect(wrapper.findAll('.space-y-2 > div').length).toBe(baseMovie.comments.length);
    expect(wrapper.text()).toContain(baseMovie.comments[0].author);
    expect(wrapper.text()).toContain(baseMovie.comments[0].content);
  });

  it('should render a TV show card with correct details', () => {
    const wrapper = mount(MediaCard, {
      props: {
        media: baseTvShow,
        type: 'tv-show',
        showHeader: false,
      },
      global: {
        stubs: {
          NuxtLink: mockNuxtLink,
          ...mockLucideIcons,
        },
      },
    });

    expect(wrapper.find('h3').text()).toBe(baseTvShow.title);
    expect(wrapper.find('img').attributes('src')).toBe(baseTvShow.imageUrl);
    expect(wrapper.find('img').attributes('alt')).toBe(baseTvShow.title);
    expect(wrapper.text()).toContain(baseTvShow.averageRating.toString());
    expect(wrapper.text()).toContain(baseTvShow.releaseYear.toString());
    expect(wrapper.text()).toContain(baseTvShow.genre[0]);
    expect(wrapper.text()).toContain(baseTvShow.description);

    expect(wrapper.text()).toContain(`${baseTvShow.seasons} seasons`);
    expect(wrapper.find('.lucide-tv-icon').exists()).toBe(true);
    expect(wrapper.find('.lucide-clock-icon').exists()).toBe(false);
 
    expect(wrapper.find('.top-3.left-3').exists()).toBe(false);

    expect(wrapper.findComponent(NuxtLink).props().to).toBe(`/tv-shows/${baseTvShow.id}`);

    expect(wrapper.text()).toContain(`${baseTvShow.totalComments} Reviews`);
    expect(wrapper.findAll('.space-y-2 > div').length).toBe(baseTvShow.comments.length);
  });

  it('should show "View all reviews" if totalComments > displayedComments.length', async () => {
    const mediaWithMoreComments: Movie = {
      ...baseMovie,
      comments: [
        { id: 'c1', author: 'User A', rating: 5, content: 'Great movie!', avatar: null, createdAt: '2023-01-02T00:00:00Z' },
      ],
      totalComments: 5,
    };

    const wrapper = mount(MediaCard, {
      props: {
        media: mediaWithMoreComments,
        type: 'movie',
      },
      global: {
        stubs: {
          NuxtLink: mockNuxtLink,
          ...mockLucideIcons,
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('View all reviews');
  });

  it('should NOT show "View all reviews" if totalComments <= displayedComments.length', async () => {
    const mediaWithAllComments: Movie = {
      ...baseMovie,
      comments: [
        { id: 'c1', author: 'User A', rating: 5, content: 'Great movie!', avatar: null, createdAt: '2023-01-02T00:00:00Z' },
        { id: 'c2', author: 'User B', rating: 4, content: 'Enjoyable.', avatar: 'http://example.com/avatar2.jpg', createdAt: '2023-01-03T00:00:00Z' },
      ],
      totalComments: 2,
    };

    const wrapper = mount(MediaCard, {
      props: {
        media: mediaWithAllComments,
        type: 'movie',
      },
      global: {
        stubs: {
          NuxtLink: mockNuxtLink,
          ...mockLucideIcons,
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('View all reviews');
  });

  it('should show scroll indicator if comments container is scrollable', async () => {
    const wrapper = mount(MediaCard, {
      props: {
        media: {
          ...baseMovie,
          comments: Array.from({ length: 10 }).map((_, i) => ({
            id: `c${i}`,
            author: `User ${i}`,
            rating: 5,
            content: `This is a very long comment number ${i} that will hopefully force the container to be scrollable. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
            avatar: i % 2 === 0 ? null : `http://example.com/avatar${i}.jpg`,
            createdAt: `2023-01-01T${i.toString().padStart(2, '0')}:00:00Z`,
          })),
        },
        type: 'movie',
      },
      global: {
        stubs: {
          NuxtLink: mockNuxtLink,
          ...mockLucideIcons,
        },
      },
    });

    await wrapper.vm.$nextTick();
    const vm = wrapper.vm as MediaCardInstance;
    if (vm.commentsContainerRef) {
      Object.defineProperty(vm.commentsContainerRef, 'scrollHeight', { value: 300, configurable: true });
      Object.defineProperty(vm.commentsContainerRef, 'clientHeight', { value: 100, configurable: true });
    }
    vm.checkIfScrollable();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.lucide-chevron-down-icon').exists()).toBe(true);
    expect(wrapper.text()).toContain('Scroll');

  });

  it('should NOT show scroll indicator if comments container is not scrollable', async () => {
    const wrapper = mount(MediaCard, {
      props: {
        media: baseMovie,
        type: 'movie',
      },
      global: {
        stubs: {
          NuxtLink: mockNuxtLink,
          ...mockLucideIcons,
        },
      },
    });

    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as MediaCardInstance;

    if (vm.commentsContainerRef) {
      Object.defineProperty(vm.commentsContainerRef, 'scrollHeight', { value: 50, configurable: true });
      Object.defineProperty(vm.commentsContainerRef, 'clientHeight', { value: 100, configurable: true });
    }
    vm.checkIfScrollable();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.lucide-chevron-down-icon').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Scroll');
  });

  it('should display a maximum of 3 genres', () => {
    const mediaWithManyGenres: Movie = {
      ...baseMovie,
      genre: ['Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi'],
    };

    const wrapper = mount(MediaCard, {
      props: {
        media: mediaWithManyGenres,
        type: 'movie',
      },
      global: {
        stubs: {
          NuxtLink: mockNuxtLink,
          ...mockLucideIcons,
        },
      },
    });

    const genreSpans = wrapper.findAll('.px-2.py-1.text-xs.md\\:text-sm');
    expect(genreSpans.length).toBe(3);
    expect(genreSpans[0].text()).toBe('Action');
    expect(genreSpans[1].text()).toBe('Comedy');
    expect(genreSpans[2].text()).toBe('Drama');
  });
});