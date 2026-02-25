import path from "path";
import sharp from "sharp";

async function generate() {
  const bytes = await sharp(path.join(__dirname, "asset", "report-logo.png"))
    .png({ quality: 55 })
    .toBuffer();

  const output = `
  export const logoImage = new Uint8Array([
    ${Array.from(bytes).join(",")}
  ]);
  `;

  console.info(output);
}

generate().catch(console.error);
