import { LikeCreateParams, LikeDeletearams, LikeQueryParams } from '@/types/like';
import axios from 'axios';

export function likeAdd(data: LikeCreateParams) {
  return axios.post('/like/add', data);
}

export function likeGetCount(data: LikeQueryParams) {
  return axios.get('/like/getCount', { params: { ...data } });
}

export function likeDelete(data: LikeDeletearams) {
  return axios.post('/like/delete', data);
}

export default null;
