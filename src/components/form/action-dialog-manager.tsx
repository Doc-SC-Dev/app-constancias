"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Action, Actions } from "@/lib/types/action";
import ActionButton from "./action-button";

type ActionDialogProps<T> = {
  data?: T;
  triggerLabel?: string;
  viewDialog?: React.ComponentType<{ data: T; closeDialog: () => void }>;
  editDialog?: React.ComponentType<{ data: T; closeDialog: () => void }>;
  deleteDialog?: React.ComponentType<{ data: T; closeDialog: () => void }>;
  createDialog?: React.ComponentType<{ closeDialog: () => void }>;
};

export default function ActionDialogManager<T>({
  data,
  triggerLabel = "Agregar",
  viewDialog: ViewDialog,
  editDialog: EditDialog,
  deleteDialog: DeleteDialog,
  createDialog: CreateDialog,
}: ActionDialogProps<T>) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [action, setAction] = useState<Action>(Actions.VIEW);

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      {data ? (
        <ActionButton
          onDelete={
            DeleteDialog
              ? () => {
                  setAction(Actions.DELETE);
                  setShowDialog(true);
                }
              : undefined
          }
          onEdit={
            EditDialog
              ? () => {
                  setAction(Actions.EDIT);
                  setShowDialog(true);
                }
              : undefined
          }
          onView={
            ViewDialog
              ? () => {
                  setAction(Actions.VIEW);
                  setShowDialog(true);
                }
              : undefined
          }
        />
      ) : (
        <Button variant="default" onClick={() => setShowDialog(true)}>
          {triggerLabel}
          <Plus />
        </Button>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {data ? (
          <>
            {action === Actions.VIEW && ViewDialog && (
              <ViewDialog data={data} closeDialog={closeDialog} />
            )}
            {action === Actions.DELETE && DeleteDialog && (
              <DeleteDialog data={data} closeDialog={closeDialog} />
            )}
            {action === Actions.EDIT && EditDialog && (
              <EditDialog data={data} closeDialog={closeDialog} />
            )}
          </>
        ) : (
          CreateDialog && <CreateDialog closeDialog={closeDialog} />
        )}
      </Dialog>
    </>
  );
}
