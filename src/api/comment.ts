import { CommentCreateBody, CommentQueryParams } from '@/types/comment';
import axios from 'axios';

export function getComments(query: CommentQueryParams) {
  return axios.get('/comment/getList', { params: { ...query } });
}

export function createComments(data: CommentCreateBody) {
  return axios.post('/comment/create', data);
}

export function deleteComments(id: string) {
  return axios.post('/comment/delete', null, { params: { id } });
}

export default null;
