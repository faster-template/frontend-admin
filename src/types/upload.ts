export declare type OssOption = 'qiniu' | 'other';
export declare type FolderOption =
  | ''
  | 'avatar'
  | 'banner'
  | 'icon'
  | 'content'
  | 'usercontent'
  | 'video'
  | 'file'
  | 'audio'
  | 'other'
  | 'material';

export interface UploadOption {
  quality?: number; // 压缩图片的质量
  oss?: OssOption; // 上传到 oss
  fileName?: string; // 文件名称,无需后缀
  noRandomFileName?: boolean; // 是否随机文件名称,在fileName不存在时生效
  folder?: FolderOption; // 文件夹路径
  materialState?: 1 | -2;
}
