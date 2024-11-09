import prisma from "../prisma";
import { getQueryObject } from "../../utils/helpers/global.helper";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import { IFormCreateDto } from "./form.interface";

export default class FormService {
  async findAllParentForm(query: IQueryListing) {
    const qo = getQueryObject(query);
    const data = await prisma.parentForm.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        prefix: true,
        ChildForm: {
          select: {
            id: true,
          },
          where: {
            isChild: false,
            deletedAt: null,
          },
        },
      },
      ...(query && getQueryObject(query)),
    });
    const count = await prisma.parentForm.count({
      where: { deletedAt: null },
    });
    return { data, count };
  }
  async createParentForm(body: IFormCreateDto) {
    return prisma.parentForm.create({
      data: {
        name: body.name,
        prefix: body.prefix,
        ChildForm: {
          createMany: { data: body.childForm },
        },
      },
    });
  }
  // async createOptions(data: CreateOptionProps) {
  //   const result = await prisma.options.create({ data });
  //   return result;
  // }
}
