"use client";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function LinkActionButton<T>({
  data,
  seeLink,
  editLink,
  deleteDialog: DeleteDialog,
}: {
  data: T;
  seeLink: string;
  editLink: string;
  deleteDialog?: React.ComponentType<{ closeDialog: () => void; data: T }>;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={seeLink}>
              <Eye className="mr-2 h-4 w-4" />
              Ver
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={editLink}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          {DeleteDialog && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setShowDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {DeleteDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DeleteDialog
            data={data}
            closeDialog={() => {
              setShowDialog(false);
            }}
          />
        </Dialog>
      )}
    </>
  );
}
