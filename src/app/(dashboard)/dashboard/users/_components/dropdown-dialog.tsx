"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { useState } from "react";
import { type Action, Actions } from "@/lib/types/action";
import type { User } from "@/lib/types/users";
import ActionButton from "./action-button";
import DeleteDialog from "./delete-dialog";
import ViewDialog from "./view-dialog";

type DrowpdownDialogProps = {
  user: User;
};

export default function DropdownDialog({ user }: DrowpdownDialogProps) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [action, setAction] = useState<Action>(Actions.VIEW);
  const closeDialog = () => {
    setShowDialog(false);
  };
  return (
    <>
      <ActionButton
        selectAction={(action: Action): void => {
          setAction(action);
          setShowDialog(true);
        }}
      />
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {action === Actions.VIEW && <ViewDialog user={user} />}
        {action === Actions.DELETE && (
          <DeleteDialog user={user} closeDialog={closeDialog} />
        )}
        {/* {action === Actions.Edit && } */}
      </Dialog>
    </>
  );
}
