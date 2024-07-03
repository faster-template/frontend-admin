import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SETTING: AppRouteRecordRaw = {
  path: '/setting',
  name: 'setting',
  redirect: '/setting/userinfo',
  meta: {
    locale: 'menu.setting',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 10,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'userinfo',
      name: 'user-info',
      meta: {
        locale: 'menu.setting.userinfo',
        requiresAuth: true,
        order: 1,
      },
      component: () => import('@/views/setting/userinfo.vue'),
    },
  ],
};

export default SETTING;
