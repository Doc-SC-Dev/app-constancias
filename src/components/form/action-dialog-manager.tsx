"use client";

import { type LucideProps, Plus } from "lucide-react";
import {
  type ForwardRefExoticComponent,
  type RefAttributes,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { type Action, Actions } from "@/lib/types/action";
import { Dialog } from "../ui/dialog";
import ActionButton from "./action-button";
import { downloadCertificate } from "@/app/(dashboard)/action";
import { toast } from "sonner";
import HistoryViewDialog from "@/app/(dashboard)/dashboard/history/_components/history-view-dialog";
import HistoryStateDialog from "@/app/(dashboard)/dashboard/history/_components/history-state-dialog";

type ActionDialogProps<T> = {
  data?: T;
  triggerLabel?: string;
  viewDialog?: React.ComponentType<{ data: T; closeDialog: () => void }>;
  editDialog?: React.ComponentType<{ data: T; closeDialog: () => void }>;
  deleteDialog?: React.ComponentType<{ data: T; closeDialog: () => void }>;
  createDialog?: React.ComponentType<{ closeDialog: () => void }>;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
  isHistory?: boolean;
  canViewReason?: boolean;
  isDownloadDisabled?: boolean;
};

export default function ActionDialogManager<T>({
  data,
  triggerLabel = "",
  viewDialog: ViewDialog,
  editDialog: EditDialog,
  deleteDialog: DeleteDialog,
  createDialog: CreateDialog,
  icon: Icon = Plus,
  variant = "default",
  className = "",
  isHistory = false,
  isDownloadDisabled = false,
  canViewReason = false,
}: ActionDialogProps<T>) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [action, setAction] = useState<Action>(Actions.VIEW);

  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleDownload = async () => {
    if (!data || !(data as any).id) return;

    if ((data as any).link) {
      window.open((data as any).link, '_blank');
      return;
    }

    const promise = async () => {
      const { success, data: base64, message } = await downloadCertificate(
        (data as any).id,
      );
      if (success && base64) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = `${(data as any).certName || "constancia"}.pdf`;
        link.click();
        return "Certificado descargado exitosamente";
      }
      throw new Error(message || "Error al descargar el certificado");
    };

    toast.promise(promise(), {
      loading: "Descargando certificado...",
      success: (data) => data,
      error: (err) => err.message,
    });
  };

  const handleViewReason = () => {
    setAction(Actions.VIEW_REASON);
    setShowDialog(true);
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
          onDownload={isHistory && !canViewReason ? handleDownload : undefined}
          onViewReason={canViewReason ? handleViewReason : undefined}
          onDownloadDisabled={isDownloadDisabled}
        />
      ) : (
        <Button
          variant={variant}
          onClick={() => setShowDialog(true)}
          className={className}
        >
          {triggerLabel}
          <Icon />
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
            {action === Actions.VIEW_REASON && (
              <HistoryViewDialog data={data as any} closeDialog={closeDialog} />
            )}
            {action === Actions.UPDATE_STATE && (
              <HistoryStateDialog data={data as any} closeDialog={closeDialog} />
            )}
          </>
        ) : (
          CreateDialog && <CreateDialog closeDialog={closeDialog} />
        )}
      </Dialog>
    </>
  );
}
