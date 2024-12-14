import { PrismaClient } from "@prisma/client";
import * as PrismaService from "../prisma";
import { IGetCustomer } from "./customer.interface";
import { getQueryObject } from "../../utils/helpers/global.helper";

export default class CustomerService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = PrismaService.default;
  }

  async getCustomers(query: IGetCustomer) {
    const data = await this.prisma.customers.findMany({
      where: {
        deletedAt: null,
        OR: [{ name: { contains: query?.search, mode: "insensitive" } }],
      },
      select: { id: true, email: true, name: true, phone: true },
      ...(query && getQueryObject(query)),
      orderBy: {
        ...(query?.search ? { name: "asc" } : { createdAt: "desc" }),
      },
    });

    const count = await this.prisma.customers.count({
      where: {
        deletedAt: null,
        OR: [{ name: { contains: query?.search, mode: "insensitive" } }],
      },
    });

    return { data, count };
  }
}
