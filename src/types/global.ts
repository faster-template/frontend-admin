export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export interface PaginationQuery {
  size: number;
  page: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
}
