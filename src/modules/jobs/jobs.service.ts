import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";
import { IFormFieldResponse, IJobFormResponse } from "./jobs.interface";

export default class JobsService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async getFormList(): Promise<IJobFormResponse[]> {
    return await this.prisma.form.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, prefix: true },
      orderBy: {
        prefix: "asc",
      },
    });
  }

  async getSectionsByForm(id: string): Promise<IJobFormResponse[]> {
    return await this.prisma.formSections.findMany({
      where: { deletedAt: null, formId: +id },
      select: { id: true, name: true, prefix: true },
      orderBy: {
        prefix: "asc",
      },
    });
  }

  async getFieldsBySection(id: string): Promise<IFormFieldResponse[]> {
    return await this.prisma.formField.findMany({
      where: { deletedAt: null, formSectionId: id },
      select: {
        id: true,
        name: true,
        mapperName: true,
        orderNumber: true,
        required: true,
        type: true,
      },
      orderBy: {
        orderNumber: "asc",
      },
    });
  }
}
