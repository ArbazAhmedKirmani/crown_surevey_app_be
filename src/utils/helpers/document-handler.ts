import { $Enums, FormFieldType, Prisma } from "@prisma/client";
import axios from "axios";
import https from "https";

interface IDocumentData {
  textReplacements: {
    placeholder: string;
    value: string;
  }[];
  imageReplacements: {
    placeholder: string;
    imageUrl: string;
    width: number;
    height: number;
  }[];
  tableReplacements: {
    placeholder: string;
    rows: string;
  }[];
  documentUrl?: string;
}

interface IJobFields {
  data: Prisma.JsonValue;
  formField: {
    type: $Enums.FormFieldType;
    values: Prisma.JsonValue;
    mapperName: string;
  };
}

const DocumentDataInitialValue = {
  textReplacements: [],
  imageReplacements: [],
  tableReplacements: [],
};

export default class DocumentHandler {
  private documentData: IDocumentData = DocumentDataInitialValue;

  constructor(JobFields: IJobFields[], docFileUrl: string) {
    this.documentData = this.documentDataMapper(JobFields);
    this.documentData["documentUrl"] = `${process.env.APP_URL}${docFileUrl}`;
  }

  async generateDocument(): Promise<Buffer[]> {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Remove this line in production
    });
    console.log("this.documentData: ", this.documentData);
    return await axios.post(
      process.env.DOCUMENT_EDITOR_URL!,
      this.documentData,
      {
        httpsAgent,
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  private documentDataMapper(fields: IJobFields[]): IDocumentData {
    return fields?.reduce((prev: any, accu: any) => {
      const prevState = { ...prev };
      if (accu.data?.field_attachments?.length)
        prevState["imageReplacements"] = [
          ...prevState?.["imageReplacements"],
          {
            placeholder: `${accu.formField.mapperName}_field_attachments`,
            imageUrl: accu.data?.field_attachments?.map((x: any) => x.url),
            width: 20,
            height: 20,
          },
        ];

      switch (accu.formField.type) {
        case FormFieldType.TABLE_ELEMENT:
          prevState["tableReplacements"] = [
            ...prev?.["tableReplacements"],
            {
              placeholder: accu.formField.mapperName,
              value: accu?.data?.[accu.formField.mapperName] ?? [],
            },
          ];
          break;
        case FormFieldType.CHECKBOX:
        case FormFieldType.RADIO:
          prevState["textReplacements"] = [
            ...prev?.["textReplacements"],
            ...accu.formField.values?.map((x: string) => {
              if (accu?.data?.[accu.formField.mapperName]?.includes(x)) {
                return {
                  placeholder: `${accu.formField.mapperName}_${x}`,
                  value: "+",
                };
              } else {
                return {
                  placeholder: `${accu.formField.mapperName}_${x}`,
                  value: "",
                };
              }
            }),
          ];
          break;
        case FormFieldType.INPUT:
        case FormFieldType.SENTENCE:
        case FormFieldType.TEXTAREA:
        case FormFieldType.DATE:
          prevState["textReplacements"] = [
            ...prev?.["textReplacements"],
            {
              placeholder: accu.formField.mapperName,
              value: accu?.data?.[accu.formField.mapperName] ?? "",
            },
          ];
        default:
          break;
      }

      return prevState;
    }, this.documentData);
  }
}
