"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { pingHost, digHost, whoisHost, nmapHost, curlUrl } from '@/app/actions';
import { VirtualFileSystem } from '@/lib/vfs';
import { PackageManager } from '@/lib/pkg';
import figlet from 'figlet';

interface TerminalLine {
    type: 'input' | 'output';
    content: string;
    cwd?: string;
}

export default function Terminal() {
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'output', content: 'Welcome to Netcat Simulator v2.0.0' },
        { type: 'output', content: 'Type "help" to see available commands.' },
    ]);
    const [input, setInput] = useState('');
    const vfs = useMemo(() => new VirtualFileSystem(), []); // Persist VFS instance
    const pkgMgr = useMemo(() => new PackageManager(), []); // Persist Package Manager
    const [npmPackages, setNpmPackages] = useState<Set<string>>(new Set()); // Track installed npm packages
    const [cwd, setCwd] = useState(vfs.pwd()); // Track current working directory for display
    const [sudoState, setSudoState] = useState<{ pendingCommand: string | null }>({ pendingCommand: null }); // Track sudo state

    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleCommand = async (cmd: string) => {
        const trimmedCmd = cmd.trim();

        // Handle password input for sudo
        if (sudoState.pendingCommand !== null) {
            // We don't actually check the password for this sim, just accept anything
            // But we shouldn't log the password to history if we want to be realistic?
            // For simplicity, we'll just log a placeholder or nothing.
            // Let's log nothing for the password line to simulate "no echo"

            // Execute the pending command
            const commandToRun = sudoState.pendingCommand;
            setSudoState({ pendingCommand: null }); // Clear state

            // Recursive call to handle the actual command
            // We need to add it to history as if it was run? 
            // Actually, usually sudo runs it and shows output.
            // Let's just call handleCommand again with the pending command, 
            // BUT we need to be careful about infinite loops if logic is wrong.
            // We also need to avoid adding the password to history.

            // Better approach: Reset state, then process the command string directly below
            // but we need to bypass the "add to history" part for the password itself?
            // Or just treat the password input as a separate event.

            // Let's do this:
            // 1. User types password.
            // 2. We don't add password to history (or add masked).
            // 3. We run the pending command.

            // Since this function adds to history at the top, we need to refactor slightly or return early.
            // Let's return early if we are handling password.

            // Wait, the `cmd` here IS the password.
            // We'll just ignore the content of `cmd` (the password).

            setHistory(prev => [...prev, { type: 'input', content: '' } as TerminalLine]); // Empty line for password input

            // Now run the actual command
            // We need to extract the logic below into a reusable function or just recurse.
            // Recursing is easiest but we need to make sure we don't loop.
            // The pendingCommand is the actual command string e.g. "pkg install curl"
            await processCommand(commandToRun);
            return;
        }

        const newHistory = [...history, { type: 'input', content: trimmedCmd, cwd: cwd } as TerminalLine];
        setHistory(newHistory); // Update history immediately with input

        await processCommand(trimmedCmd);
    };

    const processCommand = async (cmd: string) => {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) return;

        const args = trimmedCmd.split(' ');
        const command = args[0];
        let output = '';

        switch (command) {
            case 'help':
                output = 'Available commands: help, clear, nc, echo, whoami, ls, cd, pwd, mkdir, touch, cat, rm, ping, dig, whois, nmap, pkg, curl, npm, cowsay, figlet, sudo';
                break;
            case 'sudo':
                if (args.length < 2) {
                    output = 'usage: sudo [command]';
                } else {
                    const commandToRun = args.slice(1).join(' ');
                    setSudoState({ pendingCommand: commandToRun });
                    output = `[sudo] password for user:`;
                    // We want this output to appear, and then the next input to be the password.
                    // The input field type needs to change? 
                    // For now, let's just let them type it.
                }
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'ls':
                output = vfs.ls(args[1]);
                break;
            case 'cd':
                output = vfs.cd(args[1]);
                setCwd(vfs.pwd());
                break;
            case 'pwd':
                output = vfs.pwd();
                break;
            case 'mkdir':
                output = args[1] ? vfs.mkdir(args[1]) : 'mkdir: missing operand';
                break;
            case 'touch':
                output = args[1] ? vfs.touch(args[1]) : 'touch: missing operand';
                break;
            case 'cat':
                output = args[1] ? vfs.cat(args[1]) : 'cat: missing operand';
                break;
            case 'rm':
                output = args[1] ? vfs.rm(args[1]) : 'rm: missing operand';
                break;
            case 'dig':
                if (args.length < 2) {
                    output = 'usage: dig [domain]';
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: `Querying ${args[1]}...` }]);
                    try {
                        const result = await digHost(args[1]);
                        output = result;
                    } catch (err) {
                        output = 'Error executing dig.';
                    }
                }
                break;
            case 'whois':
                if (args.length < 2) {
                    output = 'usage: whois [domain]';
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: `Querying whois for ${args[1]}...` }]);
                    try {
                        const result = await whoisHost(args[1]);
                        output = result;
                    } catch (err) {
                        output = 'Error executing whois.';
                    }
                }
                break;
            case 'nmap':
                if (args.length < 2) {
                    output = 'usage: nmap [flags] [target]';
                } else {
                    const nmapArgs = args.slice(1).join(' ');
                    setHistory(prev => [...prev, { type: 'output', content: `Starting Nmap scan on ${nmapArgs}...` }]);
                    try {
                        const result = await nmapHost(nmapArgs);
                        output = result;
                    } catch (err) {
                        output = 'Error executing nmap.';
                    }
                }
                break;
            case 'pkg':
                if (args.length < 2) {
                    output = 'usage: pkg [install|list] [package]';
                } else {
                    const subCmd = args[1];
                    if (subCmd === 'list') {
                        const pkgs = pkgMgr.list();
                        output = pkgs.length > 0 ? `Installed packages:\n${pkgs.join('\n')}` : 'No packages installed.';
                    } else if (subCmd === 'install') {
                        const pkgName = args[2];
                        if (!pkgName) {
                            output = 'pkg install: missing package name';
                        } else if (pkgMgr.isInstalled(pkgName)) {
                            output = `pkg: ${pkgName} is already installed.`;
                        } else if (!pkgMgr.isAvailable(pkgName)) {
                            output = `pkg: package '${pkgName}' not found in repositories.`;
                        } else {
                            // Simulate installation
                            setHistory(prev => [...prev, { type: 'output', content: `Downloading ${pkgName}...` }]);
                            // We can't easily do a real delay in this sync flow without refactoring, 
                            // but we can just pretend it happened instantly or use a timeout effect (too complex for now).
                            // Let's just install it.
                            pkgMgr.install(pkgName);
                            output = `Successfully installed ${pkgName}.`;
                        }
                    } else {
                        output = `pkg: unknown subcommand '${subCmd}'`;
                    }
                }
                break;
            case 'curl':
                if (!pkgMgr.isInstalled('curl')) {
                    output = "Command 'curl' not found. Install it with: pkg install curl";
                } else if (args.length < 2) {
                    output = 'usage: curl [url]';
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: `Fetching ${args[1]}...` }]);
                    try {
                        const result = await curlUrl(args[1]);
                        output = result;
                    } catch (err) {
                        output = 'Error executing curl.';
                    }
                }
                break;
            case 'npm':
                if (!pkgMgr.isInstalled('npm')) {
                    output = "Command 'npm' not found. Install it with: pkg install npm";
                } else if (args.length < 3 || args[1] !== 'install') {
                    output = 'usage: npm install <package>';
                } else {
                    const pkgName = args[2];
                    const supportedNpmPkgs = ['cowsay', 'figlet'];

                    setHistory(prev => [...prev, { type: 'output', content: `npm: installing ${pkgName}...` }]);

                    if (supportedNpmPkgs.includes(pkgName)) {
                        setNpmPackages(prev => new Set(prev).add(pkgName));
                        output = `+ ${pkgName}@1.0.0\nadded 1 package in 0.5s`;
                    } else {
                        // Fake install for others
                        output = `+ ${pkgName}@latest\nadded 1 package in 0.5s\n(Note: This package is installed but cannot be executed in this simulator)`;
                    }
                }
                break;
            case 'cowsay':
                if (!npmPackages.has('cowsay')) {
                    output = "Command 'cowsay' not found. Install it with: npm install cowsay";
                } else {
                    const text = args.slice(1).join(' ') || 'Moo!';
                    output = `
 __________________
< ${text} >
 ------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
                     `;
                }
                break;
            case 'figlet':
                if (!npmPackages.has('figlet')) {
                    output = "Command 'figlet' not found. Install it with: npm install figlet";
                } else {
                    const text = args.slice(1).join(' ') || 'Hello';
                    // figlet is async usually, but the lib might be sync or we need to handle it
                    // figlet.text is async by default in some versions, let's check usage
                    // We'll use a simple promise wrapper if needed, or just try sync if available
                    // For simplicity in this environment, let's assume we can get it working or mock it if the lib is complex
                    // Actually figlet-js (npm figlet) is async.

                    // We need to handle async output for figlet
                    figlet(text, (err, data) => {
                        if (err) {
                            setHistory(prev => [...prev, { type: 'output', content: 'Error generating ASCII art' }]);
                            return;
                        }
                        if (data) {
                            setHistory(prev => [...prev, { type: 'output', content: data }]);
                        }
                    });
                    return; // Return early as we handle output async
                }
                break;
            case 'ping':
                if (args.length < 2) {
                    output = 'usage: ping [host]';
                } else {
                    // Show a loading message or just wait
                    const host = args[1];
                    setHistory(prev => [...prev, { type: 'output', content: `Pinging ${host}...` }]);
                    try {
                        const result = await pingHost(host);
                        output = result;
                    } catch (err) {
                        output = 'Error executing ping.';
                    }
                }
                break;
            case 'nc':
                if (args.includes('-h') || args.length === 1) {
                    output = `OpenBSD netcat (Debian patch); -h for help
usage: nc [-46CDdFhklNnrStUuvZz] [-I length] [-i interval] [-M ttl]
          [-m minttl] [-O length] [-P proxy_username] [-p source_port]
          [-q seconds] [-s source] [-T keyword] [-V rtable] [-W recvlimit]
          [-w timeout] [-X proxy_protocol] [-x proxy_address[:port]]
          [destination] [port]`;
                } else if (args.includes('-l')) {
                    output = 'Listening on [0.0.0.0] (family 0, port ' + (args.includes('-p') ? args[args.indexOf('-p') + 1] : 'any') + ')';
                } else {
                    output = 'nc: missing port number';
                }
                break;
            case 'echo':
                if (args.includes('>')) {
                    // Simple redirection support: echo "text" > file
                    const redirectIndex = args.indexOf('>');
                    if (redirectIndex > 0 && redirectIndex < args.length - 1) {
                        const content = args.slice(1, redirectIndex).join(' ').replace(/^"|"$/g, '');
                        const filename = args[redirectIndex + 1];
                        output = vfs.writeToFile(filename, content);
                    } else {
                        output = 'usage: echo "text" > file';
                    }
                } else {
                    output = args.slice(1).join(' ');
                }
                break;
            case 'whoami':
                output = 'root';
                break;
            case '':
                break;
            default:
                output = `Command not found: ${command}`;
        }

        if (output) {
            setHistory(prev => [...prev, { type: 'output', content: output }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div
            className="w-full max-w-3xl mx-auto h-[400px] bg-black border border-border rounded-lg overflow-hidden flex flex-col font-mono text-sm shadow-2xl"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-2 text-muted-foreground text-xs">user@natcat:{cwd === '/home/user' ? '~' : cwd}</div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-1 text-green-500">
                {history.map((line, i) => (
                    <div key={i} className={cn(line.type === 'input' ? 'text-white' : 'text-green-500')}>
                        {line.type === 'input' && (
                            <span className="mr-2">
                                <span className="text-green-500">user@natcat</span>:
                                <span className="text-blue-500">{line.cwd === '/home/user' ? '~' : line.cwd}</span>$
                            </span>
                        )}
                        <span className="whitespace-pre-wrap">{line.content}</span>
                    </div>
                ))}
                <div className="flex items-center">
                    <span className="mr-2">
                        <span className="text-green-500">user@natcat</span>:
                        <span className="text-blue-500">{cwd === '/home/user' ? '~' : cwd}</span>$
                    </span>
                    <input
                        ref={inputRef}
                        type={sudoState.pendingCommand ? "password" : "text"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none text-white font-mono"
                        autoFocus
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
