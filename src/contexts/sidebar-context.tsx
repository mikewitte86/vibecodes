"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsedState] = useState<boolean | undefined>(
    undefined,
  );
  const pathname = usePathname();

  const initializeSidebar = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 1024) {
      const stored = localStorage.getItem("sidebar-collapsed");
      setIsCollapsedState(stored === null ? false : stored === "true");
    } else {
      setIsCollapsedState(true);
    }
  }, []);

  useEffect(() => {
    initializeSidebar();
  }, [initializeSidebar]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 1024 && isCollapsed !== undefined) {
      localStorage.setItem("sidebar-collapsed", String(isCollapsed));
    }
  }, [isCollapsed]);

  const setIsCollapsed = useCallback((value: boolean) => {
    setIsCollapsedState(value);
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      localStorage.setItem("sidebar-collapsed", String(value));
    }
  }, []);

  const value = useMemo(
    () => ({
      isCollapsed: isCollapsed as boolean,
      setIsCollapsed,
    }),
    [isCollapsed, setIsCollapsed]
  );

  if (isCollapsed === undefined && pathname && pathname.startsWith("/auth")) {
    return (
      <div className="flex h-full flex-col fixed left-0 top-0 bottom-0 bg-gray-900 text-white transition-all duration-300 z-30 overflow-hidden w-16" />
    );
  }

  if (isCollapsed === undefined) return null;

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
