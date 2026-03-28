import { Button } from "@/components/ui/button";
import { useGoogleCalendar } from "../contexts/GoogleCalendarContext";

export function GoogleCalendarButton() {
  const { isConnected, connect, disconnect } = useGoogleCalendar();

  if (isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={disconnect}
        className="gap-2 text-xs"
      >
        <span className="size-2 rounded-full bg-emerald-500" />
        Google Calendar
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={connect}
      className="gap-2 text-xs"
    >
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
        <path
          d="M17.5 3H6.5C4.567 3 3 4.567 3 6.5v11C3 19.433 4.567 21 6.5 21h11c1.933 0 3.5-1.567 3.5-3.5v-11C21 4.567 19.433 3 17.5 3Z"
          fill="#fff"
          stroke="#4285F4"
          strokeWidth="0.5"
        />
        <path d="M17.5 3H12v9l4.5-3.5L21 6.5C21 4.567 19.433 3 17.5 3Z" fill="#EA4335" />
        <path d="M3 17.5C3 19.433 4.567 21 6.5 21H12v-9L7.5 15.5 3 17.5Z" fill="#34A853" />
        <path d="M12 12v9h5.5c1.933 0 3.5-1.567 3.5-3.5V12h-9Z" fill="#FBBC04" />
        <path d="M3 6.5v11L12 12V3H6.5C4.567 3 3 4.567 3 6.5Z" fill="#4285F4" />
      </svg>
      Conectar Google Calendar
    </Button>
  );
}
