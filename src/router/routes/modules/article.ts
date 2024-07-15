import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ARTICLE: AppRouteRecordRaw = {
  path: '/article',
  name: 'article',
  redirect: '/article/list',
  meta: {
    locale: 'menu.article',
    icon: 'icon-book',
    requiresAuth: true,
    order: 2,
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'list',
      name: 'article-list',
      meta: {
        locale: 'menu.article.list',
        requiresAuth: true,
        order: 1,
      },
      component: () => import('@/views/article/index.vue'),
    },
    {
      path: 'create',
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
      path: 'edit/:id',
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
