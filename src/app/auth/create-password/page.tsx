"use client";

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

const createPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

export default function CreatePassword() {
  const { setShow } = useLoader();
  const [showLocalLoader, setShowLocalLoader] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (showLocalLoader) {
      setShow(true);
      timer = setTimeout(() => setShow(false), 2000);
    }
    return () => timer && clearTimeout(timer);
  }, [showLocalLoader, setShow]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: CreatePasswordFormData) => {
    setShowLocalLoader(true);
    try {
      console.log("Password update data:", data);
      setShowLocalLoader(false);
    } catch (error: unknown) {
      setShowLocalLoader(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
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
          <CardTitle>Create New Password</CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="newPassword"
                    type="password"
                    aria-invalid={!!errors.newPassword}
                  />
                )}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    aria-invalid={!!errors.confirmPassword}
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {errors.root && (
              <div className="text-sm text-red-500">{errors.root.message}</div>
            )}
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
