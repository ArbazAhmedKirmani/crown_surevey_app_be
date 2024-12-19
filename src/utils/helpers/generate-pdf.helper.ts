import { readFileSync, writeFileSync } from "fs";
import puppeteer from "puppeteer";
import path from "path";
import {
  IGenerateJob,
  ITemplateJobFields,
} from "../interfaces/helper.interface";

export async function convertUrlToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer(); // Get raw binary data
    const base64 = Buffer.from(buffer).toString("base64"); // Convert to Base64
    const mimeType = response.headers.get("content-type"); // Get MIME type

    return `data:${mimeType};base64,${base64}`;
  } catch (error: unknown) {
    console.error(`Error converting image URL to Base64: ${error}`);
    throw error;
  }
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

  //   await page.setDefaultTimeout(3000);
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "80px",
      bottom: "80px",
      left: "20px",
      right: "20px",
    },
    displayHeaderFooter: true,
    headerTemplate: `
            <div style="width: 100%; text-align: center; font-size: 12px; color: #555;">
            </div>
        `,
    footerTemplate: `
            <div style="height:70px; width: 80%; float: right; margin-right: 25px; text-align: center; font-size: 12px; color: #555;display:flex;justify-content:space-between; align-items:center; padding-inline: 40px; border-top: 2px solid lightgray; font-size: 14px">
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
        const value = field.data[field?.formField?.mapperName];
        temp = temp.replace(`{{${field.formField.mapperName}}}`, value ?? "");

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
        }
      }
    }
  }

  return temp;
}
