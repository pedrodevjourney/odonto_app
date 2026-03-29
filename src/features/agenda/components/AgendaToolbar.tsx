import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface AgendaToolbarProps {
  currentDate: Date;
  currentView: string;
  onViewChange: (view: string) => void;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGotoDate: (date: Date) => void;
}

export function AgendaToolbar({
  currentDate,
  currentView,
  onViewChange,
  onToday,
  onPrev,
  onNext,
  onGotoDate,
}: AgendaToolbarProps) {
  const [open, setOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());

  const dateLabel = format(currentDate, "MMMM yyyy", { locale: ptBR });
  const activeMonth = currentDate.getMonth();
  const activeYear = currentDate.getFullYear();

  function handleOpen(isOpen: boolean) {
    if (isOpen) setPickerYear(currentDate.getFullYear());
    setOpen(isOpen);
  }

  function handleMonthSelect(month: number) {
    onGotoDate(new Date(pickerYear, month, 1));
    setOpen(false);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={onPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday} className="px-3">
          Hoje
        </Button>
        <Button variant="outline" size="sm" onClick={onNext}>
          <ChevronRight className="size-4" />
        </Button>

        <Popover open={open} onOpenChange={handleOpen}>
          <PopoverTrigger className="ml-1 flex items-center gap-1.5 rounded-md px-2 py-1 text-lg font-semibold capitalize text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            {dateLabel}
            <CalendarDays className="size-4 text-muted-foreground" />
          </PopoverTrigger>

          <PopoverContent className="w-60 p-3" side="bottom" align="start">
            <div className="mb-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPickerYear((y) => y - 1)}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <span className="text-sm font-semibold tabular-nums">
                {pickerYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPickerYear((y) => y + 1)}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((month, index) => {
                const isActive =
                  index === activeMonth && pickerYear === activeYear;
                return (
                  <button
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "rounded-md py-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive &&
                        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                    )}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-0.5">
        <Button
          variant={currentView === "timeGridWeek" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("timeGridWeek")}
          className="text-xs"
        >
          Semana
        </Button>
        <Button
          variant={currentView === "timeGridDay" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("timeGridDay")}
          className="text-xs"
        >
          Dia
        </Button>
      </div>
    </div>
  );
}
