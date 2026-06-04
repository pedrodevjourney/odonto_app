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

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmDialog({
  open,
  title,
  description,
  itemName,
  confirmLabel = "Excluir",
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !loading && onClose()}>
      <DialogContent showCloseButton={false} className="overflow-hidden p-0 sm:max-w-sm">
        <div className="h-1 w-full bg-destructive/70" />

        <div className="flex flex-col items-center px-6 pb-6 pt-5 text-center">
          <div className="size-20">
            <Lottie animationData={deleteAnimation} loop={false} />
          </div>

          <DialogTitle className="mt-1 text-base font-semibold text-foreground">
            {title}
          </DialogTitle>

          {itemName && (
            <div className="mt-3 max-w-full rounded-lg border border-border/70 bg-muted/50 px-4 py-2">
              <span className="line-clamp-2 text-sm font-medium text-foreground/85">
                {itemName}
              </span>
            </div>
          )}

          <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
            {description}{" "}
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
