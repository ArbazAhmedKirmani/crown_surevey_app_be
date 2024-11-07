import { ListingQueryData } from "../../utils/helpers/response.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import prisma from "../prisma";

export default class SchemaService {
  constructor() {}

  async getAllSchema(query: IQueryListing) {
    const result = prisma.templateSchema.findMany({
      where: {
        deletedAt: null,
      },
      ...ListingQueryData(query),
    });

    return result;
  }
}
