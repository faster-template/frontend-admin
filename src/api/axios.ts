import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { getCSRF } from '@/utils/csrf';
import { getToken } from '@/utils/auth';

import { getStorage, removeStorage, setStorage } from '@/utils/storage';

import { md5 } from 'js-md5';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  message?: string;
  code: number;
  data: T;
}

export interface RequestConfig<T = any> extends AxiosRequestConfig<T> {
  interval?: number | false;
  cache?: number | false;
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
  headers: {},
});

/**
 *  使用config中的，url,method,data,params 等参数生成唯一的key
 * @param config AxiosRequestConfig
 * @returns string（MD5）
 */
function generateFetchKey(config: AxiosRequestConfig): string {
  const keys = { url: config.url, method: config.method, params: config.params, data: config.data };
  keys.params =
    keys.params &&
    Object.keys(keys.params)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc: string[], val) => {
        acc.push(`p_${val}:${keys.params[val]}`);
        return acc;
      }, [])
      .join('#');
  keys.data =
    keys.data &&
    Object.keys(keys.data)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc: string[], val) => {
        acc.push(`d_${val}:${keys.data[val]}`);
        return acc;
      }, [])
      .join('#');
  return md5(
    Object.keys(keys)
      .filter((v) => {
        return !!keys[v];
      })
      .reduce((acc: string[], val) => {
        acc.push(`${val}:${keys[val]}`);
        return acc;
      }, [])
      .join('+')
  );
}
// #region 缓存设置
// ######################## 缓存设置 START ########################
const CACHE_KEY = 'fetch-cache';
const CACHE_MESSAGE = 'from-cache';
const buildKey = (fetchKey: any) => {
  return `${CACHE_KEY}-${fetchKey}`;
};

const getCacheData = (fetchKey: string): null | any => {
  return getStorage<Record<string, any>>(buildKey(fetchKey), sessionStorage);
};
const setCacheData = (fetchKey: string, data: any, expired: number) => {
  fetchKey = buildKey(fetchKey);
  setStorage(fetchKey, data, sessionStorage);
  setTimeout(() => {
    removeStorage(fetchKey, sessionStorage);
  }, expired);
};
// ######################## 缓存设置  END  #########################
// #endregion

// #region 连续请求设置
// ######################## 连续请求设置 START ########################
// 用于记录当前请求的取消函数
const fetchQuery: Set<string> = new Set();
function addFetchQuery(fetchKey: string, interval: number) {
  fetchQuery.add(fetchKey);
  setTimeout(() => {
    fetchQuery.delete(fetchKey);
  }, interval);
}
// ######################## 连续请求设置  END  ########################
// #endregion

// ######################## 拦截器 START ########################

instance.interceptors.request.use(
  (config: RequestConfig) => {
    const controller = new AbortController();
    config.signal = controller.signal;
    const fetchKey = generateFetchKey(config);
    // 如果需要进行简短
    if (config.interval !== false) {
      if (fetchQuery.has(fetchKey)) {
        setTimeout(() => {
          controller.abort();
        }, 0);
      } else {
        addFetchQuery(fetchKey, config.interval || 5000);
      }
    }

    // 尝试从缓存获取数据
    if (config.method === 'get' && config.cache !== false) {
      const cacheData = getCacheData(fetchKey);
      if (cacheData) {
        const cacheRejectData = { data: cacheData, message: CACHE_MESSAGE };
        return Promise.reject(cacheRejectData);
      }
    }
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-csrf-token'] = getCSRF() as string;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    if (res.code !== 200) {
      Message.error({
        content: res.message || res.msg || 'Error',
        duration: 3 * 1000,
      });
      if ([3001].includes(res.code)) {
        Modal.error({
          title: '确认退出',
          content: '登录失效，请重新登录',
          okText: '重新登陆',
          async onOk() {
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    const config = response.config as RequestConfig;
    if (config.method === 'get' && config.cache !== false) {
      setCacheData(generateFetchKey(config), res, config.cache || 500);
    }
    return res;
  },
  (error) => {
    if (error.message === CACHE_MESSAGE) {
      return Promise.resolve(error.data);
    }
    if (error.message !== 'canceled') {
      Message.error({
        content: error.msg || '客户端异常，请刷新重试',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);
// ######################## 拦截器  END  ########################

// 为扩展Axios的Config,重新export get/post方法将参数由 AxiosRequestConfig 修改为 RequestConfig
export default {
  instance,
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: RequestConfig<D>): Promise<R> {
    return instance.get(url, config);
  },
  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R> {
    return instance.post(url, data, config);
  },
};
