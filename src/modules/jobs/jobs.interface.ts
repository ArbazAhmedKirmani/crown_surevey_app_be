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
  to: string;
  from: string;
}

export interface IJobCreate {
  name: string;
  formId: number;
  customerId?: string;
  fulfil_date?: string;
  address?: string;
  reference?: string;
}

export interface ICreateJobResult {
  formField: { name: string; mapperName: string };
  job: { form: { id: number; name: string } };
}
