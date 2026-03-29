import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useGoogleLogin } from "@react-oauth/google";

interface GoogleCalendarContextValue {
  isConnected: boolean;
  accessToken: string | null;
  connect: () => void;
  disconnect: () => void;
}

const GoogleCalendarContext = createContext<GoogleCalendarContextValue | null>(
  null,
);

const STORAGE_KEY = "odonto_google_token";

export function GoogleCalendarProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY),
  );

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      sessionStorage.setItem(STORAGE_KEY, token);
    },
  });

  const connect = useCallback(() => {
    login();
  }, [login]);

  const disconnect = useCallback(() => {
    if (accessToken) {
      fetch("https://oauth2.googleapis.com/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${encodeURIComponent(accessToken)}`,
      }).catch(() => {});
    }
    setAccessToken(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, [accessToken]);

  return (
    <GoogleCalendarContext.Provider
      value={{
        isConnected: !!accessToken,
        accessToken,
        connect,
        disconnect,
      }}
    >
      {children}
    </GoogleCalendarContext.Provider>
  );
}

export function useGoogleCalendar(): GoogleCalendarContextValue {
  const ctx = useContext(GoogleCalendarContext);
  if (!ctx) {
    throw new Error(
      "useGoogleCalendar must be used within GoogleCalendarProvider",
    );
  }
  return ctx;
}

/** Safe version that returns null when outside the provider (no Google Client ID configured) */
export function useOptionalGoogleCalendar(): GoogleCalendarContextValue | null {
  return useContext(GoogleCalendarContext);
}
