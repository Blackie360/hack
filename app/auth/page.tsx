import { Suspense } from "react";
import { AuthPage } from "@/components/auth-page";

interface AuthPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function Auth({ searchParams }: AuthPageProps) {
  const { redirect } = await searchParams;

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthPage redirectTo={redirect || "/dashboard"} />
        </Suspense>
      </div>
    </div>
  );
}
