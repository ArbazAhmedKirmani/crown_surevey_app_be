-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('TEAM', 'PLAYER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentForm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ParentForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildForm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "isChild" BOOLEAN NOT NULL,
    "childParentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "parentId" INTEGER,

    CONSTRAINT "ChildForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "childFormId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FormTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateSchema" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sentences" (
    "id" SERIAL NOT NULL,
    "sentence" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Sentences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SentencesToTemplateSchema" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_SentencesToTemplateSchema_AB_unique" ON "_SentencesToTemplateSchema"("A", "B");

-- CreateIndex
CREATE INDEX "_SentencesToTemplateSchema_B_index" ON "_SentencesToTemplateSchema"("B");

-- AddForeignKey
ALTER TABLE "ChildForm" ADD CONSTRAINT "ChildForm_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormTemplate" ADD CONSTRAINT "FormTemplate_childFormId_fkey" FOREIGN KEY ("childFormId") REFERENCES "ChildForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSchema" ADD CONSTRAINT "TemplateSchema_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "FormTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SentencesToTemplateSchema" ADD CONSTRAINT "_SentencesToTemplateSchema_A_fkey" FOREIGN KEY ("A") REFERENCES "Sentences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SentencesToTemplateSchema" ADD CONSTRAINT "_SentencesToTemplateSchema_B_fkey" FOREIGN KEY ("B") REFERENCES "TemplateSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
