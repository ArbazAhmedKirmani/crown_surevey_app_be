import { FormFieldType } from "@prisma/client";

export type IFiles = {
  id: string;
  url: string;
  originalName?: string;
  name?: string;
};

export interface IFormCreateDto {
  form_name: string;
  form_prefix: string;
  form_document: IFiles[];
  form_description: string;
  form_section: {
    name: string;
    prefix: string;
    order: number;
    description: string;
    form_fields: IFormFieldsCreateDto[];
  }[];
}

export interface IFormUpdateDto {
  form_name: string;
  form_prefix: string;
  form_document: IFiles[];
  form_description: string;
  form_section: {
    id: string;
    name?: string;
    prefix?: string;
    order?: number;
    description?: string;
    form_fields?: IFormFieldsUpdateDto[];
  }[];
  form_fields: IFormFieldsUpdateDto[];
}

export interface IFormFieldsCreateDto {
  name: string;
  mapper: string;
  orderNo: number;
  has_attachment: boolean;
  type: FormFieldType;
  isRequired: boolean;
  form_document: IFiles[];
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
