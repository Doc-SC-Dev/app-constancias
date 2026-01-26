"use server";

import { readFileSync } from "node:fs";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";
import { Gender, Role } from "@/generated/prisma";
import { auth, isAuthenticated } from "@/lib/auth";
import { isAdmin, Roles } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import {
  Certificates,
  type FullRequest,
  type RequestActivity,
  type RequestCertificate,
  type RequestUserWithoutParticipant,
  type RequestUserWithParticipants,
} from "@/lib/types/request";
import { withTryCatch } from "../action";

export const logoutAction = async () => {
  console.log("on logout");
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};

export const getRequestsTypes = async () => {
  const { user } = await isAuthenticated();
  const [certificates, activities] = await Promise.all([
    db.certificate.findMany({
      select: {
        name: true,
        id: true,
        roles: true,
      },
    }),
    db.activity.findMany({
      select: {
        name: true,
        id: true,
        participants: {
          where: isAdmin(user.role as Role) ? {} : { userId: user.id },
          select: {
            userId: true,
          },
        },
      },
    }),
  ]);
  return { activities, certificates };
};

export const getAcademicDegree = async () => {
  const degree = await db.academicDegree.findMany({
    include: {
      title: {
        select: {
          gender: true,
          abbrev: true,
        },
      },
    },
  });

  return degree;
};

