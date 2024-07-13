export const materialTypeOption = [
  {
    value: 'image',
    label: '图片',
  },
  {
    value: 'video',
    label: '视频',
  },
  {
    value: 'audio',
    label: '音频',
  },
  {
    value: 'file',
    label: '文件',
  },
  {
    value: 'other',
    label: '其他',
  },
];

export const ossTypeOption = [
  {
    value: 'qiniu',
    label: '七牛',
  },
];

// 图片
export const acceptImages: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
];

// 视频
export const acceptVideos: string[] = ['video/mp4', 'video/x-flv', 'video/ogg', 'video/webm'];

// 音频
export const acceptAudios: string[] = ['audio/mpeg', 'audio/ogg'];

// 文档
export const acceptDocs: string[] = [
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/pdf',
  'text/plain',
];

export const acceptTypes: string[] = [
  ...acceptImages,
  ...acceptAudios,
  ...acceptVideos,
  ...acceptDocs,
];

export default null;
