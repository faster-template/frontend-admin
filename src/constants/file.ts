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
