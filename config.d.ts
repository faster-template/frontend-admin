// 因为ts模式下，.vue文件没有默认的export default
// 所以扩展所有的.vue文件，让它默认导出一个Vue组件

import 'vue-router';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const vueComponent: DefineComponent<unknown, unknown, any>;
  export default vueComponent;
}

declare module '*?component' {
  import type { DefineComponent } from 'vue';

  const vueComponent: DefineComponent<unknown, unknown, any>;
  export default vueComponent;
}
// 扩展路由元信息
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    isKeepAlive?: boolean;
    title?: string;
  }
}
