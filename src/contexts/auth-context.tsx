"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useLoader } from "@/contexts/loader-context";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, callbackUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  }>({
    isAuthenticated: true, // Set to true by default for now
    isLoading: false,
    user: {
      id: "1",
      email: "user@example.com",
      name: "Test User"
    },
  });

  const router = useRouter();
  const pathname = usePathname();
  const { setShow } = useLoader();

  const initAuth = useCallback(async () => {
    try {
      const token = Cookies.get("auth-token");
      
      // For development, always consider authenticated
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: "1",
          email: "user@example.com",
          name: "Test User"
        },
      });

    } catch (error) {
      console.error("Auth initialization error:", error);
      setState({
        isAuthenticated: true, // Keep authenticated for development
        isLoading: false,
        user: {
          id: "1",
          email: "user@example.com",
          name: "Test User"
        },
      });
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const signIn = useCallback(async (email: string, password: string, callbackUrl: string = "/") => {
    try {
      const mockUser = {
        id: "1",
        email,
        name: "Test User"
      };

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
      });
      
      Cookies.set("auth-token", "mock-token", { expires: 7 });
      router.push(callbackUrl);
    } catch (error) {
      throw error;
    }
  }, [router]);

  const signOut = useCallback(async () => {
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    Cookies.remove("auth-token");
    router.push("/auth/signin");
  }, [router]);

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
    }),
    [state, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
