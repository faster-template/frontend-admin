import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
  csrf_token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/admin-auth/login', data);
}

export function getUserInfo() {
  return axios.post<UserState>('/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/user/menu');
}

export function modifyNickName(nickName: string) {
  return axios.post('/user/modifyNickName', { nickName });
}

export function modifyUserName(userName: string) {
  return axios.post('/user/modifyUserName', { userName });
}
export function modifyAvatar(avatarUrl: string) {
  return axios.post('/user/modifyAvatar', { avatarUrl });
}
export function modifyPwd(oldPassword: string, newPassword: string) {
  return axios.post('/user/modifyPwd', { oldPassword, newPassword });
}
