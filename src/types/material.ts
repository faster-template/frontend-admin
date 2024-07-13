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
