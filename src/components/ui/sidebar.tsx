import * as React from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type SidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleOpen: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>")
  return ctx
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

type SidebarProviderProps = {
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function SidebarProvider({
  defaultOpen = true,
  children,
  className,
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const toggleOpen = React.useCallback(() => setOpen((v) => !v), [])

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleOpen }}>
      <div
        data-slot="sidebar-wrapper"
        className={cn("flex min-h-screen w-full", className)}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

type SidebarProps = React.ComponentPropsWithoutRef<"aside">

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { open } = useSidebar()

  return (
    <aside
      data-slot="sidebar"
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "relative flex h-screen flex-col overflow-hidden border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Sidebar structural parts
// ---------------------------------------------------------------------------

export function SidebarHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 border-b p-4", className)}
      {...props}
    />
  )
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex flex-1 flex-col gap-1 overflow-y-auto p-2", className)}
      {...props}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex flex-col gap-2 border-t p-4", className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Menu primitives
// ---------------------------------------------------------------------------

export function SidebarMenu({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  )
}

export function SidebarMenuItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// SidebarMenuButton — asChild pattern via Slot-like approach
// ---------------------------------------------------------------------------

type SidebarMenuButtonProps = {
  isActive?: boolean
  asChild?: boolean
  tooltip?: string
  className?: string
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<"button">

export function SidebarMenuButton({
  isActive = false,
  asChild = false,
  tooltip,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { open } = useSidebar()

  const classes = cn(
    "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[0.9rem] font-medium transition-all duration-200",
    "text-sidebar-foreground/60 hover:bg-sidebar-hover/20 hover:text-sidebar-foreground",
    isActive && "bg-sidebar-hover/30 text-sidebar-foreground font-semibold",
    !open && "justify-center px-2",
    className,
  )

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; title?: string }>
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
      ...(!open && tooltip ? { title: tooltip } : {}),
    })
  }

  return (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      title={!open ? tooltip : undefined}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}
