import axios from './axios';

export function getList(query) {
  return axios.get('/draft/getList', { params: { ...query } });
}

export default null;
