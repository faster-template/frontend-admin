import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  redirect: '/user/list',
  meta: {
    locale: 'menu.user',
    icon: 'icon-user',
    requiresAuth: true,
    order: 4,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'list',
      name: 'user-list',
      meta: {
        locale: 'menu.user.list',
        requiresAuth: true,
        order: 1,
      },
      component: () => import('@/views/user/index.vue'),
    },
  ],
};

export default USER;
