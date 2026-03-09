"use client";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { CertificateCreateDto } from "@/lib/types/certificate";
import TabsSideBar from "../template/tabs-side-bar";
import TemplateEditor from "../template/template-editor";

export default function ActivityTemplateManager() {
  const { control, watch } = useFormContext<CertificateCreateDto>();
  const activityTypes = watch("activityTypes");
  const templateLocation = watch("templateLocation");
  const [index, setIndex] = useState<number>(0);

  if (
    templateLocation !== "activity" ||
    !activityTypes ||
    !activityTypes.length
  )
    return null;

  return (
    <TabsSideBar
      items={activityTypes.map((at) => ({
        id: at.id,
        label: at.name,
      }))}
      onChange={setIndex}
      index={index}
    >
      {activityTypes.map((at, i) => (
        <div
          key={at.name}
          className="h-full"
          style={{ display: index === i ? "block" : "none" }}
          aria-hidden={index !== i}
        >
          <Controller
            control={control}
            name={`activityTypes.${i}.template`}
            render={({ field }) => (
              <TemplateEditor
                value={field.value}
                onChange={field.onChange}
                previewRolName={at.name}
              />
            )}
          />
        </div>
      ))}
    </TabsSideBar>
  );
}
