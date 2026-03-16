"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { CertificateCreateDto } from "@/lib/types/certificate";
import TabsSideBar from "../template/tabs-side-bar";
import TemplateEditor from "../template/template-editor";

export default function ParticipantTemplateManager() {
  const { control, watch } = useFormContext<CertificateCreateDto>();
  const participantTypes = watch("participantTypes");
  const templateLocation = watch("templateLocation");
  const [index, setIndex] = useState<number>(0);

  if (
    templateLocation !== "participant" ||
    !participantTypes ||
    !participantTypes.length
  )
    return null;

  return (
    <TabsSideBar
      items={participantTypes.map((pt) => ({
        id: pt.id,
        label: pt.name,
      }))}
      onChange={setIndex}
      index={index}
    >
      {participantTypes.map((pt, i) => (
        <div
          key={pt.name}
          className="h-full"
          style={{ display: index === i ? "block" : "none" }}
          aria-hidden={index !== i}
        >
          <Controller
            control={control}
            name={`participantTypes.${i}.template`}
            render={({ field }) => (
              <TemplateEditor
                value={field.value}
                onChange={field.onChange}
                previewRolName={pt.name}
              />
            )}
          />
        </div>
      ))}
    </TabsSideBar>
  );
}
