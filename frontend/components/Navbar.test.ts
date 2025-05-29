import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Navbar from './Navbar.vue';
import { NuxtLink } from '#components';
import { reactive } from 'vue';

const mockedRoute = reactive({
  path: '/',
});

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => mockedRoute),
}));

describe('Navbar.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  const addClassSpy = vi.spyOn(document.body.classList, 'add');
  const removeClassSpy = vi.spyOn(document.body.classList, 'remove');

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.classList.remove('overflow-hidden');
    mockedRoute.path = '/';

    wrapper = mount(Navbar, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
          Film: true,
          Clapperboard: true,
          Menu: true,
          X: true,
          TvMinimalPlay: true,
        },
      },
    });
  });

  it('should render the header with title and navigation links', () => {
    expect(wrapper.find('h1').text()).toBe('CineVault');

    const navLinks = wrapper.findAllComponents(NuxtLink);
    expect(navLinks[0].props().to).toBe('/');

    const desktopLinks = wrapper.findAll('.hidden.md\\:flex a');
    expect(desktopLinks.length).toBe(2);
    expect(desktopLinks[0].attributes('href')).toBe('/movies');
    expect(desktopLinks[1].attributes('href')).toBe('/tv-shows');

    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
  });

  it('should open mobile menu when hamburger icon is clicked', async () => {
    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);

    const mobileMenuButton = wrapper.find('button[aria-controls="mobile-menu"]');
    await mobileMenuButton.trigger('click');
    await vi.dynamicImportSettled();

    expect(wrapper.find('#mobile-menu').exists()).toBe(true);
    expect(mobileMenuButton.attributes('aria-expanded')).toBe('true');
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);
    expect(addClassSpy).toHaveBeenCalledWith('overflow-hidden');
  });

  it('should close mobile menu when X icon is clicked', async () => {
    const mobileMenuButton = wrapper.find('button[aria-controls="mobile-menu"]');
    await mobileMenuButton.trigger('click');
    await vi.dynamicImportSettled();
    expect(wrapper.find('#mobile-menu').exists()).toBe(true);

    await mobileMenuButton.trigger('click');
    await vi.dynamicImportSettled();

    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
    expect(mobileMenuButton.attributes('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
    expect(removeClassSpy).toHaveBeenCalledWith('overflow-hidden');
  });

  it('should close mobile menu when a link inside it is clicked', async () => {
    await wrapper.find('button[aria-controls="mobile-menu"]').trigger('click');
    await vi.dynamicImportSettled();
    expect(wrapper.find('#mobile-menu').exists()).toBe(true);

    const mobileMoviesLink = wrapper.find('#mobile-menu a[href="/movies"]');
    expect(mobileMoviesLink.exists()).toBe(true);

    await mobileMoviesLink.trigger('click');
    await vi.dynamicImportSettled();

    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
    expect(wrapper.find('button[aria-controls="mobile-menu"]').attributes('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('should close mobile menu when route changes', async () => {
    await wrapper.find('button[aria-controls="mobile-menu"]').trigger('click');
    await vi.dynamicImportSettled();
    expect(wrapper.find('#mobile-menu').exists()).toBe(true);
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    mockedRoute.path = '/about';
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('should remove overflow-hidden from body on unmount', async () => {
    await wrapper.find('button[aria-controls="mobile-menu"]').trigger('click');
    await vi.dynamicImportSettled();
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    wrapper.unmount();
    await vi.dynamicImportSettled();

    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
    expect(removeClassSpy).toHaveBeenCalledWith('overflow-hidden');
  });
}); 