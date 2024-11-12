import prisma from "../prisma";
import { getQueryObject } from "../../utils/helpers/global.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import {
  IFormCreateDto,
  IFormFieldsCreateDto,
  IFormFieldsUpdateDto,
  IFormUpdateDto,
} from "./form.interface";
import AppError from "../../utils/middlewares/app-error.middleware";
import { HttpStatusEnum } from "../../utils/enum/http.enum";

export default class FormService {
  async findAllForm(query: IQueryListing) {
    const qo = getQueryObject(query);
    const data = await prisma.form.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        prefix: true,
      },
      ...(query && getQueryObject(query)),
    });
    const count = await prisma.form.count({
      where: { deletedAt: null },
    });
    return { data, count };
  }

  async findFormById(id: number) {
    const data = await prisma.form.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        documentId: true,
        desc: true,
        FormField: {
          select: {
            id: true,
            name: true,
            mapperName: true,
            orderNumber: true,
            type: true,
            hasAttachment: true,
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
    return prisma.form.create({
      data: {
        name: body.form_name,
        prefix: body.form_prefix,
        documentId: body.form_document,
        desc: body.form_description,
        FormField: {
          createMany: {
            data: body.form_fields.map((field: IFormFieldsCreateDto) => ({
              name: field.name,
              mapperName: field.mapper,
              orderNumber: field.orderNo,
              type: field.type,
              hasAttachment: Boolean(field.has_attachment),
              required: field.isRequired,
            })),
          },
        },
      },
    });
  }
  async updateForm(id: number, body: IFormUpdateDto) {
    return prisma.form.update({
      where: { id: id },
      data: {
        name: body.form_name,
        prefix: body.form_prefix,
        documentId: body.form_document,
        desc: body.form_description,
        FormField: {
          updateMany: {
            where: { id: { notIn: body.form_fields.map((field) => field.id) } },
            data: body.form_fields.map((field: IFormFieldsUpdateDto) => ({
              ...(field?.id && { id: field.id }),
              ...(field?.name && { name: field.name }),
              ...(field?.mapper && { mapperName: field.mapper }),
              ...(field?.orderNo && { orderNumber: field.orderNo }),
              ...(field?.type && { type: field.type }),
              ...(field?.isRequired && { required: field.isRequired }),
              hasAttachment: Boolean(field.has_attachment),
            })),
          },
        },
      },
    });
  }
  // async createOptions(data: CreateOptionProps) {
  //   const result = await prisma.options.create({ data });
  //   return result;
  // }
}
