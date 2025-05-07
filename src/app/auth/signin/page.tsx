"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useLoader } from "@/contexts/loader-context";
import Image from "next/image";

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const { setShow } = useLoader();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [showLocalLoader, setShowLocalLoader] = useState(false);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (showLocalLoader) {
      setShow(true);
      timer = setTimeout(() => setShow(false), 2000);
    }
    return () => timer && clearTimeout(timer);
  }, [showLocalLoader, setShow]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShow(false);
    }
  }, [isLoading, isAuthenticated, setShow]);

  const onSubmit = async (data: SignInFormData) => {
    setShowLocalLoader(true);
    try {
      await signIn(data.username, data.password);
    } catch (error: unknown) {
      setShowLocalLoader(false);
      setShow(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign in";
      setError("root", {
        message: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px] pt-6">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center mb-2">
            <Image
              src="/logoBlue.png"
              alt="Logo"
              width={180}
              height={80}
              className="mb-2"
              priority
            />
          </div>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="username"
                    type="text"
                    aria-invalid={!!errors.username}
                  />
                )}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={!!errors.password}
                  />
                )}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {errors.root && (
              <div className="text-sm text-red-500">{errors.root.message}</div>
            )}
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
