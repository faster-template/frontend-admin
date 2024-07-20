import type { Router, LocationQueryRaw } from 'vue-router';
import * as NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { Message } from '@arco-design/web-vue';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      try {
        await userStore.info();
        next();
      } catch (error) {
        Message.error('获取用户信息失败，请刷新重试');
        await userStore.logout();
        next({
          name: 'login',
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        });
      }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
