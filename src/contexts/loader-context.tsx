"use client";
import { createContext, useContext, useState, useMemo, useCallback } from "react";

interface LoaderContextType {
  show: boolean;
  setShow: (show: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [show, setShowState] = useState(false);

  const setShow = useCallback((value: boolean) => {
    setShowState(value);
  }, []);

  const value = useMemo(
    () => ({
      show,
      setShow,
    }),
    [show, setShow]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
} 