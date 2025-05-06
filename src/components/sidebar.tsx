"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
        <div className="flex items-center">
          {!isCollapsed && (
            <Image
              src="/logo.png"
              alt="Logo"
              height={40}
              width={200}
              style={{ objectFit: "contain", maxWidth: 160, height: 40 }}
              priority
            />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800",
            isCollapsed && "justify-center",
          )}
          onClick={() => signOut()}
        >
          <LogOutIcon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "flex h-full flex-col fixed left-0 top-0 bottom-0 bg-gray-900 text-white transition-all duration-300 z-30",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-40 lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-gray-900 border-r border-gray-800"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
