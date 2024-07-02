import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ARTICLE: AppRouteRecordRaw = {
  path: '',
  name: 'article',
  meta: {
    locale: 'menu.article',
    icon: 'icon-book',
    requiresAuth: true,
    order: 1,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: '/article/list',
      name: 'article-list',
      meta: {
        locale: 'menu.article.list',
        requiresAuth: true,
        order: 1,
      },
      component: () => import('@/views/article/list.vue'),
    },
    {
      path: '/article/create',
      name: 'article-create',
      meta: {
        locale: 'menu.article.create',
        requiresAuth: true,
        order: 1,
        hideInMenu: true,
      },
      component: () => import('@/views/article/createOrEdit.vue'),
    },
    {
      path: '/article/edit/:id',
      name: 'article-edit',
      meta: {
        locale: 'menu.article.edit',
        requiresAuth: true,
        order: 1,
        hideInMenu: true,
      },
      component: () => import('@/views/article/createOrEdit.vue'),
    },
  ],
};

export default ARTICLE;
