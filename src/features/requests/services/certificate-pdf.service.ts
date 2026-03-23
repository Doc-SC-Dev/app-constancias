import { readFileSync } from "node:fs";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";
import { Result } from "@/shared/core/Result";
import { AppError } from "./app-error";

export async function generatePdf(
  body: string,
): Promise<Result<string, AppError>> {
  try {
    const templatePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "templates",
      "template.pdf",
    );
    const robotoPath = path.join(
      process.cwd(),
      "public",
      "assets",
      "fonts",
      "Roboto.ttf",
    );

    const templateBytes = readFileSync(templatePath);
    const robotoBytes = readFileSync(robotoPath);

    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();

    const htmlBody = `<div>${body.replace(/\n/g, "<br/>")}</div>`;

    await page.addStyleTag({
      content: `
        @font-face { font-family: 'Roboto'; src: url('${robotoPath}'); }
        div { font-family: 'Roboto' !important; font-size: 12pt !important; }
      `,
    });
    await page.setContent(htmlBody);

    const parcheBuffer = await page.pdf({
      width: 450,
      height: 400,
      printBackground: false,
      omitBackground: true,
    });
    await browser.close();

    const parcheDoc = await PDFDocument.load(parcheBuffer);
    const [parchePage] = await pdfDoc.copyPages(parcheDoc, [0]);
    const embeddedPage = await pdfDoc.embedPage(parchePage);
    const robotoFont = await pdfDoc.embedFont(robotoBytes);

    const form = pdfDoc.getForm();
    const date = new Date();
    const month = date.toLocaleString("es-CL", { month: "long" });
    const footerField = form.getTextField("footer_field");
    footerField.setFontSize(12);
    footerField.updateAppearances(robotoFont);
    footerField.setText(
      `Temuco, Chile - ${month.at(0)?.toUpperCase()}${month.slice(1)} de ${date.getFullYear()}.`,
    );

    const firstPage = pdfDoc.getPages()[0];
    firstPage.drawPage(embeddedPage, {
      x: 85.68,
      y: 85,
      width: 450,
      height: 400,
      xScale: 1,
      yScale: 1,
    });

    const pdfFinalBytes = await pdfDoc.save();
    return Result.ok(Buffer.from(pdfFinalBytes).toString("base64"));
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    return Result.fail(AppError.internal("Failed to generate PDF document"));
  }
}
