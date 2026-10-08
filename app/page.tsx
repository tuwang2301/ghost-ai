import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const instant = false;

export default async function HomePage() {

  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect("/editor");
  }

  redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");
}
