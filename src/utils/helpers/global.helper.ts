import bcrypt from "bcrypt";
import { QueryObjectProps } from "../interfaces/helper.interface";
import AppConfig from "../config/app.config";
import sharp from "sharp";
import { PDFDocument, PDFImage } from "pdf-lib";
import APP_CONSTANT from "../constants/global.contant";

const saltRounds = 10;

export const getQueryObject = (query: QueryObjectProps) => ({
  take: Number(query?.limit) || AppConfig.QUERY.TOP,
  skip:
    (Number(query?.page) - 1) * Number(query?.limit) || AppConfig.QUERY.SKIP,
});

export const hashPassword = async (
  myPlaintextPassword: string
): Promise<string> => {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(
      myPlaintextPassword,
      saltRounds,
      function (err: unknown, hash: string) {
        if (err) reject(err);
        resolve(hash);
      }
    );
  });
};

export const comparePassword = (password: string, hash: string) => {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (err: unknown, result: boolean) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export function extractArrays(sentence: string): {
  finalArrays: { identifier: string; array: string[] }[];
  updatedSentence: string;
} {
  const matches = [...sentence.matchAll(APP_CONSTANT.ARRAY_IDENTIFY_PATTERN)];

  let updatedSentence = sentence;

  const finalArrays = matches.map((match, index: number) => {
    let identifier = sentenceIdentifier(index);
    let currentMatch = match[0];
    updatedSentence = updatedSentence.replace(currentMatch, identifier);
    let array = match[1]
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""));
    return { identifier, array };
  });

  return { finalArrays, updatedSentence };
}

export function replaceSelectedItem(
  sentence: string,
  value: { identifier: string; value: string }[]
): string {
  value.forEach((x) => {
    sentence = sentence.replace(x.identifier, x.value);
  });
  return sentence;
}

export const sentenceIdentifier = (index: number): string => {
  return `**${index}**`;
};

/**
 * Provide image converted to (.png) then make a PDF Image
 * @param Image Image
 * @param PDFDocument pdfDoc PDFDocument
 * @returns Promise<PDFImage>
 */
export const getEmbeddedPngImage = async (
  imagePath:
    | Buffer
    | ArrayBuffer
    | Uint8Array
    | Uint8ClampedArray
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | string,
  pdfDoc: PDFDocument
): Promise<PDFImage> => {
  const image = await sharp(imagePath)
    .resize(48, 48) // Adjust width and height
    .toFormat("png") // Convert to PNG
    .toBuffer();

  const pngImage = await pdfDoc.embedPng(image);
  return pngImage;
};
