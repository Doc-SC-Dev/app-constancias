import type React from "react";
import { cn } from "@/lib/utils";
export function TableCell({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center",
        className?.includes("flex-none") ? "" : "flex-1",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
