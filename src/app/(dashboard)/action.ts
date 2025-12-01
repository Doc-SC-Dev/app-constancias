"use server";

import { readFileSync } from "node:fs";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";
import type { Student } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Certificates,
  type CreateRequest,
  type Request,
} from "@/lib/types/request";
import type { Session, User } from "@/lib/types/users";
import { withTryCatch } from "../action";

export const logoutAction = async () => {
  console.log("on logout");
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};

export const getRequestsTypes = async () => {
  return await db.certificate.findMany({
    select: {
      name: true,
      id: true,
    },
  });
};

export const createRequest = async (data: CreateRequest) => {
  const { data: session } = await withTryCatch<Session | null>(
    auth.api.getSession({
      headers: await headers(),
    }),
  );
  if (!session) {
    redirect("/login", RedirectType.replace);
    return { success: false, message: "No estas autenticado" };
  }
  const { user } = session;
  const {
    success,
    error,
    data: request,
  } = await withTryCatch<Request>(
    db.request.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        certificate: {
          connect: {
            name: data.certificateName,
          },
        },
        state: "READY",
      },
    }),
  );

  if (!success) return { success: false, message: error };

  const pdf = await createPdf(user, data);
  revalidatePath("/dashboard/history");
  return {
    success: true,
    message: `Solicitud creada exitosamente con id ${request.id}`,
    data: pdf,
  };
};

const getAlumnoRegularText = async (user: User) => {
  const { success, error, data } = await withTryCatch<Student | null>(
    db.student.findUnique({
      where: {
        userId: user.id,
      },
    }),
  );
  if (error) throw new Error(error);
  if (!success || !data) throw new Error("No se encontro el estudiante");
  return `
  <div style="width: 450px;">
  <strong>PROF. DR. CARLOS MANTEROLA DELGADO</strong><i>, Director del Programa de 
Doctorado en Ciencias Médicas, de la Universidad de La Frontera, deja 
constancia que el <strong>Sr. ${user.name}</strong>, Matrícula Nº <strong>${data.id}</strong>, 
es alumno regular de nuestro programa, desde el año <strong>2023</strong> a la fecha. 
</i></div>`;
};

const getCertificateText = async (user: User, certificate: CreateRequest) => {
  switch (certificate.certificateName) {
    case Certificates.ALUMNO_REGULAR:
      return await getAlumnoRegularText(user);
    default:
      return "";
  }
};

const createPdf = async (user: User, certificate: CreateRequest) => {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "assets",
    "templates",
    "template.pdf",
  );

  const trebuchetPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "fonts",
    "trebuchetms.ttf",
  );

  const templateBytes = readFileSync(templatePath);
  const trebuchetBytes = readFileSync(trebuchetPath);

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

  const text = await getCertificateText(user, certificate);
  await page.addStyleTag({
    content: `@font-face { font-family: 'Trebuchet MS'; src: url('${trebuchetPath}'); }
      div {
        font-family: 'Trebuchet MS' !important;
        font-size: 12pt !important;
      }
      `,
  });
  await page.setContent(text);

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
  const trebuchetFont = await pdfDoc.embedFont(trebuchetBytes);

  const form = pdfDoc.getForm();
  const date = new Date();
  const month = date.toLocaleString("es-CL", { month: "long" });
  const footerField = form.getTextField("footer_field");

  footerField.setFontSize(12);
  footerField.updateAppearances(trebuchetFont);
  footerField.setText(
    `TEMUCO, CHILE - ${month.at(0)?.toUpperCase() + month.slice(1)} de ${date.getFullYear()}.`,
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

  // 4. Retornar el PDF final como Base64 string
  const pdfFinalBytes = await pdfDoc.save();
  return Buffer.from(pdfFinalBytes).toString("base64");
};
