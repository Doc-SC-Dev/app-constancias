"use client";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
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
};

export default function ActionButton({
  onView,
  onEdit,
  onDelete,
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
    return (
      <Button
        variant="ghost"
        size="default"
        onClick={action.onClick}
        className={
          action.type === "delete"
            ? "text-destructive hover:text-destructive"
            : ""
        }
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
