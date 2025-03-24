import prisma from "../prisma";
import { getQueryObject } from "../../utils/helpers/global.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import {
  IFormCreateDto,
  IFormFieldsCreateDto,
  IFormFieldsUpdateDto,
  IFormSectionDto,
  IFormUpdateDto,
} from "./form.interface";
import AppError from "../../utils/middlewares/app-error.middleware";
import { HttpStatusEnum } from "../../utils/enum/http.enum";
import { FormFieldType, PrismaClient } from "@prisma/client";

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
                prefix: true,
                response: true,
                links: true,
              },
              orderBy: {
                orderNumber: "asc",
              },
            },
          },
          orderBy: { order: "asc" },
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

    for (let i = 0; i < body?.section?.length; i++) {
      const section = body.section[i];
      await this.prisma.formSections.create({
        data: {
          formId: form_result.id,
          name: section.name,
          prefix: section.prefix,
          description: section.description,
          order: +section.order,
          color: section.color,
          ...(section.form_field.length && {
            FormField: {
              createMany: {
                data: section.form_field.map((field) => ({
                  name: field.name,
                  mapperName: field.mapperName,
                  orderNumber: +field.orderNo,
                  type: field.type,
                  required: field.required,
                  placeholder: field.placeholder,
                  rating: field.rating,
                  values: field.values,
                  response: field.reference,
                  prefix: field.prefix,
                  links: field.links,
                })),
              },
            },
          }),
        },
      });
    }
    return form_result;
  }

  async updateForm(id: number, body: IFormCreateDto) {
    const { form_section, new_section, form_fields } = body?.section?.reduce(
      (acc: any, item: IFormSectionDto) => {
        if (item?.id) {
          acc.form_fields = [
            ...acc.form_fields,
            ...item.form_field.map((x) => ({ ...x, formSectionId: item.id })),
          ];
          acc.form_section.push(item);
        } else {
          acc.new_section.push(item);
        }
        return acc;
      },
      { form_section: [], new_section: [], form_fields: [] }
    );

    const { new_fields, old_fields } = form_fields?.reduce(
      (prev: any, curr: IFormFieldsUpdateDto) => {
        if (curr?.id) {
          prev?.old_fields?.push(curr);
        } else {
          prev?.new_fields?.push(curr);
        }
        return prev;
      },
      {
        new_fields: [],
        old_fields: [],
      }
    );

    const updateForm = this.prisma.form.update({
      where: { id: id, deletedAt: null },
      data: {
        ...(body?.form_name && { name: body.form_name }),
        ...(body?.form_prefix && { prefix: body.form_prefix }),
        ...(body?.form_document?.length && {
          documentId: body.form_document?.[0]?.id,
        }),
        ...(body?.form_description && { desc: body.form_description }),
      },
    });

    const createNewSectionAndFields = new_section?.map(
      (section: IFormSectionDto) =>
        this.prisma.formSections.create({
          data: {
            name: section.name,
            order: Number(section.order),
            prefix: section.prefix,
            formId: id,
            description: section.description,
            color: section.color,
            FormField: {
              createMany: {
                data: section.form_field.map((field) => ({
                  name: field.name,
                  orderNumber: Number(field.orderNo),
                  type: field.type,
                  mapperName: field.mapperName,
                  placeholder: field.placeholder,
                  prefix: field.prefix,
                  rating: field.rating,
                  required: field.required,
                  response: field.reference,
                  values: field.values,
                  links: field.links,
                })),
              },
            },
          },
        })
    );

    const updateFormSections =
      form_section?.map((update: IFormSectionDto) =>
        this.prisma.formSections.update({
          where: { id: update.id },
          data: {
            ...(update?.name && { name: update.name }),
            ...(update?.prefix && { prefix: update.prefix }),
            ...(update?.description && { description: update.description }),
            ...(update?.order && { order: update.order }),
            ...(update?.color && { color: update.color }),
          },
        })
      ) || [];

    const createNewFields = this.prisma.formField.createMany({
      data: new_fields?.map((field: IFormFieldsCreateDto) => ({
        name: field?.name,
        mapperName: field?.mapperName,
        orderNumber: Number(field?.orderNo),
        type: field?.type,
        required: field?.required,
        attachments: field?.reference,
        placeholder: field?.placeholder,
        rating: field?.rating,
        values: field?.values,
        prefix: field?.prefix,
        response: field?.reference,
        formSectionId: field?.formSectionId,
        links: field.links,
      })),
    });

    const updateOldFields = old_fields?.map((update: IFormFieldsUpdateDto) =>
      this.prisma.formField.update({
        where: { id: update.id },
        data: {
          required: update?.required,
          rating: update?.rating,
          response: update?.reference,
          ...(update?.name && { name: update.name }),
          ...(update?.prefix && { prefix: update.prefix }),
          ...(update?.type && { type: update.type }),
          ...(update?.mapperName && { mapperName: update.mapperName }),
          ...(update?.orderNo && { orderNumber: Number(update.orderNo) }),
          ...(update?.placeholder && { placeholder: update.placeholder }),
          ...(update?.values && { values: update.values }),
          ...(update?.attachments && { attachments: update.attachments }),
          ...(update?.links && { links: update.links }),
        },
      })
    );

    return await this.prisma.$transaction([
      updateForm,
      ...createNewSectionAndFields,
      ...updateFormSections,
      createNewFields,
      ...updateOldFields,
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
