import { appendFileSync, readFileSync, writeFileSync } from "fs";
import puppeteer from "puppeteer";
import path, { join } from "path";
import { IGenerateJob } from "../interfaces/helper.interface";
import { FormFieldType } from "@prisma/client";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import mammoth from "mammoth";
import { XMLParser } from "fast-xml-parser";

export async function convertUrlToBase64(imageUrl: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      response.arrayBuffer().then((buffer) => {
        // Get raw binary data
        const base64 = Buffer.from(buffer).toString("base64"); // Convert to Base64
        // const mimeType = response.headers.get("content-type"); // Get MIME type

        resolve(base64);
      });
    } catch (error: unknown) {
      console.error(`Error converting image URL to Base64: ${error}`);
      //   reject(error);
    }
  });
}

export async function generatePdfBuffer(
  htmlFilePath: string,
  data: IGenerateJob | null
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = readFileSync(htmlFilePath, "utf-8");
  const content = await insertDataInTemplate(htmlContent, data);

  await page.setContent(content, { waitUntil: "networkidle0" });

  // Evaluate the content height and calculate breaks
  const pageHeight = 1122; // A4 height in pixels at 96 DPI
  await page.evaluate((pageHeight) => {
    const elements = document.querySelectorAll(".page");

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const remainingSpace = pageHeight - (rect.bottom % pageHeight);

      if (remainingSpace < 150) {
        // Insert a forced page break if remaining space is less than 50px
        const breakElement = document.createElement("div");
        breakElement.style.pageBreakBefore = "always";
        element?.parentNode?.insertBefore?.(breakElement, element);
      }
    });
  }, pageHeight);

  //   await page.setDefaultTimeout(3000);
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "28mm",
      bottom: "28mm",
      left: "20mm",
      right: "20mm",
    },
    displayHeaderFooter: true,
    headerTemplate: `
            <div style="height:70px; width: 100%; text-align: center; font-size: 12px; color: #555;">
                <span>RICS Home Survey – Level 3</span>
            </div>
        `,
    footerTemplate: `
            <div style="height:70px; width: 85%; float: right; margin-right: 0px; text-align: center; font-size: 12px; color: #555;display:flex;justify-content:space-between; align-items:center; padding:0 10px 0 40px; border-top: 2px solid lightgray; font-size: 14px">
            <span>RICS Home Survey – Level 3</span>    
            <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
                <script>
                    if (document.querySelector('.pageNumber').textContent == '1') {
                        document.querySelector('.pageNumber').parentElement.style.display = 'none';
                    }
                </script>
            </div>
        `,
    printBackground: true,
  });

  await browser.close();

  const fileSavePath = path.join(__dirname, "../../public/docs/new_pdf.pdf");
  writeFileSync(fileSavePath, pdfBuffer);
  return pdfBuffer;
}

/**
 * Insert data into the HTML template
 * @param {string} template - The HTML template
 * @param {IGenerateJob | null} data - The dynamic data to insert
 * @returns {Promise<string>} - The updated HTML content
 */
async function insertDataInTemplate(
  template: string,
  data: IGenerateJob | null
): Promise<string> {
  let temp = template;

  if (data?.JobFields) {
    for (const field of data.JobFields) {
      if (field?.data) {
        let value = field.data[field?.formField?.mapperName];

        if (field.formField.type === FormFieldType.TABLE_ELEMENT) {
          const rows = value?.map?.((x: any) =>
            field?.formField?.values
              ?.map((y: string) => `<td>${x?.[y]}</td>`)
              ?.join("")
          );
          value = rows?.map((x: string) => `<tr>${x}</tr>`)?.join("");
        }

        temp = temp.replace(`{{${field.formField.mapperName}}}`, value ?? "");

        /** Replace function for Images */
        if (field.data?.["field_attachments"]) {
          const images = await Promise.all(
            field.data["field_attachments"].map(async (attachment: any) => {
              const base64Image = await convertUrlToBase64(attachment.url);
              return `<img src="${base64Image}" height="180px" width="auto" loading="eager" />`;
            })
          );

          temp = temp.replace(
            `{{${field.formField.mapperName}_field_attachments}}`,
            images.join(" ")
          );
        } else {
          temp.replace(
            `{{${field.formField.mapperName}_field_attachments}`,
            ""
          );
        }
        /** \ Replace function for Images */
      }
    }
  }

  return temp;
}

