import { getStorage, setStorage, removeStorage } from './storage';

const TOKEN_KEY = 'admin-token';

const getToken = () => {
  return getStorage(TOKEN_KEY);
};

const setToken = (token: string) => {
  setStorage(TOKEN_KEY, token);
};

const clearToken = () => {
  removeStorage(TOKEN_KEY);
};

const isLogin = () => {
  return !!getToken();
};

export { isLogin, getToken, setToken, clearToken };
