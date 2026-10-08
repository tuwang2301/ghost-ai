import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/auth-layout";

export const instant = false;

export default function SignInPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SignIn fallbackRedirectUrl="/editor" />
      </Suspense>
    </AuthLayout>
  );
}
