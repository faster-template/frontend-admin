import axios from './axios';

export function list() {
  return axios.get('/category/getList');
}
export function getRootList() {
  return axios.get('/category/rootList');
}

export function getChildren(id: string) {
  return axios.get('/category/getChildren', { params: { id } });
}

export function getChildrenByKey(key: string) {
  return axios.get('/category/getChildrenByKey', { params: { key } });
}

export function create(data: any) {
  return axios.post('/category/create', data);
}

export function update(data: any) {
  return axios.post('/category/update', data);
}

export function del(id: string) {
  return axios.post('/category/delete', { id });
}

export function sort(sourceId: string, targetId: string, position: number) {
  return axios.post('/category/sort', { sourceId, targetId, position });
}
