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
  timeout: 3000,
  headers: {},
});

/**
 *  使用config中参数：url,method,params,data 生成唯一key
 * @param config AxiosRequestConfig
 * @returns string（MD5）
 */
function obj2str(obj: object): string {
  return (
    obj &&
    Object.keys(obj)
      .filter((v) => {
        return !!obj[v];
      })
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc: string[], val) => {
        acc.push(`${val}:${obj[val]}`);
        return acc;
      }, [])
      .join('#')
  );
}
function generateFetchKey(config: AxiosRequestConfig): string {
  const keys = { url: config.url, method: config.method, params: config.params, data: config.data };
  keys.params = obj2str(keys.params);
  keys.data = obj2str(keys.data);
  return md5(obj2str(keys));
}
// #region 缓存设置
// ######################## 缓存设置 START ########################
const CACHE_KEY = 'fetch-cache';
const CACHE_MESSAGE = 'custom-cache';
const CACHE_DEFAULT_TIME = 500;
const buildCacheKey = (fetchKey: any) => {
  return `${CACHE_KEY}-${fetchKey}`;
};

const getCacheData = (fetchKey: string): null | any => {
  return getStorage<Record<string, any>>(buildCacheKey(fetchKey), sessionStorage);
};
const setCacheData = (fetchKey: string, data: any, expired: number) => {
  fetchKey = buildCacheKey(fetchKey);
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

const INTERVAL_MESSAGE = 'custom-interval';
const INTERVAL_DEFAULT_TIME = 500;
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
    const fetchKey = generateFetchKey(config);
    // 判断是否需限制请求频率
    if (config.interval !== false) {
      if (fetchQuery.has(fetchKey)) {
        const cancelRejectData = { message: INTERVAL_MESSAGE };
        return Promise.reject(cancelRejectData);
      }
      addFetchQuery(fetchKey, config.interval || INTERVAL_DEFAULT_TIME);
    }

    // 判断是否使用缓存
    if (config.method === 'get' && config.cache !== false) {
      const cacheData = getCacheData(fetchKey);
      if (cacheData) {
        const cacheRejectData = { data: cacheData, message: CACHE_MESSAGE };
        return Promise.reject(cacheRejectData);
      }
    }
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
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
      setCacheData(generateFetchKey(config), res, config.cache || CACHE_DEFAULT_TIME);
    }
    return res;
  },
  (error) => {
    if (error.message === CACHE_MESSAGE) {
      return Promise.resolve(error.data);
    }
    if (error.message !== INTERVAL_MESSAGE) {
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
