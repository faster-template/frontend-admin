import { defineStore } from 'pinia';
import { login as userLogin, getUserInfo, LoginData } from '@/api/user';
import { setToken, clearToken, setCSRF } from '@/utils';
import { removeRouteListener } from '@/router/emit';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    avatarUrl: undefined,
    nickName: undefined,
    userName: undefined,
    phone: undefined,
    id: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      const { avatarUrl, nickName, userName, phone, id } = state;
      return { avatarUrl, nickName, userName, phone, id };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();

      this.setInfo(res.data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.access_token);
        setCSRF(res.data['csrf-token']);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
      window.location.reload();
    },
    // Logout
    async logout() {
      this.logoutCallBack();
    },
  },
});

export default useUserStore;
