import { FormFieldType } from "@prisma/client";

export interface IJobFormResponse {
  id: number | string;
  name: string;
  prefix: string;
}

export interface IFormFieldResponse {
  id: string;
  name: string;
  mapperName: string | null;
  orderNumber: number;
  required: boolean;
  type: FormFieldType;
}
