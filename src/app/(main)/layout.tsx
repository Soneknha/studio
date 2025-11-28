'use client';
import type { ReactNode } from "react";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return; // Wait until user status is resolved

    if (!user) {
      router.push('/login');
    }
    
  }, [user, isUserLoading, router]);

  // Show loading skeleton while checking auth
  if (isUserLoading) {
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
  
  // Render main layout for authenticated users
  if(user){
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

  // Fallback for any other case (shouldn't be reached in normal flow)
  return null; 
}
