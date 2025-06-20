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
  UserIcon,
  UsersIcon,
  FileText,
  Shield,
  Upload,
  FilePlus,
  UserPlus,
  CalendarCheck,
  DollarSign,
  Building2,
  Briefcase,
} from "lucide-react";
import Image from "next/image";

const navigationSections = [
  {
    label: "Agency Operations",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
      { name: "Clients", href: "/clients", icon: Building2 },
      { name: "Policies", href: "/policies", icon: FileText },
      { name: "Invoices", href: "/invoices", icon: DollarSign },
      { name: "Applications", href: "/applications", icon: Briefcase },
    ],
  },
  {
    label: "Agency Workflows",
    items: [
      { name: "Task Board", href: "/tasks", icon: CalendarCheck },
      { name: "New Policy", href: "/new-policy", icon: FilePlus },
      { name: "New Contact", href: "/new-contact", icon: UserPlus },
      { name: "Upload Document", href: "/upload-document", icon: Upload },
    ],
  },
  {
    label: "Administration",
    items: [
      { name: "User Management", href: "/user-management", icon: UsersIcon },
      { name: "Roles & Permissions", href: "/roles-permissions", icon: Shield },
    ],
  },
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
      <div className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 border-b border-gray-800">
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
      <nav
        className={cn(
          "flex-1 space-y-5 px-3 py-4 overflow-y-auto",
          isCollapsed && "space-y-7",
        )}
      >
        {navigationSections.map((section) => (
          <div key={section.label}>
            {!isCollapsed && (
              <div className="text-xs font-semibold uppercase text-gray-400 mb-2 px-2 tracking-widest">
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center flex-nowrap mb-1 justify-start gap-3 rounded-lg px-3 h-9 py-2 text-sm font-medium transition-colors",
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
          </div>
        ))}
      </nav>
      <div className="border-t border-gray-800 p-3 space-y-2">
        <div
          className={cn(
            "flex items-center gap-3 px-1 py-2 text-sm text-gray-400",
            isCollapsed && "justify-center px-0",
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-gray-800">
            <UserIcon className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className="truncate">
              {user?.name || "User"}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full cursor-pointer justify-start text-gray-400 hover:text-white hover:bg-gray-800",
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
      <div
        className={cn(
          "flex h-full flex-col fixed left-0 top-0 bottom-0 bg-gray-900 text-white transition-all duration-300 z-30 overflow-hidden",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
