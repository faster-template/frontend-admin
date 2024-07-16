import axios from './axios';

export function list(query) {
  return axios.get('/article/getList', { params: { ...query }, cache: 200 });
}

export function getDetail(id: string) {
  return axios.get('/article/getDetail', { params: { id } });
}

export function save(data: any) {
  return axios.post('/article/save', data);
}

export function del(id: string) {
  return axios.post('/article/delete', null, { params: { id } });
}

export function saveAsDraft(data: any) {
  return axios.post('/article/saveAsDraft', data);
}

export function getDraftList(id: string) {
  return axios.get('/article/getDraftList', { params: { id } });
}

export function publish(id: string) {
  return axios.post('/article/publish', null, { params: { id } });
}

export function unPublish(id: string) {
  return axios.post('/article/unPublish', null, { params: { id } });
}
