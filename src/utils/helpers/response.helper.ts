import {
  IQueryListing,
  ISuccessResponse,
} from "../interfaces/helper.interface";

export function SuccessResponse(
  data: Record<any, any>,
  message: string = "Success",
  statusCode: number = 200
): ISuccessResponse {
  return { data, message, statusCode, ok: true };
}

export const ListingQueryData = (
  query: IQueryListing
): { take: number; skip: number; orderBy: any } => {
  return {
    skip: parseInt(query?.page ?? 0) || 0,
    take: parseInt(query?.limit ?? 0) || 0,
    orderBy: {
      [query?.orderBy || "createdAt"]: query.direction,
    },
  };
};
