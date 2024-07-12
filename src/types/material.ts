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

// 限制上传的文件类型

export const acceptImages = [
  // 图片
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
];

export const acceptVideos = [
  // 视频
  'video/mp4',
  'video/x-flv',
  'video/ogg',
  'video/webm',
];

export const acceptAudios = [
  // 音频
  'audio/mpeg',
  'audio/ogg',
];

export const acceptDocs = [
  // 文档
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/pdf',
  'text/plain',
];

export const acceptTypes = [...acceptImages, ...acceptAudios, ...acceptVideos, ...acceptDocs];

export const folderOption = [];

export interface MaterialListItem {
  id: string;
  createTime: string;
  updateTime: string;
  state: 1;
  creatorId: string;
  type: 'image' | 'video' | 'audio' | 'file' | 'other';
  ossType: 'qiniu' | 'other';
  path: string;
  mediaStatus: number;
}
