import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function toPathname(urlOrPath: string | undefined, defaultPath: string): string {
  if (!urlOrPath) return defaultPath;
  try {
    return new URL(urlOrPath, "http://localhost").pathname || defaultPath;
  } catch {
    return urlOrPath;
  }
}

const signInPath = toPathname(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL, "/sign-in");
const signUpPath = toPathname(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL, "/sign-up");

function isExactOrChildPath(pathname: string, basePath: string): boolean {
  const normalizedBase =
    basePath.endsWith("/") && basePath.length > 1
      ? basePath.slice(0, -1)
      : basePath;
  return pathname === normalizedBase || pathname.startsWith(`${normalizedBase}/`);
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublicRoute =
    isExactOrChildPath(pathname, signInPath) ||
    isExactOrChildPath(pathname, signUpPath);

  if (!isPublicRoute) {
    if (pathname.startsWith("/api/")) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return;
    }

    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
