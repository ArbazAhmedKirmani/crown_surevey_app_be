import { PrismaClient } from "@prisma/client";
import * as p_client from "../prisma";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import { ListingQueryData } from "../../utils/helpers/response.helper";
import { IUserListResponse } from "./user.interface";

export default class UserService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = p_client.default;
  }

  async getUsers(query: IQueryListing): Promise<IUserListResponse[]> {
    return await this.prisma.users.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, email: true },
      ...ListingQueryData(query),
    });
  }
}
