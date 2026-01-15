import Link from 'next/link';
import { Terminal, BookOpen, Code } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Terminal className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block text-primary">
                            Netcat.sh
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/cheatsheet"
                            className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-primary"
                        >
                            Cheatsheet
                        </Link>
                        <Link
                            href="/simulator"
                            className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-primary"
                        >
                            Simulator
                        </Link>
                        <Link
                            href="/learn"
                            className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-primary"
                        >
                            Learn
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other controls could go here */}
                    </div>
                    <nav className="flex items-center">
                        <Link
                            href="https://github.com/manvirsingh/natcat" // Placeholder repo
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                <Code className="h-5 w-5" />
                                <span>Source</span>
                            </div>
                        </Link>
                    </nav>
                </div>
            </div>
        </nav>
    );
}
