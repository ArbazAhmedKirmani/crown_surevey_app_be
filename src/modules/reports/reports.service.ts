import { JobStatus, PrismaClient } from "@prisma/client";

export default class ReportService {
  _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async getAllPendingJob() {
    return this._prisma.jobs.count({
      where: {
        deletedAt: null,
        status: JobStatus.PENDING,
      },
    });
  }

  async getCompletedJobMonthly() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    return await this._prisma.jobs.count({
      where: {
        deletedAt: null,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
        status: JobStatus.COMPLETED,
      },
    });
  }
}
