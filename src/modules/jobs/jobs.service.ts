import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";
import {
  IFormFieldResponse,
  IFormListResponse,
  IGetJobs,
  IJobCreate,
  IJobFormResponse,
} from "./jobs.interface";
import { getQueryObject } from "../../utils/helpers/global.helper";

export default class JobsService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async getFormList(): Promise<IFormListResponse[]> {
    return await this.prisma.form.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, prefix: true },
      orderBy: {
        prefix: "asc",
      },
    });
  }

  async getSectionsByForm(id: string): Promise<IJobFormResponse | null> {
    return await this.prisma.jobs.findUnique({
      where: { deletedAt: null, id: id },
      select: {
        form: {
          select: {
            id: true,
            FormSections: {
              select: {
                id: true,
                name: true,
                prefix: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }

  async getFieldsBySection(
    id: string,
    jobId: string
  ): Promise<IFormListResponse[]> {
    return await this.prisma.formField.findMany({
      where: { deletedAt: null, formSectionId: id },
      select: {
        id: true,
        name: true,
        prefix: true,
        mapperName: true,
        JobFields: {
          select: {
            id: true,
          },
          where: {
            jobId: jobId,
          },
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

  async getJob(query: IGetJobs) {
    const data = await this.prisma.jobs.findMany({
      where: {
        ...(query.status && { status: query.status }),
        ...(query.search && {
          name: { contains: query.search, mode: "insensitive" },
        }),
      },
      select: {
        id: true,
        form: { select: { name: true, id: true } },
        name: true,
        customer: { select: { id: true, name: true, email: true } },
      },
      ...(query && getQueryObject(query)),
      orderBy: {
        createdAt: "desc",
      },
    });

    const count = await this.prisma.jobs.count({
      where: {
        ...(query.status && { status: query.status }),
        ...(query.search && {
          name: { contains: query.search, mode: "insensitive" },
        }),
      },
    });

    return { data, count };
  }

  async getJobById(id: string) {
    const data = await this.prisma.jobs.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        form: { select: { name: true, id: true } },
        name: true,
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    return data;
  }

  async createJob(data: IJobCreate) {
    const result = await this.prisma.jobs.create({
      data: {
        name: data.name,
        form: { connect: { id: data.formId } },
        ...(data?.fulfil_date && { fulfilDate: data.fulfil_date }),
        ...(data?.customerId && {
          customer: { connect: { id: data.customerId } },
        }),
      },
      select: { id: true, formId: true },
    });

    return result;
  }

  async createJobDetail(id: any, data: any) {
    const result = await this.prisma.jobFields.upsert({
      where: {
        formFieldId_jobId: {
          formFieldId: data?.fieldId,
          jobId: id,
        },
      },
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
