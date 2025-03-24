import { PrismaClient } from "@prisma/client";
import * as PrismaService from "../prisma";
import { ICreateFieldReference } from "./formFieldReference.interface";

export default class FormFieldReferenceService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = PrismaService.default;
  }

  async getFieldReferenceByForm(id: number) {
    return this.prisma.formFieldReference.findMany({
      where: {
        formId: id,
      },
      select: {
        id: true,
        identifier: true,
        reference: true,
        formId: true,
        field: { select: { name: true } },
      },
      distinct: "identifier",
    });
  }

  async createFieldReference(body: ICreateFieldReference) {
    return this.prisma.formFieldReference.create({
      data: {
        identifier: body.identifier,
        reference: body.reference,
        formId: body.formId,
        fieldId: body.fieldId,
      },
    });
  }
}
