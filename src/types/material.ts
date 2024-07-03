export  const MaterialType = [
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
