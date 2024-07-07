import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { getCSRF, getToken } from '@/utils';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  message?: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    const csrf = getCSRF();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-csrf-token'] = csrf as string;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message.error({
        content: res.message || res.msg || 'Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if ([3001].includes(res.code)) {
        Modal.error({
          title: '确认退出',
          content: '登录失效，请重新登录',
          okText: '重新登陆',
          async onOk() {
            // const userStore = useUserStore();
            // await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
