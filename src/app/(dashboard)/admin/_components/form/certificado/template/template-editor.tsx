"use client";

import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import {
  Mention,
  MentionsInput,
  type MentionsInputStyle,
} from "react-mentions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import HightlightTemplate from "./highlight-template";

type TemplateEditorProps = {
  value: string;
  onChange: (val: string) => void;
  previewRolName: string;
};
export default function TemplateEditor({
  value,
  onChange,
  previewRolName,
}: TemplateEditorProps) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState<boolean>(false);
  const certificateTags = [
    {
      id: "director.academicDegree.title[0].abbrev director.name",
      display: "Nombre (Director)",
      description: "Nombre completo del director.",
    },
    {
      id: "user.academicDegree.title[0].abbrev user.name",
      display: "Nombre (Usuario)",
      description: "Nombre completo del usuario participante.",
    },
    {
      id: "user.rut",
      display: "RUT (Usuario)",
      description: "Rol Único Tributario del usuario participante.",
    },
    {
      id: "activity.name",
      display: "Nombre (Actividad)",
      description: "Nombre oficial de la actividad realizada.",
    },
    {
      id: "activity.startAt",
      display: "Fecha de inicio (Actividad)",
      description: "Fecha en que comenzó la actividad.",
    },
    {
      id: "activity.endAt",
      display: "Fecha de término (Actividad)",
      description: "Fecha en que finalizó la actividad.",
    },
    {
      id: "user.student.studentId",
      display: "Matrícula (Estudiante)",
      description: "Número de matrícula del estudiante.",
    },
    {
      id: "user.student.admisionDate",
      display: "Fecha de admisión (Estudiante)",
      description: "Fecha de ingreso al programa.",
    },
    {
      id: "user.participants[0].type.name",
      display: "Rol (Actividad)",
      description: "Rol del usuario en la actividad.",
    },
  ];
  // Estilos básicos para que parezca un Input de Shadcn
  const mentionStyle: MentionsInputStyle = {
    control: {
      backgroundColor: "#fff",
      fontSize: "1rem",
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
        height: "100%",
      },
      highlighter: {
        padding: "16px",
        height: "100%",

        fontFamily: "inherit",
        fontSize: "1rem",
        lineHeight: "1.42",
        margin: 0,
        border: "1px solid transparent",
        boxSizing: "border-box",
      },
      input: {
        padding: "16px",
        outline: "none",
        height: "100%",

        fontFamily: "inherit",
        fontSize: "1rem",
        lineHeight: "1.42",
        margin: 0,
        border: "1px solid transparent",
        boxSizing: "border-box",
      },
    },
    // estilo menu desplegable
    suggestions: {
      list: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        fontSize: "16px",
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
  return (
    <div className="w-full h-full">
      <div className="flex justify-between align-center mb-4">
        <h3 className="text-lg font-semibold">Cuerpo del certificado</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreview(!preview)}
          type="button"
        >
          {preview ? "Editar" : "Vista Previa"}
        </Button>
      </div>
      <div className="w-full h-full">
        {preview ? (
          <HightlightTemplate template={value} activityRole={previewRolName} />
        ) : (
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-full min-h-[250px] flex flex-col">
              <MentionsInput
                className="h-full"
                id="mentions-body-input"
                value={value}
                inputRef={inputRef}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                style={mentionStyle}
                placeholder="Escribe el contenido... usa { para insertar datos dinámicos"
                a11ySuggestionsListLabel={"Tags sugeridos"}
              >
                <Mention
                  trigger="{"
                  data={certificateTags}
                  markup="{__id__}" // Cómo se guarda en el string final
                  displayTransform={(id) =>
                    certificateTags.find((t) => t.id === id)?.display || id
                  } // Cómo se ve en el editor
                  className="bg-blue-100 text-blue-700 rounded font-semibold h-full"
                  appendSpaceOnAdd={true}
                />
              </MentionsInput>
            </div>
            <Card className="md:col-span-1 h-full flex flex-col py-0 gap-0">
              <CardHeader className="bg-muted/50 px-4 py-3 border-b flex-none space-y-0.5">
                <CardTitle className="text-sm">Variables disponibles</CardTitle>
                <CardDescription className="text-xs">
                  Haz clic para insertar en el texto
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="h-[200px] w-full">
                  <div className="p-4 flex flex-col gap-3">
                    {certificateTags.map((certificateTag) => (
                      <Button
                        key={certificateTag.id}
                        type="button"
                        variant="outline"
                        className="group h-auto w-full flex flex-col items-start text-left p-3   transition-all rounded-xl"
                        onClick={() =>
                          onChange(`${value ?? ""}{${certificateTag.id}} `)
                        }
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-semibold text-sm">
                            {certificateTag.display}
                          </span>
                          <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-normal leading-snug group-hover:text-background/80">
                          {certificateTag.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
