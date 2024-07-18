import { UploadOption } from '@/types/upload';
import axios from './axios';

export const uploadFile = (file: File, data: UploadOption, action = '/upload/file') => {
  const formData = new FormData();
  formData.append('file', file);
  if (data) {
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, v);
    });
  }
  return axios.post(action, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default null;
