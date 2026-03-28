import { CalendarDays, CreditCard, LayoutDashboard, Users } from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";
import logo from "@/assets/logo_odonto_sem_bg.png";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Pacientes", href: "/dashboard/pacientes", icon: Users },
  { title: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
  { title: "Pagamentos", href: "/dashboard/pagamentos", icon: CreditCard },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="Borges Odontologia"
            className={`object-contain transition-all duration-200 ${open ? "h-20 w-auto" : "h-12 w-auto"}`}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/")}
                tooltip={item.title}
              >
                <NavLink to={item.href}>
                  <item.icon className="size-4 shrink-0" />
                  {open && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
