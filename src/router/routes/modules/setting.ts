import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SETTING: AppRouteRecordRaw = {
  path: '',
  name: 'setting',
  meta: {
    locale: 'menu.setting',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 10,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: '/setting/userinfo',
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
