import {
  Button,
  Column,
  Container,
  Heading,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { MessageCircle } from "lucide-react";

type ForgotPasswordEmailProps = {
  name: string;
  url: string;
};

export function ForgotPasswordEmail({ name, url }: ForgotPasswordEmailProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                background: "#fafafa",
                foreground: "#171b1e",
                card: "#ffffff",
                cardForeground: "#171b1e",
                popover: "#ffffff",
                popoverForeground: "#171b1e",
                primary: "#003a6c",
                primaryForeground: "#fffcfb",
                secondary: "#003a6c",
                secondaryForeground: "#fffcfb",
                muted: "#efefef",
                mutedForeground: "#4c637e",
                accent: "#003a6a",
                accentForeground: "#fffcfb",
                destructive: "#e54d2e",
                destructiveForeground: "#ffffff",
                border: "#d8d8d8",
                input: "#d8d8d8",
                ring: "#4c637e",
              },
              borderRadius: {
                DEFAULT: "8px",
              },
            },
          },
        }}
      >
        <Section>
          <Heading as="h2" className="text-center">
            Recuperación de contraseña
          </Heading>
          <Text>{`Hola, ${name}:`}</Text>
          <Text>
            Hemos recibido una solicitud para restablecer la contraseña de tu
            cuenta en Aplicación de Constancias del Doctorado en ciencias
            medicas.
          </Text>
        </Section>
        <Section>
          <Text>
            Para crear una nueva contraseña, por favor haz clic en el siguiente
            botón:
          </Text>
          <Container className="flex justify-center max-w-sm">
            <Button
              href={url}
              className="box-border w-full rounded-md bg-accent px-4 py-2 text-accent-foreground text-center"
            >
              Recuperar Contraseña
            </Button>
          </Container>
          <Text>
            Este enlace expirará en 60 minutos por razones de seguridad.
          </Text>
          <Text>
            ¿No solicitaste este cambio? Si no has sido tú quien ha realizado
            esta solicitud, puedes ignorar este mensaje con tranquilidad. Tu
            cuenta sigue estando segura y tu contraseña actual no ha cambiado.
          </Text>
        </Section>
        <Section>
          <Text>
            Si tienes problemas con el botón, copia y pega el siguiente enlace
            en tu navegador:
          </Text>
          <Link href={url}>{url}</Link>
          <Text>
            Atentamente, El equipo de Aplicación de Constancias del Doctorado en
            ciencias medicas
          </Text>
        </Section>
        <Section>
          <Column colSpan={4}>
            <Img
              alt="Logo Doctorado en ciencias medicas"
              height="42"
              src="/assets/images/logo-horizontal-blanco.png"
            />
            <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
              Doctorado en ciencias medicas
            </Text>
            <Text className="mt-[4px] mb-[0px] text-[16px] text-gray-500 leading-[24px]">
              Aplicación de constancias
            </Text>
          </Column>
          <Column align="left" className="table-cell align-bottom">
            <Row>
              <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
                Montevideo 870, Temuco
              </Text>
              <Text className="mt-[4px] mb-[0px] font-semibold text-[16px] text-gray-500 leading-[24px]">
                doccsmedicas@ufrontera.cl
              </Text>
            </Row>
            <Row>
              <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
                <MessageCircle />
                +56 9 7865 4321
              </Text>
            </Row>
          </Column>
        </Section>
      </Tailwind>
    </Html>
  );
}

export default ForgotPasswordEmail;
