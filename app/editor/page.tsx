import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export const instant = false;

export default async function EditorPage() {

  await auth.protect();

  return (
    <main className="min-h-screen bg-base px-6 py-12 text-copy-primary">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-surface-border bg-surface px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-copy-muted">Design system</p>
              <h1 className="text-xl font-semibold text-copy-primary">Ghost AI workspace</h1>
            </div>
          </div>
          <Button variant="outline">Preview</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border border-surface-border bg-surface">
            <CardHeader>
              <CardTitle>System brief</CardTitle>
              <CardDescription>Shared design tokens for the real-time architecture workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button className="w-full">Primary action</Button>
                <Button variant="secondary" className="w-full">Secondary</Button>
              </div>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 border border-surface-border bg-subtle">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="canvas">Canvas</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-4">
                  <div className="space-y-3">
                    <Input placeholder="Project name" defaultValue="Market-ops architecture" />
                    <Textarea placeholder="Describe the system" defaultValue="User prompt, ingestion pipeline, data services, and AI-assisted review flow." />
                  </div>
                </TabsContent>
                <TabsContent value="canvas" className="pt-4">
                  <ScrollArea className="h-32 rounded-2xl border border-surface-border bg-subtle p-3">
                    <ul className="space-y-2 text-sm text-copy-secondary">
                      <li>• User flow orchestrator</li>
                      <li>• Shared canvas workspace</li>
                      <li>• Event-driven processing layer</li>
                      <li>• Generated markdown spec</li>
                    </ul>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border border-surface-border bg-surface">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Core workspace primitives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="outline" className="w-full" />
                  }
                >
                  Open dialog
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate architecture</DialogTitle>
                    <DialogDescription>
                      Start an AI-assisted layout for the next system design.
                    </DialogDescription>
                  </DialogHeader>
                  <Input placeholder="Describe the architecture" />
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Generate</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" className="w-full justify-center">View starter templates</Button>
              <Button variant="secondary" className="w-full justify-center">Sync collaborators</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
