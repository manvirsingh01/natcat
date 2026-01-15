"use client";

import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandCardProps {
    command: string;
    description: string;
    category?: string;
    className?: string;
}

export default function CommandCard({ command, description, category, className }: CommandCardProps) {
    return (
        <div className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-sm", className)}>
            <div className="p-6 pt-0 mt-6">
                <div className="flex items-center justify-between mb-2">
                    {category && (
                        <span className="text-xs font-semibold text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                            {category}
                        </span>
                    )}
                    <button
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Copy command"
                        onClick={() => navigator.clipboard.writeText(command)}
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                </div>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary block mb-2 overflow-x-auto">
                    {command}
                </code>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}
