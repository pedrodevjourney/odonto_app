import { useState } from "react";
import LottieLib from "lottie-react";
import { Loader2 } from "lucide-react";
import deleteAnimation from "@/assets/animations/delete.json";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Lottie = (LottieLib as any).default ?? LottieLib;

interface ExcluirPacienteDialogProps {
  open: boolean;
  pacienteNome?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ExcluirPacienteDialog({
  open,
  pacienteNome,
  onClose,
  onConfirm,
}: ExcluirPacienteDialogProps) {
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
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden p-0 sm:max-w-sm"
      >
        {/* Accent bar */}
        <div className="h-1 w-full bg-destructive/70" />

        <div className="flex flex-col items-center px-6 pb-6 pt-5 text-center">
          {/* Lottie */}
          <div className="size-20">
            <Lottie animationData={deleteAnimation} loop={false} />
          </div>

          {/* Title */}
          <DialogTitle className="mt-1 text-base font-semibold text-foreground">
            Excluir paciente
          </DialogTitle>

          {/* Patient name chip */}
          {pacienteNome && (
            <div className="mt-3 rounded-lg border border-border/70 bg-muted/50 px-4 py-2">
              <span className="text-sm font-medium text-foreground/85">
                {pacienteNome}
              </span>
            </div>
          )}

          {/* Description */}
          <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
            Todos os dados vinculados a este paciente serão removidos
            permanentemente.{" "}
            <span className="font-medium text-foreground/80">
              Esta ação não pode ser desfeita.
            </span>
          </DialogDescription>

          {/* Actions */}
          <div className="mt-6 flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
