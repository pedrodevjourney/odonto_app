import { useCallback, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ConfirmOptions {
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
}

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<(value: boolean) => void>(null!);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions(opts);
    });
  }, []);

  function handleConfirm() {
    return new Promise<void>((resolve) => {
      resolveRef.current(true);
      setOptions(null);
      resolve();
    });
  }

  function handleClose() {
    resolveRef.current(false);
    setOptions(null);
  }

  const dialog = options ? (
    <ConfirmDialog
      open
      title={options.title}
      description={options.description}
      itemName={options.itemName}
      confirmLabel={options.confirmLabel}
      onClose={handleClose}
      onConfirm={handleConfirm}
    />
  ) : null;

  return { confirm, dialog };
}
