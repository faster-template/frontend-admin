import axios from 'axios';

export function getList(query) {
  return axios.get('/material/getList', { params: { ...query } });
}

export default null;
