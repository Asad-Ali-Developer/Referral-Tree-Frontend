"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { referralsService } from "@/services/referrals.service";

interface JoinFormProps {
  referralCode: string;
  schoolId: string;
}

export default function JoinForm({ referralCode, schoolId }: JoinFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      referralCode: referralCode,
    };

    try {
      // Submits to POST /schools/:schoolId/referrals
      await referralsService.createReferral(schoolId, payload);
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-stone-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl">
          Create your account
        </CardTitle>
        <CardDescription>
          Enter your details below. You will set your own password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral Code</Label>
            <Input
              id="referralCode"
              value={referralCode}
              readOnly
              className="bg-stone-100 font-mono text-sm text-stone-700 border-stone-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-stone-900 text-stone-50 hover:bg-stone-800"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
