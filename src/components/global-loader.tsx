"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function GlobalLoader() {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setShouldRender(false), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <Image
        src="/logoBlue.png"
        alt="Logo"
        width={180}
        height={180}
        className="animate-pulse"
        priority
      />
    </div>
  );
}
