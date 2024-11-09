import { ListingQueryData } from "../../utils/helpers/response.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import prisma from "../prisma";

export default class SchemaService {
  constructor() {}

  async getAllSchema(query: IQueryListing) {
    const result = await prisma.templateSchema.findMany({
      where: {
        deletedAt: null,
      },
      ...ListingQueryData(query),
    });

    const count = await prisma.templateSchema.count({
      where: {
        deletedAt: null,
      },
    });
    return { result, count };
  }
}
