import { JobStatus } from "@prisma/client";

export interface QueryObjectProps {
  page?: string;
  limit?: string;
  orderBy?: "asc" | "desc";
  search?: string;
}

export interface ISuccessResponse {
  data: Record<any, any>;
  message: string;
  statusCode: number;
  ok: boolean;
}

export interface IQueryListing {
  page: string;
  limit: string;
  orderBy?: "asc" | "desc";
  direction?: "asc" | "desc";
  search?: string;
}

export interface ITemplateJobFields {
  data: any;
  formField: {
    mapperName: string;
  };
}

export interface IJobCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
export interface IGenerateJob {
  id: string;
  name: string | null;
  address: string | null;
  status: JobStatus;
  customer: IJobCustomer | null;
  fulfilDate: Date | null;
  JobFields: ITemplateJobFields[] | null;
  form: {
    document: {
      id: string;
      name: string;
      originalName: string;
      path: string;
      url: string;
      mimeType: string;
      size: number | null;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
    };
  };
}
