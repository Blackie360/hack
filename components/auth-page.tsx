"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupForm } from "@/components/forms/signup-form";
import { LoginForm } from "@/components/forms/login-form";

interface AuthPageProps {
  redirectTo: string;
}

export function AuthPage({ redirectTo }: AuthPageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome
        </h1>
        <p className="text-muted-foreground mt-2">
          Sign in or create an account to continue
        </p>
      </div>

      <Tabs defaultValue="signup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Create Account</TabsTrigger>
          <TabsTrigger value="login">Sign In</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <SignupForm redirectTo={redirectTo} />
        </TabsContent>

        <TabsContent value="login">
          <LoginForm redirectTo={redirectTo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
