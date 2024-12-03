export interface ICreateCategoryResponse {
  name: string;
}

export interface IResponseCreate {
  name: string;
  value: string;
  categoryId: string;
  isSiteNote: boolean;
}
