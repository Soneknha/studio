"use client"

import {
  LayoutDashboard,
  Megaphone,
  CalendarCheck,
  ShieldAlert,
  MessagesSquare,
  Folder,
  Users,
  Settings,
  Building,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/announcements", label: "Avisos", icon: Megaphone },
  { href: "/reservations", label: "Reservas", icon: CalendarCheck },
  { href: "/incidents", label: "Ocorrências", icon: ShieldAlert },
  { href: "/chat", label: "Chat", icon: MessagesSquare },
  { href: "/documents", label: "Documentos", icon: Folder },
  { href: "/residents", label: "Moradores", icon: Users },
];

const settingsItem = { href: "/settings", label: "Configurações", icon: Settings };

export function SidebarNav() {
  const pathname = usePathname()

  const isExactlyDashboard = pathname === '/dashboard';
  const checkActive = (href: string) => {
    if (href === '/dashboard') return isExactlyDashboard;
    return pathname.startsWith(href) && href !== '/';
  }

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:-ml-0.5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Building className="size-7 text-primary shrink-0" />
          <span className="font-semibold text-lg font-headline text-sidebar-foreground group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">
            CondoConnect
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  as={Link}
                  href={item.href}
                  isActive={checkActive(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="my-1 bg-sidebar-border" />
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                  as={Link}
                  href={settingsItem.href}
                  isActive={pathname.startsWith(settingsItem.href)}
                  tooltip={settingsItem.label}
                >
                  <settingsItem.icon />
                  <span>{settingsItem.label}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
