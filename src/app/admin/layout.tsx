'use client';
import type { ReactNode } from "react";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, isAdmin, isUserLoading, router]);

  if (isUserLoading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

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
