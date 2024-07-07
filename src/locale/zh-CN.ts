import localeLogin from '@/views/login/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  /** 新引入 */
  'menu.homepage': '首页',
  'menu.homepage.index': '工作台',
  'menu.article': '文章',
  'menu.article.list': '文章列表',
  'menu.article.create': '新增文章',
  'menu.article.edit': '编辑文章',
  'menu.category': '分类',
  'menu.category.manage': '分类管理',
  'menu.setting': '设置',
  'menu.setting.userinfo': '用户信息',
  'menu.material': '素材',
  'menu.material.list': '素材管理',

  'state.disabled': '已禁用',
  'state.deleted': '已删除',
  'state.draft': '草稿',
  'state.normal': '正常',
  'state.pending': '待审核',

  'navbar.userSettings': '用户设置',
  'navbar.logout': '登出登录',
  ...localeSettings,
  ...localeLogin,
};
