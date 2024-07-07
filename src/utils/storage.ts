const cachePrefix = import.meta.env.VITE_APP_STORAGE_PREFIX;

const buildKey = (key: string): string => {
  if (!key) throw new Error('Storage Key cannot be empty');
  return `${cachePrefix}_${key}`;
};

export const getStorage = <T>(key: string, storage: Storage = localStorage): T | null => {
  const data = storage.getItem(buildKey(key));
  if (!data) {
    return null;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return data as unknown as T;
  }
};

const illegalJSON = ['function(){[native code]}', '{}', '[]', 'null', ''];
const Json2Str = (data: unknown): string => {
  const str = JSON.stringify(data);
  if (illegalJSON.includes(str)) {
    throw new Error('illegal  data to storage');
  }
  return str;
};
export const setStorage = (key: string, data: unknown, storage: Storage = localStorage): void => {
  const storageKey = buildKey(key);
  if (data === null) {
    storage.removeItem(storageKey);
  }
  storage.setItem(storageKey, Json2Str(data));
};

export const removeStorage = (key: string, storage: Storage = localStorage): void => {
  storage.removeItem(buildKey(key));
};
