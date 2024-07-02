import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ARTICLE: AppRouteRecordRaw = {
  path: '/category',
  name: 'category',
  meta: {
    locale: 'menu.category',
    icon: 'icon-mind-mapping',
    requiresAuth: true,
    order: 2,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'list',
      name: 'category-list',
      meta: {
        locale: 'menu.category.manage',
        requiresAuth: true,
        order: 1,
      },
      component: () => import('@/views/category/index.vue'),
    },
  ],
};

export default ARTICLE;
