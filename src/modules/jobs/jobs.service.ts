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

  async getFieldsBySection(id: string): Promise<IJobFormResponse[]> {
    return await this.prisma.formField.findMany({
      where: { deletedAt: null, formSectionId: id },
      select: {
        id: true,
        name: true,
        prefix: true,
      },
      orderBy: {
        orderNumber: "asc",
      },
    });
  }

  async getFieldsById(id: string): Promise<IFormFieldResponse | null> {
    return await this.prisma.formField.findUnique({
      where: { deletedAt: null, id: id },
      select: {
        id: true,
        name: true,
        prefix: true,
        attachments: true,
        mapperName: true,
        required: true,
        type: true,
        orderNumber: true,
        placeholder: true,
        rating: true,
        values: true,
      },
    });
  }

  async getFloorplanById(id: string) {
    return await this.prisma.floorPlan.findUniqueOrThrow({
      where: { id: id },
      select: {
        id: true,
        name: true,
        height: true,
        width: true,
        planData: true,
      },
    });
  }

  async getJobs(data: any) {}
  async createJob(data: any) {}
}
