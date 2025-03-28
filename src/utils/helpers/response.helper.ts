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
): { take?: number; skip?: number; orderBy?: any } => {
  return {
    ...(query?.direction && {
      orderBy: {
        [query?.orderBy || "createdAt"]: query?.direction,
      },
    }),
    ...(query?.page &&
      query?.limit && {
        skip: (+query?.page - 1) * parseInt(query?.limit),
        take: parseInt(query?.limit),
      }),
  };
};
