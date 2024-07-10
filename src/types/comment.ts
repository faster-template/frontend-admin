import { UserInfo } from './user';

export interface CommentQueryParams {
  relationId: string;
  relationType: string | 'article';
}

export interface CommentCreateBody extends CommentQueryParams {
  content: string;
  parentId?: string;
}

export interface CommentDetail {
  id: string;
  content: string;
  createTime: string;
  creator: UserInfo;
  children: CommentDetail[];
  state?: number;
}
