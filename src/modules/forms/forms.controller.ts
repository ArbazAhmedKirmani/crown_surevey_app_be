import { Request, Response, Router } from "express";
import FormService from "./forms.service";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import { IFormCreateDto } from "./form.interface";
import { generatePdf } from "html-pdf-node-ts";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
// Read HTML Template
const html = fs.readFileSync(
  path.join(__dirname, "../../docs/rhs_level_two-converted.html"),
  "utf8"
);

const options = {
  //   format: "letter",
  height: "841.89mm",
  width: "595.28",
  landscape: false,
  printBackground: true,
  //   path: path.join(__dirname, "../../docs/rhs_level_two-converted.html"),
  displayHeaderFooter: false,
  //   preferCSSPageSize: true,
  //   border: "10mm",
  //   header: {
  //     height: "45mm",
  //     contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
  //   },
  //   footer: {
  //     height: "28mm",
  //     contents: {
  //       first: "Cover page",
  //       2: "Second page", // Any page number is working. 1-based index
  //       default:
  //         '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
  //       last: "Last Page",
  //     },
  //   },
};

const FormController = Router();
const formService = new FormService();

FormController.get(
  "/parent",
  catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await formService.findAllParentForm(req.query);
      res.sendPaginatedSuccess(
        result.data,
        result.count,
        +req.query.limit,
        +req.query.page,
        "Success"
      );
    }
  )
);

FormController.post(
  "/parent",
  catchAsync(async (req: Request<IFormCreateDto>, res: IResponse) => {
    const data = await formService.createParentForm(req.body);
    res.sendSuccess(data, "Successfully Created");
  })
);

FormController.get("/download", async (req: Request, res: Response) => {
  await generatePdf(
    {
      //   content: html,
      url: path.join(__dirname, "../../docs/rhs_level_two-converted.html"),
      //   : "example.pdf",
    },
    options
  ).then((output) => {
    // Set response headers for file download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="document.pdf"',
      "Content-Length": output.length,
    });

    // Send the PDF buffer
    res.send(output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
  });
});

// FormController.get("/child", async (req: Request, res: Response) => {
//   const data = await formService.findParentAll(req);
//   res.status(201).json({ data });
// });

// FormController.post("/child", async (req: Request, res: Response) => {
//   const data = await formService.findById(req.body.formId);
//   res.status(201).json({ data });
// });

export default FormController;
