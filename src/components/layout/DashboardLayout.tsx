import { Bell, CircleUser, Loader2, LogOut, PanelLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { PageActionsProvider, usePageActions } from "@/contexts/PageActionsContext";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu do usuário"
        aria-expanded={open}
        disabled={loggingOut}
      >
        <CircleUser className="size-6" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-border bg-white shadow-md">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={cn(
              "flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-destructive",
              "transition-colors duration-150 hover:bg-destructive/5",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {loggingOut ? (
              <Loader2 className="size-4 shrink-0 animate-spin" />
            ) : (
              <LogOut className="size-4 shrink-0" />
            )}
            {loggingOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      )}
    </div>
  );
}

function Topbar() {
  const { toggleOpen } = useSidebar();
  const { actions } = usePageActions();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-5 shadow-sm">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleOpen}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="size-5" />
      </Button>

      <div className="flex-1" />

      {actions && <div className="flex items-center gap-2">{actions}</div>}

      <Button variant="ghost" size="icon-sm" aria-label="Notificações">
        <Bell className="size-5" />
      </Button>

      <UserMenu />
    </header>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <PageActionsProvider>
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-[#A8DFF5]/10 p-6">
            <Outlet />
          </main>
        </div>
      </PageActionsProvider>
    </SidebarProvider>
  );
}
