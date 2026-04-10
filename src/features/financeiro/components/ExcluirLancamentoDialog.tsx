import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExcluirLancamentoDialogProps {
  open: boolean;
  descricao?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ExcluirLancamentoDialog({
  open,
  descricao,
  onClose,
  onConfirm,
}: ExcluirLancamentoDialogProps) {
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
        <div className="h-1 w-full bg-destructive/70" />

        <div className="flex flex-col items-center px-6 pb-6 pt-5 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-7 text-red-600" />
          </div>

          <DialogTitle className="mt-3 text-base font-semibold text-foreground">
            Excluir lançamento
          </DialogTitle>

          {descricao && (
            <div className="mt-3 rounded-lg border border-border/70 bg-muted/50 px-4 py-2">
              <span className="text-sm font-medium text-foreground/85">
                {descricao}
              </span>
            </div>
          )}

          <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
            Este lançamento será removido permanentemente.{" "}
            <span className="font-medium text-foreground/80">
              Esta ação não pode ser desfeita.
            </span>
          </DialogDescription>

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