export const createRequest = async (data: {
  certificateName: string;
  activityId: string | undefined;
  userId: string;
  description?: string;
}) => {
  const isStandard = data.certificateName !== Certificates.OTHER;
  // TODO: corrigir error de tipo hay corregir el tipo para que acepte el title
  const {
    success,
    error,
    data: request,
  } = await withTryCatch<FullRequest>(
    db.request.create({
      data: {
        user: {
          connect: {
            id: data.userId,
          },
        },
        activity: data.activityId
          ? {
              connect: {
                id: data.activityId,
              },
            }
          : {},
        certificate: {
          connect: {
            name: data.certificateName,
          },
        },
        otherRequest: !isStandard
          ? {
              create: {
                name: data.certificateName,
                description: data.description ?? "",
                userId: data.userId,
              },
            }
          : undefined,
        state: !isStandard ? "PENDING" : "READY",
      },
      select: {
        id: true,
        user: {
          select: {
            academicDegree: {
              select: {
                title: {
                  take: 1,
                  select: {
                    abbrev: true,
                  },
                },
              },
            },
            name: true,
            rut: true,
            gender: true,
            role: true,
            student: {
              select: {
                admisionDate: true,
                studentId: true,
              },
            },
            participants: {
              where: {
                activityId: data.activityId,
              },
              select: {
                type: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        activity: {
          select: {
            name: true,
            startAt: true,
            endAt: true,
            activityType: {
              select: {
                name: true,
              },
            },
            participants: {
              where: {
                userId: { not: data.userId },
              },
              select: {
                user: {
                  select: {
                    name: true,
                    academicDegree: {
                      select: {
                        title: {
                          take: 1,
                          select: {
                            abbrev: true,
                          },
                        },
                      },
                    },
                    gender: true,
                  },
                },
                hours: true,
                type: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        certificate: {
          select: {
            name: true,
          },
        },
      },
    }),
  );

  if (!success) return { success: false, message: error };

  if (isStandard) {
    const pdf = await createPdf(request);
    revalidatePath("/dashboard/history");
    return {
      success: true,
      message: `Solicitud creada exitosamente con id ${request.id}`,
      data: pdf,
    };
  }
  revalidatePath("/dashboard/history");
  return {
    success: true,
    message: `Solicitud creada exitosamente con id ${request.id}`,
    data: null,
  };
};

export const downloadCertificate = async (requestId: string) => {
  await isAuthenticated();

  const response = await db.request.findUnique({
    where: { id: requestId },
    select: {
      userId: true,
      activityId: true,
    },
  });
  const request = await db.request.findUnique({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      user: {
        select: {
          academicDegree: {
            select: {
              title: {
                take: 1,
                select: {
                  abbrev: true,
                },
              },
            },
          },
          name: true,
          rut: true,
          gender: true,
          role: true,
          student: {
            select: {
              admisionDate: true,
              studentId: true,
            },
          },
          participants: response
            ? {
                where: {
                  activityId: response.activityId ?? undefined,
                },
                select: {
                  type: {
                    select: {
                      name: true,
                    },
                  },
                },
              }
            : false,
        },
      },
      activity: {
        select: {
          name: true,
          startAt: true,
          endAt: true,
          activityType: {
            select: {
              name: true,
            },
          },
          participants: {
            where: {
              userId: { not: response?.userId },
            },
            select: {
              user: {
                select: {
                  name: true,
                  academicDegree: {
                    select: {
                      title: {
                        take: 1,
                        select: {
                          abbrev: true,
                        },
                      },
                    },
                  },
                  gender: true,
                },
              },
              hours: true,
              type: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      certificate: {
        select: {
          name: true,
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

  const pdf = await createPdf(request);

  return {
    success: true,
    data: pdf,
  };
};

const getAlumnoRegularText = (user: RequestUserWithoutParticipant) => {
  const { student } = user;
  if (!student) throw new Error("Alumno no encontrado");
  return `
  <div style="width: 450px; font-family: 'Roboto'; font-size: 12pt;">
  <strong>PROF. DR. CARLOS MANTEROLA DELGADO</strong>, Director del Programa de 
Doctorado en Ciencias Médicas, de la Universidad de La Frontera, deja 
constancia que ${user.gender === Gender.MALE ? "el Sr." : "la Sra."} ${user.name}, Matrícula Nº ${student.studentId}, 
es alumno regular de nuestro programa, desde el año ${student.admisionDate.getFullYear()} a la fecha. 
</div>`;
};

const getActivityTesisProfesorText = (
  user: RequestUserWithParticipants,
  activity: RequestActivity,
) => {
  const isMale = user.gender === Gender.MALE;
  const isDoctor = user.academicDegree?.title.at(0);
  const tesista = activity.participants.find((p) => p.type.name === "Tesista");
  return `<div style="width: 450px; font-family: 'Roboto'; font-size: 12pt;">
  <strong>PROF. DR. CARLOS MANTEROLA DELGADO</strong>, Director del Programa de Doctorado en 
Ciencias Médicas, de la Universidad de La Frontera, deja constancia que <strong>${isMale ? `el ${isDoctor}` : `la ${isDoctor}`} ${user.name}</strong>, participa como ${user.participants[0].type.name} en la ${activity.activityType.name} “${activity.name}” ${tesista?.user.gender === Gender.FEMALE ? "de la" : "del"} estudiante ${tesista?.user.name}.
</div>`;
};

const getActivityTesisStudentText = (
  user: RequestUserWithParticipants,
  activity: RequestActivity,
) => {
  const { student } = user;
  if (!student) throw new Error("Estudiante no fue encontrado");
  const isMale = user.gender === Gender.MALE;
  const guia = activity.participants.find(
    (p) => p.type.name === "Profesor guia",
  );
  const isDoctor = guia?.user.academicDegree?.title.at(0)?.abbrev;
  return `<div style="width: 450px; font-family: 'Roboto'; font-size: 12pt;">
<strong>PROF. DR. CARLOS MANTEROLA DELGADO</strong>, Director del Programa de Doctorado en 
Ciencias Médicas, de la Universidad de La Frontera, deja constancia que ${!isMale ? "la estudiante, Sra." : "el estudiante, Sr."} 
${user.name}, matricula Nº ${student.studentId}, se encuentra realizando su Trabajo 
de título (equivalente a tesis), modalidad proyecto de titulación “${activity.name}” bajo dirección de ${guia?.user.gender === Gender.FEMALE ? `la ${isDoctor ? "Dra." : "Sra."}` : `el ${isDoctor ? "Dr." : "Sr."}`} 
${guia?.user.name}, desde ${activity.startAt.getUTCMonth()} del ${activity.startAt.getFullYear()} a la fecha.
</div>`;
};

const getStudentQualificationExamBody = (
  user: RequestUserWithParticipants,
  activity: RequestActivity,
) => {
  const { rut: userRut, student } = user;
  if (!student) throw new Error("Estudiante no ha sido encontrado");
  const { studentId } = student;
  const adjetivo = user.academicDegree?.title.at(0)?.abbrev;
  const userName = adjetivo + user.name;
  const studentMOF = user.gender === Gender.FEMALE ? "alumna" : "alumno";
  const activityStartDate = activity.startAt
    .toLocaleDateString("es-CL")
    .replaceAll("-", "/");
  return `<div style="width: 450px; font-family: 'Roboto'; font-size: 12pt;">
<strong>DRA. TOMARA OTZEN HERNÁDEZ</strong>, Director del Programa de Doctorado en 
Ciencias Médicas, de la Universidad de La Frontera, deja constancia que ${userName}, matrícula Nº ${studentId}, RUT ${userRut} es ${studentMOF} regular de nuestro programa y con fecha ${activityStartDate}, aprobó su examen de calificación con nota 6,9.
</div>`;
};
// TODO: Implementar mensajes de forma dinamica desde la DB
const getCertificateText = (
  user: RequestUserWithParticipants,
  certificate: RequestCertificate,
  activity: RequestActivity | null,
) => {
  // TODO: Implementar mensajes para el resto de certificados de forma estatica por ahora
  if (!activity) throw new Error("Activida no encontrada");
  switch (certificate.name) {
    case Certificates.PARTICIPACION:
      if (user.role === Roles.PROFESSOR)
        return getActivityTesisProfesorText(user, activity);
      if (user.role === Roles.STUDENT)
        return getActivityTesisStudentText(user, activity);
      return "";
    case Certificates.EXAMEN_CALIFICACION:
      if (user.role === Role.STUDENT)
        return getStudentQualificationExamBody(user, activity);
      else return "";
    default:
      return "";
  }
};

const createPdf = async (request: FullRequest) => {
  const { user, activity, certificate } = request;
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

  const text =
    certificate.name === Certificates.ALUMNO_REGULAR
      ? getAlumnoRegularText(user)
      : getCertificateText(
          user as RequestUserWithParticipants,
          certificate,
          activity,
        );
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
    `Temuco, Chile - ${month.at(0)?.toUpperCase() + month.slice(1)} de ${date.getFullYear()}.`,
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
  return Buffer.from(pdfFinalBytes).toString("base64");
};

export const getNotAdminUsers = async () => {
  const user = await db.user.findMany({
    where: {
      role: {
        notIn: [Role.ADMINISTRATOR, Role.SUPERADMIN],
      },
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });

  return user;
};
