"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { ContentWrapper } from "@/components/content-wrapper";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show sidebar on auth pages
  if (pathname.startsWith("/auth")) {
    return children;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <ContentWrapper>
          <div className="container max-w-none">{children}</div>
        </ContentWrapper>
      </main>
    </div>
  );
} 