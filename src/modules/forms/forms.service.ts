import prisma from "../prisma";
import { getQueryObject } from "../../utils/helpers/global.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import { IFormCreateDto, IFormUpdateDto } from "./form.interface";
import AppError from "../../utils/middlewares/app-error.middleware";
import { HttpStatusEnum } from "../../utils/enum/http.enum";
import { PrismaClient } from "@prisma/client";
import { url } from "inspector";

export default class FormService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }
  async findAllForm(query: IQueryListing) {
    const data = await this.prisma.form.findMany({
      where: {
        deletedAt: null,
        ...(query?.search && {
          OR: [
            { name: { contains: query?.search, mode: "insensitive" } },
            { prefix: { contains: query?.search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        prefix: true,
      },
      ...(query && getQueryObject(query)),
      orderBy: {
        createdAt: "desc",
      },
    });

    const count = await this.prisma.form.count({
      where: { deletedAt: null },
    });
    return { data, count };
  }

  async findFormById(id: number) {
    const data = await this.prisma.form.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        document: {
          select: { id: true, originalName: true, url: true },
        },
        desc: true,
        FormSections: {
          select: {
            id: true,
            name: true,
            prefix: true,
            order: true,
            description: true,
            FormField: {
              select: {
                id: true,
                name: true,
                mapperName: true,
                orderNumber: true,
                type: true,
                required: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      throw new AppError("No respective form found", HttpStatusEnum.NOT_FOUND);
    }
    return data;
  }
  async createForm(body: IFormCreateDto) {
    const form_result = await this.prisma.form.create({
      data: {
        name: body.form_name,
        prefix: body.form_prefix,
        documentId: body.form_document?.[0]?.id,
        desc: body.form_description,
      },
    });

    for (let i = 0; i < body.form_section.length; i++) {
      const section = body.form_section[i];
      await this.prisma.formSections.create({
        data: {
          formId: form_result.id,
          name: section.name,
          prefix: section.prefix,
          description: section.description,
          order: +section.order,
          ...(section.form_fields.length && {
            FormField: {
              createMany: {
                data: section.form_fields.map((field) => ({
                  name: field.name,
                  mapperName: field.mapper,
                  orderNumber: +field.orderNo,
                  type: field.type,
                  required: field.isRequired,
                })),
              },
            },
          }),
        },
      });
    }
    return form_result;
  }

  async updateForm(id: number, body: IFormUpdateDto) {
    const form_section = body.form_section;
    const form_fields = body.form_section.flatMap((form) => form.form_fields);

    if (form_section.length)
      await this.prisma.$transaction([
        prisma.form.update({
          where: { id: id, deletedAt: null },
          data: {
            ...(body?.form_name && { name: body.form_name }),
            ...(body?.form_prefix && { prefix: body.form_prefix }),
            ...(body?.form_document.length && {
              documentId: body.form_document?.[0]?.id,
            }),
            ...(body?.form_description && { desc: body.form_description }),
          },
        }),
        ...form_section.map((update) =>
          this.prisma.formSections.update({
            where: { id: update.id },
            data: {
              name: update.name,
              prefix: update.prefix,
              description: update.description,
              order: update.order,
            },
          })
        ),
        ...form_fields.map((field) =>
          this.prisma.formField.update({
            where: { id: field?.id },
            data: {
              name: field?.name,
              mapperName: field?.mapper,
              orderNumber: field?.orderNo,
              type: field?.type,
              required: field?.isRequired,
            },
          })
        ),
      ]);
  }

  async deleteForm(id: number) {
    const sectionData = await this.prisma.form.update({
      where: { id: id },
      data: { deletedAt: new Date(Date.now()) },
      select: { FormSections: { where: { formId: id }, select: { id: true } } },
    });

    const sectionIds = sectionData.FormSections.map((section) => section.id);

    if (sectionIds.length) {
      await this.prisma.formSections.updateMany({
        where: {
          formId: id,
        },
        data: { deletedAt: new Date(Date.now()) },
      });

      await this.prisma.formField.updateMany({
        where: {
          formSectionId: {
            in: sectionIds,
          },
        },
        data: {
          deletedAt: new Date(Date.now()),
        },
      });
    }

    return { form: id, sections: sectionIds };
  }
}
