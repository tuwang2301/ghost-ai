import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/auth-layout";

export const instant = false;

export default function SignUpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SignUp fallbackRedirectUrl="/editor" />
      </Suspense>
    </AuthLayout>
  );
}
