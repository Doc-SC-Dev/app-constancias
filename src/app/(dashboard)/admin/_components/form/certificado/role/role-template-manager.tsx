"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { CertificateCreateDto } from "@/lib/types/certificate";
import { Textos } from "@/lib/utils";
import TabsSideBar from "../template/tabs-side-bar";
import TemplateEditor from "../template/template-editor";

export default function RoleTemplateManager() {
  const { control, watch } = useFormContext<CertificateCreateDto>();
  const roles = watch("roles");
  const templateLocation = watch("templateLocation");
  const [index, setIndex] = useState<number>(0);

  if (templateLocation !== "role" || !roles || !roles.length) return null;

  return (
    <TabsSideBar
      items={roles.map((role) => ({
        id: role.name,
        label: Textos.Role[role.name],
      }))}
      onChange={setIndex}
      index={index}
    >
      {roles.map((role, i) => (
        <div
          key={role.name}
          className="h-full"
          style={{ display: index === i ? "block" : "none" }}
          aria-hidden={index !== i}
        >
          <Controller
            control={control}
            name={`roles.${i}.template`}
            render={({ field }) => (
              <TemplateEditor
                value={field.value}
                onChange={field.onChange}
                previewRolName={role.name}
              />
            )}
          />
        </div>
      ))}
    </TabsSideBar>
  );
}
