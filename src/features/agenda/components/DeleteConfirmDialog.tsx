import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  patientName?: string;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  patientName,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isDeleting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Excluir Consulta</DialogTitle>
          <DialogDescription className="text-center">
            {patientName ? (
              <>
                Tem certeza que deseja excluir permanentemente a consulta de{" "}
                <span className="font-semibold text-foreground">
                  {patientName}
                </span>
                ?
              </>
            ) : (
              "Tem certeza que deseja excluir permanentemente esta consulta?"
            )}
            <span className="mt-2 block text-xs text-destructive">
              Esta ação não pode ser desfeita.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, excluir"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
