import { Brain, FileText, Share2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-base text-copy-primary">
      {/* Left panel: visible on large screens */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden border-r border-surface-border bg-surface/30 p-12 lg:p-16 xl:p-20">
        {/* Ambient brand color illumination for visual differentiation from pure dark base */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 left-12 h-80 w-80 rounded-full bg-brand/5 blur-[120px]" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-base shadow-[0_0_12px_rgba(0,200,212,0.35)]">
            G
          </div>
          <span className="text-sm font-semibold tracking-wide text-copy-primary">
            Ghost AI
          </span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 my-auto max-w-xl space-y-8 py-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-copy-primary leading-[1.15]">
              Design systems at the<br />speed of thought.
            </h1>
            <p className="text-base text-copy-secondary leading-relaxed max-w-lg">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          {/* Feature list matching screenshot */}
          <div className="space-y-6 pt-2">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 border border-brand/25 text-brand shadow-[0_0_15px_rgba(0,200,212,0.1)]">
                <Brain className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-copy-primary">
                  AI Architecture Generation
                </h3>
                <p className="text-xs lg:text-sm text-copy-muted leading-relaxed max-w-md">
                  Describe your system, AI maps it to nodes and edges on a live canvas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 border border-brand/25 text-brand shadow-[0_0_15px_rgba(0,200,212,0.1)]">
                <Share2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-copy-primary">
                  Real-time Collaboration
                </h3>
                <p className="text-xs lg:text-sm text-copy-muted leading-relaxed max-w-md">
                  Live cursors, presence indicators, and shared node editing across your team.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 border border-brand/25 text-brand shadow-[0_0_15px_rgba(0,200,212,0.1)]">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-copy-primary">
                  Instant Spec Generation
                </h3>
                <p className="text-xs lg:text-sm text-copy-muted leading-relaxed max-w-md">
                  Export a complete Markdown technical spec directly from the canvas graph.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacer to keep balance */}
        <div className="relative z-10 h-6" />
      </div>

      {/* Right panel: centered Clerk form (form only on small screens) */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="flex w-full max-w-md justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
