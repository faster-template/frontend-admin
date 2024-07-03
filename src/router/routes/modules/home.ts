import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ARTICLE: AppRouteRecordRaw = {
  path: '/home',
  name: 'HomePage',
  redirect: '/home/index',
  meta: {
    locale: 'menu.homepage',
    icon: 'icon-heart-fill',
    requiresAuth: true,
    order: 1,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'index',
      name: 'home-info',
      meta: {
        locale: 'menu.homepage.index',
        requiresAuth: true,
        order: 1,
      },
      component: () => import('@/views/home/index.vue'),
    },
  ],
};

export default ARTICLE;
