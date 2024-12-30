export interface ICreateCategoryResponse {
  name: string;
  fieldId: string;
}

export interface IResponseCreate {
  name: string;
  value: string;
  categoryId: string;
  isSiteNote: boolean;
  orderNo?: number;
}
