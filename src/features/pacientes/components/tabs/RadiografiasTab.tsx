import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, ZoomIn, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import {
  deleteRadiografia,
  fetchRadiografiaBlob,
  getRadiografias,
  uploadRadiografia,
} from "@/features/pacientes/services/prontuarioService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useConfirm } from "@/hooks/useConfirm";
import type { Radiografia, TipoRadiografia } from "@/features/pacientes/types/prontuario";

interface RadiografiasTabProps {
  pacienteId: number;
}

const TIPO_LABELS: Record<TipoRadiografia, string> = {
  PERIAPICAL: "Periapical",
  PANORAMICA: "Panorâmica",
  INTERPROXIMAL: "Interproximal",
  OCLUSAL: "Oclusal",
  CEFALOMETRICA: "Cefalométrica",
};

interface RadioItem {
  meta: Radiografia;
  blobUrl?: string;
  loading: boolean;
}

export function RadiografiasTab({ pacienteId }: RadiografiasTabProps) {
  const { user } = useAuth();
  const { confirm, dialog } = useConfirm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [itens, setItens] = useState<RadioItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!user?.token) return;
    try {
      const lista = await getRadiografias(user.token, pacienteId);
      setItens(lista.map((m) => ({ meta: m, loading: true })));
      lista.forEach(async (m) => {
        try {
          const url = await fetchRadiografiaBlob(user.token!, pacienteId, m.id);
          setItens((prev) =>
            prev.map((it) => it.meta.id === m.id ? { ...it, blobUrl: url, loading: false } : it),
          );
        } catch {
          setItens((prev) =>
            prev.map((it) => it.meta.id === m.id ? { ...it, loading: false } : it),
          );
        }
      });
    } catch {
      toast.error("Erro ao carregar radiografias.");
    }
  }, [user?.token, pacienteId]);

  useEffect(() => { carregar(); }, [carregar]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.token) return;
    setUploading(true);
    try {
      await uploadRadiografia(user.token, pacienteId, file);
      toast.success("Radiografia enviada!");
      carregar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(item: RadioItem) {
    if (!user?.token) return;
    const ok = await confirm({
      title: "Excluir radiografia",
      description: "A imagem será removida permanentemente do prontuário.",
      itemName: item.meta.nomeOriginal ?? undefined,
    });
    if (!ok) return;
    try {
      await deleteRadiografia(user.token, pacienteId, item.meta.id);
      if (item.blobUrl) URL.revokeObjectURL(item.blobUrl);
      toast.success("Radiografia excluída.");
      setItens((prev) => prev.filter((it) => it.meta.id !== item.meta.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  }

  return (
    <>
      {dialog}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setPreviewUrl(null)}
          >
            <X className="size-5" />
          </button>
          <img
            src={previewUrl}
            alt="Radiografia"
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/60">
            {itens.length} radiografia{itens.length !== 1 ? "s" : ""}
          </p>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-8 gap-1.5 text-[13px]"
          >
            {uploading ? (
              <Upload className="size-3.5 animate-bounce" />
            ) : (
              <ImagePlus className="size-3.5" />
            )}
            {uploading ? "Enviando..." : "Adicionar"}
          </Button>
        </div>

        {itens.length === 0 ? (
          <EmptyState
            icon={ImagePlus}
            title="Nenhuma radiografia registrada"
            description="Faça upload de radiografias e imagens odontológicas do paciente."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {itens.map((item) => (
              <div
                key={item.meta.id}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-muted/30"
              >
                <div className="aspect-square w-full bg-muted/50">
                  {item.loading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    </div>
                  ) : item.blobUrl && item.meta.contentType?.startsWith("image/") ? (
                    <img
                      src={item.blobUrl}
                      alt={item.meta.nomeOriginal ?? "Radiografia"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
                      <ImagePlus className="size-8 text-muted-foreground/30" />
                      <span className="text-center text-[10px] text-muted-foreground/50 break-all">
                        {item.meta.nomeOriginal}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <p className="truncate text-[11px] font-medium text-foreground/70">
                    {item.meta.nomeOriginal ?? "Arquivo"}
                  </p>
                  {item.meta.tipoRadiografia && (
                    <p className="text-[10px] text-muted-foreground/50">
                      {TIPO_LABELS[item.meta.tipoRadiografia]}
                    </p>
                  )}
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.blobUrl && item.meta.contentType?.startsWith("image/") && (
                    <button
                      onClick={() => setPreviewUrl(item.blobUrl!)}
                      className="rounded-md bg-black/60 p-1.5 text-white hover:bg-black/80"
                    >
                      <ZoomIn className="size-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-md bg-black/60 p-1.5 text-white hover:bg-red-600"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