// export async function generateWordFile(
//   inputFilePath: string,
//   data: IGenerateJob | null
// ) {
//   const content = readFileSync(
//     path.join(__dirname, "../../public/docs/RICS-L3.docx"),
//     "binary"
//   );

//   // Load the file into PizZip
//   const zip = new PizZip(content);

//   // Initialize Docxtemplater
//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true,
//   });
//   let _data: any = {};
//   if (data?.JobFields) {
//     _data["address"] = data.address;
//     _data["customer_name"] = data.customer?.name;
//     if (data?.fulfilDate) _data["fulfil_date"] = new Date(data.fulfilDate);
//     // _data["fulfil_date"] = data.;
//     // _data["address"] = data.address;
//     for (const field of data?.JobFields) {
//       if (field.formField.type === "CHECKBOX") {
//         const val = field.data[field?.formField?.mapperName];
//         val?.forEach((x: string) => {
//           _data[`${field.formField.mapperName}_${x}`] = "✓";
//         });
//         field.formField?.values?.forEach((x: string) => {
//           if (!val?.includes(x))
//             _data[`${field.formField.mapperName}_${x}`] = "";
//         });
//       } else if (field.formField.type === "RADIO") {
//         const val = field.data[field?.formField?.mapperName];
//         _data[`${field.formField.mapperName}_${val}`] = "✓";
//         field.formField?.values?.forEach((x: string) => {
//           if (x !== val) _data[`${field.formField.mapperName}_${x}`] = "";
//         });
//       } else if (field.formField.type === "ACCOMODATION") {
//         const val = field.data;
//         delete val[field.formField.mapperName];
//         delete val["id"];
//         _data = { ..._data, ...val };
//       } else
//         _data[field.formField.mapperName] =
//           field.data[field?.formField?.mapperName];

//       //   if (field.data?.["field_attachments"]) {
//       //     let img_arr = [];
//       //     for (const att of field.data?.["field_attachments"]) {
//       //       const img_str = await convertUrlToBase64(att.url);
//       //       img_arr.push(img_str);
//       //     }
//       //     _data[`${field.formField.mapperName}_field_attachments`] = img_arr;
//       //   }
//     }
//   }

//   try {
//     // Set the data to replace placeholders
//     doc.render(_data);

