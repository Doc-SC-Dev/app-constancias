import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Action, Actions } from "@/lib/types/action";

type ActionButtonProps = {
  selectAction: (action: Action) => void;
};

export default function ActionButton({ selectAction }: ActionButtonProps) {
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
        <DropdownMenuItem onSelect={() => selectAction(Actions.VIEW)}>
          <Eye />
          Ver
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => selectAction(Actions.EDIT)}>
          <Edit />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => selectAction(Actions.DELETE)}
          variant="destructive"
        >
          <Trash />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
