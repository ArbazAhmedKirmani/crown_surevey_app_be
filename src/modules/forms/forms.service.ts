import { Request } from "express";
import prisma from "../prisma";
import { getQueryObject } from "../../utils/helpers/global.helper";
import { CreateOptionProps } from "../../utils/interfaces/options.interface";

export default class FormService {
  // async findParentAll(req: Request) {
  //   return await prisma.options.findMany({
  //     where: { deletedAt: null },
  //     ...(req?.query && getQueryObject(req.query!)),
  //   });
  // }
  // async findById(id: number) {
  //   return prisma.options.findUnique({ where: { optionId: id } });
  // }
  // async createOptions(data: CreateOptionProps) {
  //   const result = await prisma.options.create({ data });
  //   return result;
  // }
}
