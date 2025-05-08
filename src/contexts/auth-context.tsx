"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  AuthUser,
} from "aws-amplify/auth";
import { useRouter, usePathname } from "next/navigation";
import { configureAmplify } from "@/lib/amplify";
import Cookies from "js-cookie";
import { useLoader } from "@/contexts/loader-context";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AuthUser | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const router = useRouter();
  const pathname = usePathname();
  const { setShow } = useLoader();

  useEffect(() => {
    if (state.isLoading && pathname !== "/auth/signin") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [state.isLoading, pathname, setShow]);

  const initAuth = useCallback(async () => {
    try {
      configureAmplify();
      const currentUser = await getCurrentUser();
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: currentUser,
      });
      Cookies.set("auth-token", "true", { expires: 7 });
    } catch {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      Cookies.remove("auth-token");
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      await amplifySignIn({ username, password });
      const currentUser = await getCurrentUser();
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: currentUser,
      });
      Cookies.set("auth-token", "true", { expires: 7 });
      router.push("/");
    } catch (error) {
      throw error;
    }
  }, [router]);

  const signOut = useCallback(async () => {
    try {
      await amplifySignOut();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      Cookies.remove("auth-token");
      router.push("/auth/signin");
    } catch (error) {
      throw error;
    }
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
