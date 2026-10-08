import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Collaborative system design workspace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "var(--accent-primary)",
          colorPrimaryForeground: "var(--bg-base)",
          colorBackground: "var(--bg-surface)",
          colorInput: "var(--bg-subtle)",
          colorInputForeground: "var(--text-primary)",
          colorForeground: "var(--text-primary)",
          colorNeutral: "var(--text-primary)",
          colorMutedForeground: "var(--text-muted)",
          colorBorder: "var(--border-default)",
          colorRing: "var(--accent-primary)",
          colorDanger: "var(--state-error)",
          colorSuccess: "var(--state-success)",
          colorWarning: "var(--state-warning)",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          card: "border border-surface-border bg-surface shadow-2xl rounded-2xl",
          headerTitle: "text-copy-primary font-semibold text-lg",
          headerSubtitle: "text-copy-muted text-sm",
          socialButtonsBlockButton:
            "border border-surface-border bg-subtle hover:bg-elevated text-copy-primary rounded-xl transition-colors",
          formButtonPrimary:
            "bg-brand text-base hover:bg-brand/90 font-medium rounded-xl shadow-sm transition-colors py-2.5",
          formFieldInput:
            "border border-surface-border bg-subtle text-copy-primary focus:border-brand rounded-xl",
          formFieldLabel: "text-copy-primary text-sm font-medium",
          footerActionLink: "text-brand hover:underline font-medium",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      >
        <body className="min-h-full flex flex-col bg-base text-copy-primary">
          {children}
        </body>
      </html>

    </ClerkProvider>
  );
}

