import Link from "next/link";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-heading text-2xl font-bold"
        >
          <span className="text-primary">Lock</span>In
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
