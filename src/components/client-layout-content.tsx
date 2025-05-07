"use client";
import { ReactNode } from "react";
import { useLoader } from "@/contexts/loader-context";
import { GlobalLoader } from "@/components/global-loader";

export default function ClientLayoutContent({ children }: { children: ReactNode }) {
  const { show } = useLoader();
  return (
    <>
      {show && <GlobalLoader />}
      {children}
    </>
  );
} 