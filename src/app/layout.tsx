import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { ContentWrapper } from "@/components/content-wrapper";

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
        <Providers>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">
                <ContentWrapper>
                  <div className="container mx-auto px-4 py-8">
                    {children}
                  </div>
                </ContentWrapper>
              </main>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
