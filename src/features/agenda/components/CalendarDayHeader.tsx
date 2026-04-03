interface CalendarDayHeaderProps {
  date: Date;
  viewType: string;
  today: Date;
}

export function CalendarDayHeader({
  date,
  viewType,
  today,
}: CalendarDayHeaderProps) {
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isDay = viewType === "timeGridDay";

  const weekday = date
    .toLocaleDateString("pt-BR", {
      weekday: isDay ? "long" : "short",
    })
    .replace(".", "")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <span
        className="text-[10px] font-semibold tracking-widest"
        style={{
          color: isToday ? "oklch(0.52 0.14 210)" : "oklch(0.556 0 0 / 70%)",
        }}
      >
        {weekday}
      </span>
      <span
        className="flex size-7 items-center justify-center rounded-full text-sm"
        style={
          isToday
            ? {
                background: "oklch(0.88 0.06 210)",
                color: "oklch(0 0 0)",
                fontWeight: 800,
              }
            : { color: "oklch(0.145 0 0)", fontWeight: 400 }
        }
      >
        {date.getDate()}
      </span>
    </div>
  );
}
