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
