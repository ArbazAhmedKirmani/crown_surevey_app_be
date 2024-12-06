import { PrismaClient } from "@prisma/client";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import { getQueryObject } from "../../utils/helpers/global.helper";
import {
  ICreateCategoryResponse,
  IResponseCreate,
} from "./reference.interface";

export default class ReferenceService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllReferences(query: IQueryListing) {
    return await this.prisma.responses.findMany({
      where: {
        deletedAt: null,
        ...(query?.search && {
          OR: [
            { name: { contains: query?.search, mode: "insensitive" } },
            { value: { contains: query?.search, mode: "insensitive" } },
          ],
        }),
        category: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
        name: true,
        value: true,
        isSiteNote: true,
        category: { select: { name: true } },
      },
      ...(query && getQueryObject(query)),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getResponseById(id: string) {
    return await this.prisma.responses.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        value: true,
        categoryId: true,
      },
    });
  }

  async getReferencesByCategory(query: IQueryListing, id: string) {
    return await this.prisma.responses.findMany({
      where: {
        deletedAt: null,
        ...(query?.search && {
          name: { contains: query?.search, mode: "insensitive" },
        }),
        category: { id: id, deletedAt: null },
      },
      select: {
        id: true,
        name: true,
        value: true,
      },
      ...(query && getQueryObject(query)),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCategories() {
    const result = await this.prisma.responseCategory.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return result;
  }

  async getCategoryByFormId(query: IQueryListing, id: string) {
    return await this.prisma.responseCategory.findMany({
      where: {
        deletedAt: null,
        formFields: {
          every: {
            id: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      ...(query && getQueryObject(query)),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createResponseCategory(data: ICreateCategoryResponse) {
    await this.prisma.responseCategory.create({
      data: {
        name: data.name,
      },
    });
  }

  async createResponse(data: IResponseCreate) {
    await this.prisma.responses.create({
      data: {
        name: data.name,
        value: data.value,
        categoryId: data.categoryId,
        isSiteNote: data.isSiteNote,
      },
    });
  }

  async updateResponse(id: string, data: IResponseCreate) {
    await this.prisma.responses.update({
      where: { id: id, deletedAt: null },
      data: {
        name: data.name,
        value: data.value,
        categoryId: data.categoryId,
        isSiteNote: data.isSiteNote,
      },
    });
  }

  async deleteResponse(id: string) {
    await this.prisma.responses.update({
      where: { id: id, deletedAt: null },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });
  }

  async deleteResponseCategory(id: string) {
    await this.prisma.responseCategory.update({
      where: { id: id, deletedAt: null },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });
  }
}
