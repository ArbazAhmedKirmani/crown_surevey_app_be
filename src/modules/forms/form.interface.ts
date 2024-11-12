import { FormFieldType } from "@prisma/client";

export interface IFormCreateDto {
  form_name: string;
  form_prefix: string;
  form_document: string;
  form_description: string;
  form_fields: IFormFieldsCreateDto[];
}

export interface IFormUpdateDto {
  form_name: string;
  form_prefix: string;
  form_document: string;
  form_description: string;
  form_fields: IFormFieldsUpdateDto[];
}

export interface IFormFieldsCreateDto {
  name: string;
  mapper: string;
  orderNo: number;
  has_attachment: boolean;
  type: FormFieldType;
  isRequired: boolean;
  form_document: number;
}

export interface IFormFieldsUpdateDto {
  id: string;
  name?: string;
  mapper?: string;
  orderNo?: number;
  has_attachment?: boolean;
  type?: FormFieldType;
  isRequired?: boolean;
}
