import { FormFieldType, JobStatus } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { IQueryListing } from "../../utils/interfaces/helper.interface";

export interface IFormListResponse {
  id: number | string;
  name: string;
  prefix?: string | null;
}
export interface IJobFormResponse {
  form: {
    id: number;
    FormSections: {
      id: string;
      name: string;
      prefix?: string | null;
    }[];
  };
}

export interface IFormFieldResponse {
  id: string;
  name: string;
  prefix?: string | null;
  mapperName?: string | null;
  orderNumber?: number;
  required?: boolean;
  type?: FormFieldType;
  attachments?: boolean;
  placeholder?: string | null;
  rating?: boolean;
  values?: JsonValue;
}

export interface IGetJobs extends IQueryListing {
  status: JobStatus;
}

export interface IJobCreate {
  name: string;
  formId: number;
  customerId?: string;
  fulfil_date?: string;
}
