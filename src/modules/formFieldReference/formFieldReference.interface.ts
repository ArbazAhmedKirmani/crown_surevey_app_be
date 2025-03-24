export interface IGetFieldReference {
  id: number;
  identifier: string;
  reference: string;
  fieldId: string;
}

export interface ICreateFieldReference {
  identifier: string;
  reference: string;
  formId: number;
  fieldId: string;
}
