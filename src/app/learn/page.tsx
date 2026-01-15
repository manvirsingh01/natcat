import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tutorials = [
    {
        title: "What is Netcat?",
        description: "Understand the history and purpose of the 'Swiss Army Knife' of networking.",
        slug: "intro"
    },
    {
        title: "Port Scanning Basics",
        description: "Learn how to discover open ports on a target system using Netcat.",
        slug: "port-scanning"
    },
    {
        title: "File Transfer",
        description: "Move files between computers easily without FTP or SCP.",
        slug: "file-transfer"
    },
    {
        title: "Simple Chat Server",
        description: "Create a quick text chat between two machines.",
        slug: "chat-server"
    }
];

export default function LearnPage() {
    return (
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary mb-4">
                    Learn Netcat
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    Step-by-step tutorials to master networking concepts.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tutorials.map((tutorial, idx) => (
                    <div key={idx} className="group relative rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {tutorial.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {tutorial.description}
                        </p>
                        <div className="flex items-center text-sm font-medium text-primary">
                            Read Tutorial <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                        <Link href={`/learn/${tutorial.slug}`} className="absolute inset-0">
                            <span className="sr-only">Read {tutorial.title}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
