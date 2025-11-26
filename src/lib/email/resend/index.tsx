import { Resend } from "resend";
import { ForgotPasswordEmail } from "@/components/emails/forgot-password-email";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

const DEFAULT_FROM = `Constancias Doctorado <${env.FROM_EMAIL}>`;

const sendEmail = async (
  to: string,
  subject: string,
  name: string,
  url: string,
) => {
  try {
    await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      react: <ForgotPasswordEmail name={name} url={url} />,
    });
    return { success: true, message: "Correo enviado exitosamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error en el envio del correo" };
  }
};

export const sendForgotPasswordEmail = async (
  email: string,
  name: string,
  url: string,
) => {
  const { success, message } = await sendEmail(
    email,
    "Recuperar contraseña",
    name,
    url,
  );
  return { success, message };
};
