export interface ISuccessResponse {
  data: Record<any, any>;
  message: string;
  statusCode: number;
  ok: boolean;
}

export interface IQueryListing {
  page?: string;
  limit?: string;
  orderBy?: string;
  direction?: "asc" | "desc";
  search?: string;
}
