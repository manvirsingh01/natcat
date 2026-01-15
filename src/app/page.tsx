import Link from "next/link";
import { ArrowRight, Shield, Terminal as TerminalIcon, Zap } from "lucide-react";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b border-border bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Master the Swiss Army Knife of Networking
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Learn Netcat commands, practice in our secure simulator, and level up your networking skills.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/cheatsheet"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  View Cheatsheet
                </Link>
                <Link
                  href="/simulator"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Try Simulator
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <TerminalIcon className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Interactive Simulator</h2>
              <p className="text-muted-foreground">
                Practice commands in a safe, sandboxed environment right in your browser.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Quick Cheatsheet</h2>
              <p className="text-muted-foreground">
                Instant access to common flags and command patterns for rapid reference.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Security Focused</h2>
              <p className="text-muted-foreground">
                Learn how to use Netcat for security auditing, debugging, and data transfer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
