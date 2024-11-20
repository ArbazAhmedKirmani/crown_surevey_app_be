import { FormFieldType } from "@prisma/client";

export type IFiles = {
  id: string;
  url: string;
  originalName?: string;
  name?: string;
};

export interface IFormSectionDto {
  id?: string;
  name: string;
  prefix: string;
  order: number;
  description: string;
  form_fields: IFormFieldsCreateDto[];
}

export interface IFormCreateDto {
  form_name: string;
  form_prefix: string;
  form_document: IFiles[];
  form_description: string;
  form_section: IFormSectionDto[];
}

export interface IFormUpdateDto {
  id?: number;
  form_name: string;
  form_prefix: string;
  form_document: IFiles[];
  form_description: string;
  form_section: IFormSectionDto[];
  form_fields: IFormFieldsUpdateDto[];
}

export interface IFormFieldsCreateDto {
  id?: string;
  name: string;
  mapper: string;
  orderNo: number;
  type: FormFieldType;
  form_document: IFiles[];
  required: boolean;
  rating: boolean;
  attachments: boolean;
  placeholder: string;
  values?: string[];
}

export interface IFormFieldsUpdateDto {
  id: string;
  name?: string;
  mapper: string;
  orderNo?: number;
  type?: FormFieldType;
  required?: boolean;
  rating?: boolean;
  attachments?: boolean;
  placeholder?: string;
  values?: string[];
}