//     // Save the modified document
//     const buf = doc.getZip().generate({ type: "nodebuffer" });
//     return buf;
//   } catch (error) {
//     console.error("Error filling form fields:", error);
//   }
// }
export async function generateWordFile(
  inputFilePath: string,
  data: IGenerateJob | null
) {
  try {
    const content = readFileSync(inputFilePath, "binary");
    const zip = new PizZip(content);

    // Read document.xml and relationships XML
    let docXml = zip.file("word/document.xml")?.asText();
    let relsXml = zip.file("word/_rels/document.xml.rels")?.asText();
    const mediaFolder = "word/media/";

    if (!docXml || !relsXml) {
      throw new Error(
        "Required XML files (document.xml or rels.xml) not found."
      );
    }

    let imageIndex = 1;

    // Placeholder map
    const textPlaceholders: Record<string, string> = {};

    // Process data to populate placeholders
    if (data?.JobFields) {
      textPlaceholders["address"] = escapeXml(data.address || "");
      textPlaceholders["customer_name"] = escapeXml(data.customer?.name || "");
      textPlaceholders["fulfil_date"] = escapeXml(
        data.fulfilDate ? new Date(data.fulfilDate).toLocaleDateString() : ""
      );

      for (const field of data.JobFields) {
        if (field.formField.type === "CHECKBOX") {
          const val = field.data[field.formField.mapperName];
          val?.forEach((x: string) => {
            textPlaceholders[`${field.formField.mapperName}_${x}`] = "✓";
          });
          field.formField?.values?.forEach((x: string) => {
            if (!val?.includes(x)) {
              textPlaceholders[`${field.formField.mapperName}_${x}`] = "";
            }
          });
        } else if (field.formField.type === "RADIO") {
          const val = field.data[field.formField.mapperName];
          textPlaceholders[`${field.formField.mapperName}_${val}`] = "✓";
          field.formField?.values?.forEach((x: string) => {
            if (x !== val) {
              textPlaceholders[`${field.formField.mapperName}_${x}`] = "";
            }
          });
        } else {
          textPlaceholders[field.formField.mapperName] = escapeXml(
            field.data[field.formField.mapperName] || ""
          );
        }

        // Handle images
        // if (field.data?.field_attachments) {
        //   for (const attachment of field.data.field_attachments) {
        //     const base64Image = await convertUrlToBase64(attachment.url);
        //     const imageFileName = `image${imageIndex}.png`;

        //     // Add the image to the ZIP
        //     zip.file(`${mediaFolder}${imageFileName}`, base64Image, {
        //       base64: true,
        //     });

        //     // Add a valid <Relationship> entry
        //     const newRelId = `rId${100 + imageIndex}`;
        //     const imageRel = `
        //       <Relationship Id="${newRelId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${imageFileName}"/>`;
        //     relsXml = relsXml?.replace(
        //       "</Relationships>",
        //       `${imageRel}</Relationships>`
        //     );

        //     // Insert the image XML into the docXml
        //     const imageXml = `
        //       <w:p>
        //         <w:r>
        //           <w:drawing>
        //             <wp:inline>
        //               <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        //                 <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
        //                   <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
        //                     <pic:blipFill>
        //                       <a:blip r:embed="${newRelId}" />
        //                     </pic:blipFill>
        //                   </pic:pic>
        //                 </a:graphicData>
        //               </a:graphic>
        //             </wp:inline>
        //           </w:drawing>
        //         </w:r>
        //       </w:p>`;
        //     const replacementIdentifier = `{${field.formField.mapperName}_field_attachments}`;
        //     docXml = docXml?.replace(replacementIdentifier, imageXml);
        //     imageIndex++;
        //   }
        // }
      }
    }

    // Replace placeholders in the document XML
    for (const [key, value] of Object.entries(textPlaceholders)) {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      // if (docXml.includes(regex)) {
      docXml = docXml?.replace(`{${key}}`, value);
      // }
    }

    // Validate the updated XML
    const parser = new XMLParser();
    try {
      parser.parse(docXml); // Validate docXml
    } catch (error) {
      console.error("Invalid XML structure:", error);
      throw new Error("Generated XML is malformed.");
    }

    // Update the document and relationships XML in the ZIP
    zip.file("word/document.xml", docXml);
    zip.file("word/_rels/document.xml.rels", relsXml);

    // Generate the modified DOCX file
    const updatedContent = zip.generate({ type: "nodebuffer" });
    return updatedContent;
  } catch (error) {
    console.error("Error generating Word file:", error);
    throw new Error("Failed to generate Word file.");
  }
}
const convertWordToHtml = async (content: Buffer) => {
  const result = await mammoth.convertToHtml({ buffer: content });
  return result.value;
};

const convertHtmlToPdf = async (html: string): Promise<Uint8Array> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const buff = await page.pdf({ format: "A4" });
  await browser.close();
  return buff;
};

function logDocXmlToFile(docXml: string, fileName: string = "docXmlLog.txt") {
  const logPath = join(__dirname, "../../public/" + fileName);
  try {
    appendFileSync(
      logPath,
      `\n\n\n--- Log at ${new Date().toISOString()} ---\n\n\n${docXml}`,
      { encoding: "utf-8" }
    );
    console.log(`Appended docXml to file: ${logPath}`);
  } catch (error) {
    console.error("Error logging docXml to file:", error);
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
