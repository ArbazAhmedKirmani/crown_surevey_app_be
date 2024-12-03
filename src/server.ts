require("dotenv").config();

import { Application } from "express";
import ProtectedRoutes from "./routes/protected.routes";
import UnprotectedRoutes from "./routes/unprotected.routes";
import errorHandler from "./utils/middlewares/error-handler.middleware";
import { responseEnhancer } from "./utils/middlewares/response-enhancer.middleware";
import express from "express";
import cors from "cors";
import path from "path";
import fileUpload from "express-fileupload";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import {
  extractArrays,
  getEmbeddedPngImage,
  replaceSelectedItem,
} from "./utils/helpers/global.helper";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { fileAnalyser } from "./utils/helpers/file-analyser.helper";
import { generatePdf } from "html-pdf-node-ts";

const app: Application = express();
const PORT = process.env.APP_PORT || 5000;

const corsOptions = {
  origin: "*",
  //http://localhost:5173", // Allow requests only from example.com
  // methods: "GET,POST",            // Allow GET and POST methods
  // allowedHeaders: "Content-Type,Authorization", // Allowed headers
  // credentials: true, // Allow credentials (cookies, authorization headers)
};

// Use middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(express.static(path.join(__dirname, "./public")));
app.use("docs", express.static(path.join(__dirname, "./docs")));

app.use(responseEnhancer);

// API Routes
app.use("/api", ProtectedRoutes);
app.use("/auth", UnprotectedRoutes);

app.use(errorHandler);

app.get("/generate-pdf", async (req, res) => {
  const existingPdfBytes = fs.readFileSync(
    path.join(__dirname, "/docs/rhs_level_two.pdf")
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  const joiner_finishes_image = form.getTextField("Text52");

  joiner_finishes_image.setImage(
    await getEmbeddedPngImage(
      path.join(__dirname, "/public/images/R.jpeg"),
      pdfDoc
    )
  );

  const surveyor_name = form.getTextField("Text2");
  const surveyor_ric_number = form.getTextField("Text3");
  const ground = form.getTextField("Text31");
  const local_environment = form.getTextField("Text34");
  const related_party_disclosure = form.getTextField("Text7");
  const sentence =
    "This is so much ['important', 'Superb', 'Fantastic', 'Negotiable'] and ['Critical', 'Urgent'] from our home Earth.";
  const arrays = extractArrays(sentence);
  const selectedItem = arrays.finalArrays.map((x) => ({
    identifier: x.identifier,
    value: x.array[0],
  }));

  // Get new sentence after replacement
  const newSentence = replaceSelectedItem(arrays.updatedSentence, selectedItem);
  ground.setText(newSentence);
  surveyor_name.setText("John Doe");
  surveyor_ric_number.setText("1023658");
  related_party_disclosure.setText(
    "related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosurerelated_party_disclosure related_party_disclosure"
  );
  local_environment.setText(
    "local_environment local_environment local_environment local_environment  local_environment local_environment related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosure related_party_disclosurerelated_party_disclosure related_party_disclosure"
  );
  const pdfBytes = await pdfDoc.save();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="rhs_level_two.pdf"');
  res.send(Buffer.from(pdfBytes));
});

app.get("/generate-word", async (req, res) => {
  fileAnalyser("../../public/docs/RICS-L3.docx").then((result) => {
    console.log("Form Fields:", result?.formFields || []);
    console.log("Tables:", result?.tables || []);
    console.log("Tables:", result?.fieldInfo || []);
  });

  // const docxTemplate = fs.readFileSync(
  //   path.join(__dirname, "./docs/Hello.docx"),
  //   "binary"
  // );

  // Load the DOCX file into Pizzip
  // const zip = new PizZip(docxTemplate);
  // const documentXml = zip.file("word/document.xml")?.asText();
  // Create an instance of Docxtemplater with the loaded DOCX template
  // console.log(documentXml);

  // const doc = new Docxtemplater(zip);

  // Set dummy data (we'll use placeholders to extract keys)
  // const replaceCheckbox = (isChecked: boolean) => {
  //   return isChecked ? "☒" : "☐"; // Checked or unchecked box
  // };
  // doc.setData({
  //   name: "John Doe 3",
  //   year: "30",
  //   agree: "abcdefgh",
  //   male: true, // For checkbox field "male"
  //   female: true, // For checkbox field "female"
  // });

  //   {
  //   title: "dummy value", // Add dummy data for all placeholders
  //   date: "dummy value",
  //   // table: [
  //   //   { field1: "dummy value", field2: "2 dummy" },
  //   //   { field1: "dummy value", field2: "2 dummy" },
  //   // ], // Add more fields if needed
  // });

  // try {
  //   doc.render();
  // } catch (error) {
  //   console.error("Error rendering template:", error);
  // }

  // After rendering, we can inspect the template's data
  // const placeholders = Object.keys(doc.);

  // Log the extracted placeholders
  // console.log("Extracted Placeholders:", placeholders);

  // Generate the filled-in document as a buffer
  // const buf = doc.getZip().generate({ type: "nodebuffer" });

  // // Save the filled document to a new file
  // fs.writeFileSync(path.join(__dirname, "/output.docx"), buf);
  res.send("File generated: output.docx");
});

app.get("/generate-docx", async (req, res) => {
  try {
    // Load the Word template file
    const content = fs.readFileSync(
      path.join(__dirname, "./public/docs/RICS-L3.docx"),
      "binary"
    );
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Set field values
    doc.setData({
      dateOfInspection: "12/12/2024",
      reportReferenceNumber: "10235654",
    });

    // Render the document (replaces placeholders)
    doc.render();

    // Write the output file
    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(
      path.join(__dirname, `./public/uploads/RICS-L3${Date.now()}.docx`),
      buffer
    );
    console.log("Document fields filled successfully!");
    res.send("File generated: output.docx");
  } catch (error) {
    console.error("Error processing document:", error);
    res.errored;
    res.send();
  }
});

app.get("/generate-custom-pdf", async (req, res) => {
  // Path to your HTML file
  const htmlFilePath = path.join(__dirname, "./public/docs/form_html.html");

  try {
    const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // PDF generation options
    const options = {
      format: "A4" as "A4", // Set the PDF format (e.g., A4, Letter)
      printBackground: true, // Include background graphics
    };

    // Create a PDF from the HTML content
    const file = { content: htmlContent }; // Pass the HTML content as an object
    const pdfBuffer = await generatePdf(file, options);

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated.pdf"'
    );

    // Send the PDF buffer to the client
    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
