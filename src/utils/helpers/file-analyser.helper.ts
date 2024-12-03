import { readFileSync } from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";
import AdmZip from "adm-zip";

export const fileAnalyser = async (filePath: string) => {
  try {
    // Unzip the Word document
    const docxTemplate = readFileSync(path.join(__dirname, filePath), "binary");
    // const _file = path.resolve(filePath);
    // Load the DOCX file into Pizzip
    const zip = new AdmZip(path.join(__dirname, filePath));
    const documentXml = zip.readAsText("word/document.xml");

    // Parse the XML
    const parsedXml = await parseStringPromise(documentXml);

    // Look for form fields
    const formFields: any[] = [];
    const tables: any[] = [];
    const fieldInfo: any[] = [];
    const body = parsedXml["w:document"]["w:body"][0];

    // Search paragraphs for form fields (w:fldChar or w:field codes)
    body["w:p"]?.forEach((paragraph: any) => {
      paragraph["w:fldChar"]?.forEach((field: any) => {
        const fieldType = field["$"]["w:fldCharType"];
        formFields.push(fieldType);
      });
    });

    // Search for tables
    body["w:tbl"]?.forEach((table: any, tableIndex: number) => {
      // Iterate through tables
      const rows = table["w:tr"] || [];
      rows.forEach((row: any, rowIndex: number) => {
        const cells = row["w:tc"] || [];
        cells.forEach((cell: any, cellIndex: number) => {
          // Check for fields in the cell
          const fields: any[] = [];
          if (cell["w:p"]) {
            cell["w:p"].forEach((paragraph: any) => {
              paragraph["w:fldChar"]?.forEach((field: any) => {
                fields.push(field["$"]["w:fldCharType"]);
              });
              paragraph["w:sdt"]?.forEach((control: any) => {
                fields.push(
                  control["w:sdtPr"]?.[0]?.["w:alias"]?.[0]?.["$"]?.["w:val"]
                );
              });
            });
          }
          if (fields.length > 0) {
            fieldInfo.push({
              table: tableIndex + 1,
              row: rowIndex + 1,
              cell: cellIndex + 1,
              fields,
            });
          }
        });
      });
    });

    return {
      formFields,
      tables,
      fieldInfo,
    };
  } catch (error) {
    console.error("Error analyzing document:", error);
    return null;
  }
};
