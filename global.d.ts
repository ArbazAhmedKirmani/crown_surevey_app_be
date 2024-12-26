import ImageModule from "docxtemplater-image-module-free";

const imageModule = new ImageModule({
  getImage: (tagValue: string): Buffer => {
    return Buffer.from(tagValue, "base64"); // Convert base64 string to Buffer
  },
  getSize: (tagValue: string): [number, number] => {
    return [300 * 9525, 200 * 9525]; // Width: 300px, Height: 200px in EMU
  },
});
