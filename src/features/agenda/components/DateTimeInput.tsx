import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
}

export function DateTimeInput({
  value,
  onChange,
  onBlur,
  name,
  id,
}: DateTimeInputProps) {
  const [open, setOpen] = useState(false);

  const currentDate = value ? parseISO(value) : undefined;
  const isValidDate = currentDate !== undefined && isValid(currentDate);
  const currentTime = isValidDate ? format(currentDate, "HH:mm") : "08:00";

  function handleDaySelect(day: Date | undefined) {
    if (!day) return;
    const [hours, minutes] = currentTime.split(":").map(Number);
    const next = new Date(day);
    next.setHours(hours, minutes, 0, 0);
    onChange?.(format(next, "yyyy-MM-dd'T'HH:mm"));
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const time = e.target.value;
    if (!time) return;
    const base = isValidDate ? currentDate : new Date();
    const [hours, minutes] = time.split(":").map(Number);
    const next = new Date(base);
    next.setHours(hours, minutes, 0, 0);
    onChange?.(format(next, "yyyy-MM-dd'T'HH:mm"));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        name={name}
        onBlur={onBlur}
        className={cn(
          "inline-flex h-9 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          !isValidDate && "text-muted-foreground",
        )}
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        {isValidDate
          ? format(currentDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
          : "Selecione data e hora"}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isValidDate ? currentDate : undefined}
          onSelect={(day) => {
            handleDaySelect(day);
          }}
          locale={ptBR}
          autoFocus
        />
        <div className="border-t border-border/50 px-3 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              Horário
            </span>
            <input
              type="time"
              value={currentTime}
              onChange={handleTimeChange}
              className="h-8 flex-1 rounded-md border border-border/70 px-2 text-sm shadow-sm outline-none transition-all focus:border-ring/60 focus:ring-2 focus:ring-ring/15"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
