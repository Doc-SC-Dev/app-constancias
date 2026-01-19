"use server";

import { readFileSync } from "node:fs";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";
import { AcademicGrade, Gender, type Student } from "@/generated/prisma";
import { auth, isAuthenticated } from "@/lib/auth";
import { Roles } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import {
  Certificates,
  type CreateRequest,
  type Request,
} from "@/lib/types/request";
import type { User } from "@/lib/types/users";
import { withTryCatch } from "../action";

export const logoutAction = async () => {
  console.log("on logout");
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};

export const getRequestsTypes = async () => {
  const session = await isAuthenticated();
  const [certificates, activities] = await Promise.all([
    db.certificate.findMany({
      select: {
        name: true,
        id: true,
      },
    }),
    db.activity.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        name: true,
        id: true,
      },
    }),
  ]);
  return { activities, certificates };
};

export const createRequest = async (data: {
  certificateName: string;
  activity: { id: string; name: string };
}) => {
  const session = await isAuthenticated();
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
        activity: data.activity
          ? {
              connect: {
                id: data.activity.id,
              },
            }
          : {},
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

export const downloadCertificate = async (requestId: string) => {
  await isAuthenticated();

  const request = await db.request.findUnique({
    where: {
      id: requestId,
    },
    include: {
      user: true,
      certificate: true,
      activity: {
        include: {
          participants: {
            include: {
              user: {
                include: {
                  student: true,
                },
              },
              type: true,
            },
          },
          activityType: true,
        },
      },
    },
  });

  if (!request) {
    return {
      success: false,
      message: "Solicitud no encontrada",
    };
  }

  const createRequestData: CreateRequest = {
    certificateName: request.certificate.name,
    activityId: request.activityId ?? undefined,
  };
  const pdf = await createPdf(request.user as User, createRequestData);

  return {
    success: true,
    data: pdf,
  };
};

const getAlumnoRegularText = async (user: User) => {
  const { success, error, data } = await withTryCatch<Student | null>(
    db.student.findUnique({ where: { userId: user.id } }),
  );
  if (error) throw new Error(error);
  if (!success || !data) throw new Error("No se encontro el estudiante");
  return `
  <div style="width: 450px; font-family: 'Roboto'; font-size: 12pt;">
  <strong>PROF. DR. CARLOS MANTEROLA DELGADO</strong><i>, Director del Programa de 
Doctorado en Ciencias Médicas, de la Universidad de La Frontera, deja 
constancia que <strong>${user.gender === Gender.MALE ? "el Sr." : "la Sra."} ${user.name}</strong>, Matrícula Nº <strong>${data.id}</strong>, 
es alumno regular de nuestro programa, desde el año <strong>${data.admisionDate.getFullYear()}</strong> a la fecha. 
</i></div>`;
};

const getActivityTesisProfesorText = async (user: User, activityId: string) => {
  const activity = await db.activity.findUnique({
    where: {
      id: activityId,
    },
    select: {
      name: true,
      activityType: {
        select: {
          name: true,
        },
      },
      participants: {
        select: {
          user: {
            select: {
              name: true,
              gender: true,
              academicGrade: true,
            },
          },
          type: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (!activity) throw new Error("Actividad no pudo ser encontrada");
  const isMale = user.gender === Gender.MALE;
  const isDoctor = user.academicGrade === AcademicGrade.DOCTOR;
  const profesor = activity.participants.find((p) => p.user.name === user.name);
  const tesista = activity.participants.find((p) => p.type.name === "Tesista");
  return `<div style="width: 450px; font-family: 'Roboto'; font-size: 12pt;">
  <strong>PROF. DR. CARLOS MANTEROLA DELGADO</strong>, Director del Programa de Doctorado en 
Ciencias Médicas, de la Universidad de La Frontera, deja constancia que <strong>${isMale ? (isDoctor ? "el Dr. " : "el Sr.") : isDoctor ? "la Dra. " : "la Sra."} ${user.name}</strong>, participa como ${profesor?.type.name} en la ${activity.activityType.name} “${activity.name}” ${tesista?.user.gender === Gender.FEMALE ? "de la" : "del"} estudiante ${tesista?.user.name}.
</div>`;
};

const getActivityTesisStudentText = async (user: User, activityId: string) => {
  const activity = await db.activity.findUnique({
    where: {
      id: activityId,
    },
    select: {
      name: true,
      startAt: true,
      activityType: {
        select: {
          name: true,
        },
      },
      participants: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              gender: true,
              academicGrade: true,
              student: {
                select: {
                  id: true,
                },
              },
            },
          },
          type: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (!activity) throw new Error("Actividad no pudo ser encontrada");
  const isMale = user.gender === Gender.MALE;
  const student = activity.participants.find((p) => p.user.id === user.id);
  const guia = activity.participants.find(
    (p) => p.type.name === "Profesor guia",
  );
  const isDoctor = guia?.user.academicGrade === AcademicGrade.DOCTOR;
  return `<div style="width: 450px; font-family: 'Roboto'; font-size: 12pt;">
<strong>PROF. DR. CARLOS MANTEROLA DELGADO</strong>, Director del Programa de Doctorado en 
Ciencias Médicas, de la Universidad de La Frontera, deja constancia que ${!isMale ? "la estudiante, Sra." : "el estudiante, Sr."} 
${student?.user.name}, matricula Nº ${student?.user.student?.id}, se encuentra realizando su Trabajo 
de título (equivalente a tesis), modalidad proyecto de titulación “${activity.name}” bajo dirección de ${guia?.user.gender === Gender.FEMALE ? `la ${isDoctor ? "Dra." : "Sra."}` : `el ${isDoctor ? "Dr." : "Sr."}`} 
${guia?.user.name}, desde ${activity.startAt.getUTCMonth()} del ${activity.startAt.getFullYear()} a la fecha.
</div>`;
};

// TODO: Implementar mensajes de forma dinamica desde la DB
const getCertificateText = async (user: User, certificate: CreateRequest) => {
  // TODO: Implementar mensajes para el resto de certificados de forma estatica por ahora
  switch (certificate.certificateName) {
    case Certificates.ALUMNO_REGULAR:
      return await getAlumnoRegularText(user);
    case Certificates.TESIS:
      if (user.role === Roles.PROFESSOR)
        return await getActivityTesisProfesorText(
          user,
          certificate.activityId ?? "",
        );
      if (user.role === Roles.STUDENT)
        return await getActivityTesisStudentText(
          user,
          certificate.activityId ?? "",
        );
      return "";
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

  const text = await getCertificateText(user, certificate);
  await page.addStyleTag({
    content: `
    @font-face {
      font-family: 'Roboto';
      src: url('${robotoPath}');
    }
      div {
        font-family: 'Roboto' !important;
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
  const robotoFont = await pdfDoc.embedFont(robotoBytes);

  const form = pdfDoc.getForm();
  const date = new Date();
  const month = date.toLocaleString("es-CL", { month: "long" });
  const footerField = form.getTextField("footer_field");

  footerField.setFontSize(12);
  footerField.updateAppearances(robotoFont);
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
