import { UploadedFile } from "express-fileupload";
import { HttpStatusEnum } from "../../utils/enum/http.enum";
import AppError from "../../utils/middlewares/app-error.middleware";
import prisma from "../prisma";
import path from "path";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { readFileSync, rmSync } from "fs";
import { Response } from "express";

const uploadPath = path.join(__dirname + "../../../public/uploads");

export default class AttachmentsService {
  constructor() {}
  async getAttachment(id: string, res: Response) {
    const result = await prisma.attachments.findUnique({
      where: { id: id, deletedAt: null },
    });

    if (!result) {
      throw new AppError("File Instance not found", HttpStatusEnum.NOT_FOUND);
    }

    const file = readFileSync(
      path.join(__dirname, `../../public`, result.path)
    );

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${result.originalName}"`
    );
    res.send(Buffer.from(file));
  }

  async uploadFile(file: UploadedFile | undefined, res: IResponse) {
    if (!file)
      throw new AppError("No file uploaded", HttpStatusEnum.MISDIRECTED);

    const filename = `${path
      .extname(file.name)
      .replace(".", "")}_${Date.now()}${path.extname(file.name)}`;

    (file as UploadedFile).mv(
      uploadPath.concat(`/${filename}`),
      async function (err) {
        if (err)
          throw new AppError(
            err?.message,
            HttpStatusEnum.INTERNAL_SERVER_ERROR
          );

        const result = await prisma.attachments.create({
          data: {
            name: filename,
            originalName: file.name,
            path: `/uploads/${filename}`,
            url: `http://localhost:3002/api/uploads/${filename}`,
            mimeType: file.mimetype,
            size: file.size,
          },
          select: {
            id: true,
            url: true,
            originalName: true,
          },
        });

        res.sendSuccess(result, "File uploaded successfully");
      }
    );
  }

  async updateAttachment(
    id: string,
    file: UploadedFile | undefined,
    res: IResponse
  ) {
    if (!file)
      throw new AppError("No file uploaded", HttpStatusEnum.MISDIRECTED);

    const data = await prisma.attachments.findUnique({
      where: { id: id, deletedAt: null },
      select: {
        id: true,
        name: true,
        path: true,
      },
    });

    if (!data)
      throw new AppError("No attachment Found", HttpStatusEnum.NOT_FOUND);

    (file as UploadedFile).mv(
      uploadPath.concat(`/${data.name}`),
      async function (err) {
        if (err)
          throw new AppError(
            err?.message,
            HttpStatusEnum.INTERNAL_SERVER_ERROR
          );

        const result = await prisma.attachments.update({
          where: { id: id },
          data: {
            name: data.name,
            originalName: file.name,
            path: `/uploads/${data.name}`,
            url: `http://localhost:3002/api/uploads/${data.name}`,
            mimeType: file.mimetype,
            size: file.size,
          },
          select: {
            id: true,
            url: true,
          },
        });

        res.sendSuccess(result, "File updated successfully");

        rmSync(path.join(__dirname, data.path), { force: true });
      }
    );
  }

  async deleteAttachment(id: string) {
    const data = await prisma.attachments.update({
      where: { id: id, deletedAt: null },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });

    if (!data)
      throw new AppError("No attachment Found", HttpStatusEnum.NOT_FOUND);

    rmSync(path.join(__dirname, data.path), { force: true });
    return data;
  }
}
