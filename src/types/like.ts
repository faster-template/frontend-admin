export interface LikeQueryParams {
  relationId: string;
  relationType: string | 'article';
}

export interface LikeCreateParams extends LikeQueryParams {
  likeType: string | 'like' | 'dislike';
}
export type LikeDeletearams = LikeQueryParams;
export interface LikeResult {
  likeCount: number;
  dislikeCount: number;
  myLikeType: string | 'like' | 'dislike';
}
