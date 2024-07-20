import { UploadOption } from '@/types/upload';
import { AxiosResponse } from 'axios';
import axios from './axios';

export const uploadFile = (file: File, data: UploadOption, action = '/upload/file') => {
  const formData = new FormData();
  formData.append('file', file);
  data.oss = data.oss || 'qiniu';
  data.folder = data.folder || 'file';
  data.materialState = data.materialState || -2;
  data.quality = 80;
  Object.entries(data).forEach(([k, v]) => {
    formData.append(k, v);
  });
  return axios.post(action, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadFileCanAbort = (
  file: File,
  data: UploadOption,
  action = '/upload/file'
): { controller: AbortController; request: Promise<AxiosResponse<any>> } => {
  const formData = new FormData();
  formData.append('file', file);
  data.oss = data.oss || 'qiniu';
  data.folder = data.folder || 'file';
  data.materialState = data.materialState || -2;
  data.quality = 80;
  Object.entries(data).forEach(([k, v]) => {
    formData.append(k, v);
  });
  const controller = new AbortController();
  return {
    controller,
    request: axios.post(action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: controller.signal,
    }),
  };
};
export default null;
