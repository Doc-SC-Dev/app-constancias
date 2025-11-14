"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Action, Actions } from "@/lib/types/action";
import type { User } from "@/lib/types/users";
import ActionButton from "./action-button";
import DeleteDialog from "./delete-dialog";
import EditDialog from "./edit-dialog";
import NewUserDialog from "./newuser-dialog";
import ViewDialog from "./view-dialog";

type DrowpdownDialogProps = {
  user?: User;
};

export default function DropdownDialog({ user }: DrowpdownDialogProps) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [action, setAction] = useState<Action>(Actions.VIEW);
  const closeDialog = () => {
    setShowDialog(false);
  };
  return (
    <>
      {user ? (
        <ActionButton
          selectAction={(action: Action): void => {
            setAction(action);
            setShowDialog(true);
          }}
        />
      ) : (
        <Button variant="default" onClick={() => setShowDialog(true)}>
          Agregar
          <Plus />
        </Button>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {user ? (
          <>
            {action === Actions.VIEW && <ViewDialog user={user} />}
            {action === Actions.DELETE && (
              <DeleteDialog user={user} closeDialog={closeDialog} />
            )}
            {action === Actions.EDIT && (
              <EditDialog user={user} closeDialog={closeDialog} />
            )}
          </>
        ) : (
          <NewUserDialog closeDialog={closeDialog} />
        )}
      </Dialog>
    </>
  );
}
