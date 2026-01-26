import type React from "react";
import { cn } from "@/lib/utils";
export function TableCell({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span className={cn("flex flex-1 items-center", className)} {...props}>
      {children}
    </span>
  );
}
