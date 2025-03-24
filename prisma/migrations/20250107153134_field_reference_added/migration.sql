-- CreateTable
CREATE TABLE "FormFieldReference" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "formId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "FormFieldReference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormFieldReference" ADD CONSTRAINT "FormFieldReference_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
