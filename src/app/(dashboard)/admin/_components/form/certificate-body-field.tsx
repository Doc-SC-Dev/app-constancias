"use client";
import { useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { Button } from "@/components/ui/button";

export default function CertificateBodyField() {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const certificateTags = [
    { id: "user.name", display: "Nombre del Usuario" },
    { id: "user.rut", display: "RUT del Usuario" },
    { id: "user.academicDegree.name", display: "Grado Académico" },
    { id: "activity.name", display: "Nombre de la Actividad" },
    { id: "activity.startAt", display: "Fecha de Inicio" },
    { id: "student.studentId", display: "ID de Matrícula" },
  ];
  // Estilos básicos para que parezca un Input de Shadcn
  const mentionStyle = {
    control: {
      backgroundColor: "#fff",
      fontSize: "14px",
      lineHeight: "1.42",
      borderRadius: "6px",
      border: "1px solid #e2e8f0", // Estilo border-input de Shadcn
      fontFamily: "inherit",
    },
    "&multiLine": {
      control: {
        fontFamily: "inherit",
        border: "1px solid #e2e8f0",
        minHeight: "120px",
      },
      highlighter: {
        padding: "8px",
      },
      input: {
        padding: "10px",
        outline: "none",
      },
    },
    // estilo menu desplegable
    suggestions: {
      list: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        fontSize: "14px",
        borderRadius: "6px",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      },
      item: {
        padding: "5px 10px",
        borderBottom: "1px solid #f1f5f9",
        "&focused": {
          backgroundColor: "#f1f5f9", // Estilo hover de Shadcn
          color: "#0f172a",
        },
      },
    },
  };

  const insertTag = ({ id, display }: { id: string; display: string }) => {
    const tagToInsert = `{{[${display}](${id})}} `;
    setValue((prev) => prev + tagToInsert);
    if (inputRef.current) {
      (inputRef.current as any).focus();
    }
  };

  return (
    <div className="h-full space-y-2">
      <label htmlFor="mentions-body-input" className="text-sm font-medium">
        Cuerpo del Certificado
      </label>
      <MentionsInput
        id="mentions-body-input"
        value={value}
        inputRef={inputRef}
        onChange={(e) => {
          console.log(e.target.value);
          setValue(e.target.value);
        }}
        style={mentionStyle}
        placeholder="Escribe el contenido... usa {{ para insertar datos dinámicos"
        a11ySuggestionsListLabel={"Tags sugeridos"}
      >
        <Mention
          trigger="{{"
          data={certificateTags}
          markup="{{[__display__](__id__)}}" // Cómo se guarda en el string final
          displayTransform={(id, display) => `[${display}]`} // Cómo se ve en el editor
          className="bg-blue-100 text-blue-700 rounded font-semibold"
          appendSpaceOnAdd={true}
        />
      </MentionsInput>
      <div className="flex flex-1 gap-4">
        {certificateTags.map((certicateTag) => (
          <Button
            key={certicateTag.id}
            variant="default"
            size="sm"
            className="rounded-2xl"
            onClick={() => insertTag(certicateTag)}
          >
            {certicateTag.display}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        El texto entre corchetes se reemplazará automáticamente al generar el
        PDF.
      </p>
    </div>
  );
}
