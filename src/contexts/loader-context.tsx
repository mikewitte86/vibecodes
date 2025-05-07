"use client";
import { createContext, useContext, useState } from "react";

const LoaderContext = createContext<{
  show: boolean;
  setShow: (show: boolean) => void;
}>({
  show: false,
  setShow: () => {},
});

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <LoaderContext.Provider value={{ show, setShow }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
} 