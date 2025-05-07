import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { ContentWrapper } from "@/components/content-wrapper";
import { LoaderProvider } from "@/contexts/loader-context";
import ClientLayoutContent from "@/components/client-layout-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Avenger",
  description: "Next.js application with AWS Amplify authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoaderProvider>
          <ClientLayoutContent>
            <Providers>
              <SidebarProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <main className="flex-1">
                    <ContentWrapper>
                      <div className="container max-w-none">{children}</div>
                    </ContentWrapper>
                  </main>
                </div>
              </SidebarProvider>
            </Providers>
          </ClientLayoutContent>
        </LoaderProvider>
      </body>
    </html>
  );
}
