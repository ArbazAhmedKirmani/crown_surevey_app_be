import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";
import { IFormFieldResponse, IJobFormResponse } from "./jobs.interface";
import { connect } from "http2";
import { formField } from "pdfkit";

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

  async getFieldsBySection(
    id: string,
    jobId: string
  ): Promise<IJobFormResponse[]> {
    return await this.prisma.formField.findMany({
      where: { deletedAt: null, formSectionId: id },
      select: {
        id: true,
        name: true,
        prefix: true,
        mapperName: true,
        JobFields: {
          where: { jobId: jobId },
          select: { id: true },
        },
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
        response: true,
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

  async getJobsField(id: any, jobId: string) {
    const result = await this.prisma.jobFields.findMany({
      where: { formFieldId: id, jobId: jobId },
      select: {
        id: true,
        data: true,
      },
    });
    return result?.[0];
  }

  async createJob(data: any) {
    const result = await this.prisma.jobs.create({
      data: {
        name: data.name,
        form: { connect: { id: data.formId } },
      },
      select: { id: true, formId: true },
    });

    return result;
  }

  async createJobDetail(id: any, data: any) {
    const result = await this.prisma.jobFields.upsert({
      where: { id: data.id ?? "abc" },
      update: { data: data.data },
      create: {
        job: { connect: { id: id } },
        formField: { connect: { id: data.fieldId } },
        data: data.data,
      },
    });

    return result;
  }
}
