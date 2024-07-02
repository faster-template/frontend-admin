import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  /** 新引入 */
  'menu.article': '文章',
  'menu.article.list': '文章列表',
  'menu.article.create': '新增文章',
  'menu.article.edit': '编辑文章',
  'menu.category': '分类',
  'menu.category.manage': '分类管理',
  'menu.setting': '设置',
  'menu.setting.userinfo': '用户信息',
  'state.disabled': '已禁用',
  'state.deleted': '已删除',
  'state.draft': '草稿',
  'state.normal': '正常',
  'state.pending': '待审核',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
};
