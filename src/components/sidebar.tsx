"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  UsersIcon,
  FileText,
  RefreshCcw,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { name: "Companies", href: "/companies", icon: UsersIcon },
  { name: "Policies", href: "/policies", icon: FileText },
  { name: "Next 90 Renewals", href: "/renewals", icon: RefreshCcw },
  { name: "New Business", href: "/new-business", icon: TrendingUp },
  { name: "Invoices", href: "/invoices", icon: FileSpreadsheet },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between gap-4 px-4 border-b border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center pl-1">
            <Image
              src="/logo.png"
              alt="Logo"
              height={40}
              width={200}
              style={{ objectFit: "contain", maxWidth: 160, height: 40 }}
              priority
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="flex-1 space-y-2 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                "flex items-center justify-start gap-3 rounded-lg px-3 h-9 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-3 space-y-2">
        <div
          className={twMerge(
            "flex items-center gap-3 px-1 py-2 text-sm text-gray-400",
            isCollapsed && "justify-center px-0",
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-gray-800">
            <UserIcon className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className="truncate">
              {user?.signInDetails?.loginId || "User"}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          className={twMerge(
            "w-full cursor-pointer justify-start text-gray-400 hover:text-white hover:bg-gray-800",
            isCollapsed && "justify-center",
          )}
          onClick={() => signOut()}
        >
          <LogOutIcon className={twMerge("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div
        className={twMerge(
          "flex h-full flex-col fixed left-0 top-0 bottom-0 bg-gray-900 text-white transition-all duration-300 z-30 overflow-hidden",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
