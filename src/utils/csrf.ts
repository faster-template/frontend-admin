import { getStorage, removeStorage, setStorage } from './storage';

const CSRF_KEY = 'csrf-token';

const getCSRF = () => {
  return getStorage(CSRF_KEY);
};
const setCSRF = (token: string) => {
  setStorage(CSRF_KEY, token);
};
const clearCSRF = () => {
  removeStorage(CSRF_KEY);
};

export { setCSRF, getCSRF, clearCSRF };
