require("dotenv").config();

import { Application } from "express";
import ProtectedRoutes from "./routes/protected.routes";
import UnprotectedRoutes from "./routes/unprotected.routes";
import errorHandler from "./utils/middlewares/error-handler.middleware";
import { responseEnhancer } from "./utils/middlewares/response-enhancer.middleware";
import express from "express";
import cors from "cors";
import path from "path";

import fs from "fs";
import { PDFDocument } from "pdf-lib";
import {
  extractArrays,
  getEmbeddedPngImage,
  replaceSelectedItem,
} from "./utils/helpers/global.helper";
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

  // .png()
  // .toBuffer();

  const surveyor_name = form.getTextField("Text2");
  const surveyor_ric_number = form.getTextField("Text3");
  const ground = form.getTextField("Text31");
  const local_environment = form.getTextField("Text34");
  const related_party_disclosure = form.getTextField("Text7");
  // Fill the fields with data
  const sentence =
    "This is so much ['important', 'Superb', 'Fantastic', 'Negotiable'] and ['Critical', 'Urgent'] from our home Earth.";
  const arrays = extractArrays(sentence);
  console.log("arrays: ", arrays);

  // Example user selection
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
