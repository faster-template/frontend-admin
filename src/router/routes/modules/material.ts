import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MATERIAL: AppRouteRecordRaw = {
  path: '',
  name: 'material',
  meta: {
    locale: 'menu.material',
    icon: 'icon-archive',
    requiresAuth: true,
    order: 1,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: '/material/list',
      name: 'material-list',
      meta: {
        locale: 'menu.material.list',
        requiresAuth: true,
        order: 1,
      },
      component: () => import('@/views/material/index.vue'),
    },
  ],
};

export default MATERIAL;
