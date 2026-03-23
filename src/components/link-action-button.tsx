"use client";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AlertDialog } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function LinkActionButton({
  seeLink,
  editLink,
  deleteAlertDialog: DeleteAlertDialog,
}: {
  seeLink: string;
  editLink?: string;
  deleteAlertDialog?: React.ComponentType<{ closeDialog: () => void }>;
}) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <>
      {DeleteAlertDialog && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <DeleteAlertDialog closeDialog={() => setOpen(false)} />
        </AlertDialog>
      )}
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem asChild className="hover:bg-muted">
            <Link href={seeLink}>
              <Eye className="mr-2 h-4 w-4 hover:text-accent" />
              Ver
            </Link>
          </DropdownMenuItem>
          {editLink && (
            <DropdownMenuItem asChild className="hover:bg-muted">
              <Link href={editLink} className="hover:bg-muted">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
          )}
          {DeleteAlertDialog && (
            <DropdownMenuItem
              onSelect={() => {
                setOpenDropdown(false);
                setOpen(true);
              }}
              variant="destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
