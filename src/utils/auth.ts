const TOKEN_KEY = 'admin-token';
const CSRF_KEY = 'csrf-token';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const setCSRF = (token: string) => {
  localStorage.setItem(CSRF_KEY, token);
};
const getCSRF = () => {
  return localStorage.getItem(CSRF_KEY);
};
const clearCSRF = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export { isLogin, getToken, setToken, clearToken, setCSRF, getCSRF, clearCSRF };
