import prisma from "../prisma";
import { getQueryObject } from "../../utils/helpers/global.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import {
  IFormCreateDto,
  IFormFieldsUpdateDto,
  IFormSectionDto,
  IFormUpdateDto,
} from "./form.interface";
import AppError from "../../utils/middlewares/app-error.middleware";
import { HttpStatusEnum } from "../../utils/enum/http.enum";
import { FormFieldType, PrismaClient } from "@prisma/client";
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
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            prefix: true,
            order: true,
            description: true,
            FormField: {
              where: { deletedAt: null },
              select: {
                id: true,
                name: true,
                mapperName: true,
                orderNumber: true,
                type: true,
                required: true,
                attachments: true,
                placeholder: true,
                rating: true,
                values: true,
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
                  required: field.required,
                  attachments: field.attachments,
                  placeholder: field.placeholder,
                  rating: field.rating,
                  values: field.values,
                })),
              },
            },
          }),
        },
      });
    }
    return form_result;
  }

  async updateForm(id: number, body: any) {
    //IFormUpdateDto) {
    const { form_section, new_section } = body?.form_section?.reduce(
      (acc: any, item: IFormSectionDto) => {
        if (item?.id) {
          acc.form_section.push(item);
        } else {
          acc.new_section.push(item);
        }
        return acc;
      },
      { form_section: [], new_section: [] }
    );

    const update_fields = form_section?.reduce(
      (acc: { sectionId: string; fields: any }, form: IFormSectionDto) => {
        if (form?.form_fields && form?.id)
          acc?.fields?.push({
            sectionId: form.id,
            fields: form.form_fields,
          });
        return acc;
      },
      { fields: [] }
    );

    const formSectionUpdates =
      form_section?.map((update: IFormSectionDto) =>
        this.prisma.formSections.update({
          where: { id: update.id },
          data: {
            ...(update?.name && { name: update.name }),
            ...(update?.prefix && { prefix: update.prefix }),
            ...(update?.description && { description: update.description }),
            ...(update?.order && { order: Number(update.order) }),
          },
        })
      ) || [];

    const newSectionCreations =
      new_section?.map((section: IFormSectionDto) =>
        this.prisma.formSections.create({
          data: {
            formId: id,
            name: section.name,
            prefix: section.prefix,
            description: section.description,
            order: Number(section.order),
            ...(section?.form_fields?.length && {
              FormField: {
                createMany: {
                  data: section.form_fields
                    .filter((x) => x.id === undefined)
                    .map((field) => ({
                      name: field.name,
                      mapperName: field.mapper,
                      orderNumber: Number(field.orderNo),
                      type: field.type,
                      required: field.required,
                      attachments: field.attachments,
                      placeholder: field.placeholder,
                      rating: field.rating,
                      values: field.values,
                    })),
                },
              },
            }),
          },
        })
      ) || [];

    const fieldUpdatesAndCreations =
      update_fields?.fields?.flatMap(
        (field: { sectionId: string; fields: IFormFieldsUpdateDto[] }) =>
          field?.fields?.map((x) => {
            if (x.id) {
              return this.prisma.formField.update({
                where: { id: x.id },
                data: {
                  name: x?.name,
                  mapperName: x?.mapper,
                  orderNumber: Number(x?.orderNo),
                  type: x.type as FormFieldType,
                  required: x?.required,
                  attachments: x?.attachments,
                  placeholder: x?.placeholder,
                  rating: x?.rating,
                  values: x?.values,
                },
              });
            } else {
              return this.prisma.formField.create({
                data: {
                  name: x.name as string,
                  mapperName: x.mapper as string,
                  orderNumber: Number(x.orderNo),
                  type: x.type as FormFieldType,
                  required: x.required as boolean,
                  attachments: x.attachments as boolean,
                  placeholder: x.placeholder as string,
                  rating: x.rating as boolean,
                  values: x.values as string[],
                  formSectionId: field.sectionId as string,
                },
              });
            }
          })
      ) || [];

    return await this.prisma.$transaction([
      this.prisma.form.update({
        where: { id: id, deletedAt: null },
        data: {
          ...(body?.form_name && { name: body.form_name }),
          ...(body?.form_prefix && { prefix: body.form_prefix }),
          ...(body?.form_document?.length && {
            documentId: body.form_document?.[0]?.id,
          }),
          ...(body?.form_description && { desc: body.form_description }),
        },
      }),
      ...formSectionUpdates,
      ...newSectionCreations,
      ...fieldUpdatesAndCreations,
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

  async deleteSection(id: string) {
    await this.prisma.formSections.update({
      where: { id: id },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });
  }

  async deleteField(id: string) {
    await this.prisma.formField.update({
      where: { id: id },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });
  }
}
