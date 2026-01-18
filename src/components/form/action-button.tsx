"use client";
import { Download, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActionButtonProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onViewReason?: () => void;
  onDownloadDisabled?: boolean;
};

export default function ActionButton({
  onView,
  onEdit,
  onDelete,
  onDownload,
  onViewReason,
  onDownloadDisabled,
}: ActionButtonProps) {
  // Determine available actions
  const actions = [];

  if (onView) {
    actions.push({
      label: "Ver",
      icon: <Eye className="h-4 w-4" />,
      onClick: onView,
      type: "view",
    });
  }
  if (onEdit) {
    actions.push({
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
      type: "edit",
    });
  }
  if (onDownload) {
    actions.push({
      label: "Descargar",
      icon: <Download className="h-4 w-4" />,
      onClick: onDownload,
      type: "download",
    });
  }
  if (onViewReason) {
    actions.push({
      label: "Ver Motivo",
      icon: <Eye className="h-4 w-4" />,
      onClick: onViewReason,
      type: "view-reason",
    });
  }
  if (onDelete) {
    actions.push({
      label: "Eliminar",
      icon: <Trash className="h-4 w-4" />,
      onClick: onDelete,
      variant: "destructive",
      type: "delete",
    });
  }

  if (actions.length === 0) return null;

  if (actions.length === 1) {
    const action = actions[0];
    const isDisabled = action.type === "download" && onDownloadDisabled;

    /* estas son variables de estilo */
    return (
      <Button
        variant="ghost"
        /* variant={action.type === "download" ? "default" : "ghost"} */
        size="default"
        onClick={isDisabled ? undefined : action.onClick}
        disabled={isDisabled}
        className={cn(
          action.type === "delete"
            ? "text-destructive hover:text-destructive"
            : "",
          isDisabled ? "opacity-50 pointer-events-none" : ""
          /* : action.type === "download"
            ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            : "" */
        )}
        title={action.label}
      >
        {action.icon}
        <span>{action.label}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir Menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.type}
            onSelect={action.onClick}
            className={
              action.type === "delete"
                ? "text-destructive focus:text-destructive"
                : ""
            }
          >
            {action.type === "view" && <Eye className="mr-2 h-4 w-4" />}
            {action.type === "edit" && <Edit className="mr-2 h-4 w-4" />}
            {action.type === "view-reason" && <Eye className="mr-2 h-4 w-4" />}
            {action.type === "download" && (
              <Download className="mr-2 h-4 w-4" />
            )}
            {action.type === "delete" && (
              <Trash className="mr-2 h-4 w-4 text-destructive" />
            )}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
