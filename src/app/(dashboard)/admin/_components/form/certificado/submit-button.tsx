"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { CertificateCreateDto } from "@/lib/types/certificate";

export default function SubmitButton() {
  const form = useFormContext<CertificateCreateDto>();
  return (
    <Button type="submit" form="create-certificate-form">
      {form.formState.isSubmitting ? (
        <>
          <Spinner />
          ...Creando certificado
        </>
      ) : (
        "Guardar"
      )}
    </Button>
  );
}
