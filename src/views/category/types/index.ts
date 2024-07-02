export interface ICategory {
  id: string;
  key: string;
  name: string;
  description: string;
  sort: number;
  parentId: string;
  children: ICategory[];
}
