import type { ReactNode } from "react";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <MainHeader />
        <main className="p-4 sm:p-6 lg:p-8 bg-muted/20 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
