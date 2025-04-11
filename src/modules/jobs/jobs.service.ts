import { JobStatus, PrismaClient } from "@prisma/client";
import * as p_client from "../prisma";
import {
  ICreateJobResult,
  IFormFieldResponse,
  IFormListResponse,
  IGetJobs,
  IJobCreate,
  IJobFormResponse,
} from "./jobs.interface";
import { getQueryObject } from "../../utils/helpers/global.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import DocumentHandler from "../../utils/helpers/document-handler";

export default class JobsService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = p_client.default;
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
        links: true,
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
        links: true,
        FormFieldReference: {
          select: {
            identifier: true,
          },
        },
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
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { address: { contains: query.search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        form: { select: { name: true, id: true } },
        name: true,
        customer: { select: { id: true, name: true, email: true } },
        address: true,
        fulfilDate: true,
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
        address: true,
        fulfilDate: true,
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
        ...(data?.address && { address: data.address }),
        ...(data?.fulfil_date && { fulfilDate: data.fulfil_date }),
        ...(data?.customerId && {
          customer: { connect: { id: data.customerId } },
        }),
      },
      select: { id: true, formId: true },
    });

    return result;
  }

  async createJobDetail(id: any, data: any): Promise<ICreateJobResult> {
    const result: ICreateJobResult = await this.prisma.jobFields.upsert({
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
      select: {
        job: {
          select: { form: { select: { id: true, name: true } } },
        },
        formField: {
          select: { mapperName: true, name: true },
        },
      },
    });

    this.handleFormIdentifiers(id, data, result);

    return result;
  }

  async updateJobStatus(id: any, data: { status: JobStatus }) {
    const result = await this.prisma.jobs.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: { status: data.status },
      select: { status: true },
    });

    return result;
  }

  async getJobStatus(id: any) {
    const result = await this.prisma.jobs.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: {
        status: true,
      },
    });

    return result;
  }

  async generateJobForm(id: string) {
    const result = await this.prisma.jobs.findUnique({
      where: { id: id, deletedAt: null },
      select: {
        id: true,
        name: true,
        address: true,
        status: true,
        customer: true,
        fulfilDate: true,
        form: {
          select: {
            document: true,
          },
        },
        JobFields: {
          select: {
            data: true,
            formField: {
              select: {
                mapperName: true,
                type: true,
                values: true,
              },
            },
          },
        },
      },
    });

    const documentHandler = new DocumentHandler(
      result?.JobFields!,
      result?.form.document.url!
    );
    return documentHandler.generateDocument();
  }

  async getFieldsLookup(query: IQueryListing) {
    return this.prisma.formField.findMany({
      where: {
        deletedAt: null,
        ...(query?.search && {
          name: { contains: query.search, mode: "insensitive" },
        }),
      },
      select: { id: true, name: true },
    });
  }

  async getFieldsByForm(formId: number) {
    return this.prisma.formField.findMany({
      where: {
        deletedAt: null,
        formSection: {
          formId: formId,
        },
      },
      select: { id: true, name: true },
    });
  }

  async jobSectionFieldList(id: string) {
    const result = await this.prisma.jobs.findUnique({
      where: { id: id, deletedAt: null },
      select: {
        id: true,
        form: {
          select: {
            FormSections: {
              select: {
                id: true,
                name: true,
                prefix: true,
                FormField: {
                  select: {
                    id: true,
                    name: true,
                    prefix: true,
                    JobFields: {
                      where: { jobId: id },
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return result;
  }

  async getJobPreview(id: string) {
    const result = await this.prisma.jobs.findUnique({
      where: { id: id, deletedAt: null },
      select: {
        form: {
          select: {
            id: true,
            name: true,
            FormSections: {
              select: {
                id: true,
                name: true,
                prefix: true,
                order: true,
                FormField: {
                  select: {
                    id: true,
                    name: true,
                    mapperName: true,
                    orderNumber: true,
                    JobFields: {
                      where: {
                        jobId: id,
                      },
                      select: {
                        data: true,
                      },
                    },
                  },
                  orderBy: {
                    orderNumber: "asc",
                  },
                },
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    return result;
  }

  private async handleFormIdentifiers(
    id: any,
    data: any,
    result: ICreateJobResult
  ) {
    const identifiers = await this.prisma.formFieldReference.findMany({
      where: {
        formId: result.job.form.id,
        NOT: {
          fieldId: null,
        },
      },
      select: {
        id: true,
        identifier: true,
        reference: true,
        field: {
          select: {
            id: true,
            mapperName: true,
          },
        },
      },
    });

    if (identifiers.length) {
      identifiers.forEach(async (identifier) => {
        if (data?.data?.[result.formField.mapperName] === "") {
        }
        if (
          data?.data?.[result.formField.mapperName]?.includes(
            identifier.identifier
          )
        ) {
          const fieldIdentifier: any = await this.prisma.jobFields.findFirst({
            where: {
              jobId: id,
              formFieldId: identifier.field?.id!,
            },
            select: {
              id: true,
              data: true,
            },
          });
          if (!fieldIdentifier) {
            await this.prisma.jobFields.create({
              data: {
                job: { connect: { id: id } },
                formField: { connect: { id: identifier.field?.id! } },
                data: {
                  [identifier.field?.mapperName!]: [
                    identifier.reference.concat(" ", result.formField.name),
                  ],
                },
              },
            });
          } else {
            if (
              !fieldIdentifier?.data?.[identifier.field?.mapperName!].includes(
                identifier.reference + " " + result.formField.name
              )
            ) {
              const obj: any = fieldIdentifier.data;
              obj.push(identifier.reference.concat(" ", result.formField.name));
              await this.prisma.jobFields.update({
                where: { id: fieldIdentifier.id },
                data: {
                  data: obj,
                },
              });
            }
          }
        }
      });
    }
  }
}
