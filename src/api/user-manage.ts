// ---------- 管理接口 -----------
import axios from 'axios';

export function list(params: Record<string, unknown>) {
  return axios.get('/user-manage/getList', { params });
}
export function setState(id: string, state: number) {
  return axios.post('/user-manage/setState', { id, state });
}

export default null;
