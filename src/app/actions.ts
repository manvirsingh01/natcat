'use server';

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function pingHost(host: string) {
    // Strict validation to prevent command injection
    // Allow alphanumeric, dots, hyphens, and colons (for IPv6)
    const isValidHost = /^[a-zA-Z0-9.:-]+$/.test(host);

    if (!isValidHost) {
        return "Invalid host format. Only alphanumeric characters, dots, hyphens, and colons are allowed.";
    }

    try {
        // Limit to 4 packets
        const { stdout, stderr } = await execAsync(`ping -c 4 ${host}`);
        if (stderr) {
            return stderr;
        }
        return stdout;
    } catch (error: any) {
        return error.message || "An error occurred while pinging.";
    }
}

export async function digHost(domain: string) {
    const isValidDomain = /^[a-zA-Z0-9.-]+$/.test(domain);
    if (!isValidDomain) return "Invalid domain format.";

    try {
        const { stdout, stderr } = await execAsync(`dig +short ${domain}`);
        if (stderr) return stderr;
        return stdout || "No records found.";
    } catch (error: any) {
        return error.message || "Error executing dig.";
    }
}

export async function whoisHost(domain: string) {
    const isValidDomain = /^[a-zA-Z0-9.-]+$/.test(domain);
    if (!isValidDomain) return "Invalid domain format.";

    try {
        // whois output can be very long, maybe limit it?
        const { stdout, stderr } = await execAsync(`whois ${domain}`);
        if (stderr) return stderr;
        return stdout;
    } catch (error: any) {
        return error.message || "Error executing whois.";
    }
}

export async function nmapHost(args: string) {
    // 1. Basic Input Validation
    // Allow alphanumeric, spaces, hyphens, dots, colons (IPv6), and commas (port lists)
    if (!/^[a-zA-Z0-9\s\.\-\:,]+$/.test(args)) {
        return "Invalid characters in arguments.";
    }

    // 2. Flag Whitelisting
    // We only allow specific flags for safety.
    // Allowed: -F (Fast), -sV (Version), -p (Ports), -A (Aggressive), -v (Verbose), -T<0-5> (Timing), -Pn (No ping)
    // We split by space to check tokens
    const tokens = args.split(' ').filter(t => t.length > 0);
    const allowedFlags = new Set(['-F', '-sV', '-A', '-v', '-Pn', '-sS', '-sT', '-sU', '-O']);
    const allowedPrefixes = ['-p', '-T']; // Flags that take values or are attached

    for (const token of tokens) {
        if (token.startsWith('-')) {
            // Check exact match
            if (allowedFlags.has(token)) continue;

            // Check prefix match (e.g. -p80 or -T4)
            const isPrefix = allowedPrefixes.some(prefix => token.startsWith(prefix));
            if (isPrefix) continue;

            return `Flag not allowed: ${token}. Allowed flags: -F, -sV, -A, -v, -Pn, -sS, -sT, -sU, -O, -p<ports>, -T<0-5>`;
        }
    }

    // 3. Target Validation (Simple heuristic: last argument should be the target)
    // In a real scenario, nmap parsing is complex. Here we just ensure we don't have dangerous chars.

    try {
        // Limit execution time to 30 seconds to prevent hanging
        const { stdout, stderr } = await execAsync(`nmap ${args}`, { timeout: 30000 });
        if (stderr) {
            // nmap often prints status to stderr, so we might want to return it if stdout is empty
            // or append it. But usually stdout has the report.
            if (!stdout) return stderr;
        }
        return stdout;
    } catch (error: any) {
        if (error.killed) return "Nmap scan timed out (limit: 30s).";
        return error.stdout || error.message || "Error executing nmap.";
    }
}

export async function curlUrl(url: string) {
    // Basic validation
    if (!url) return "curl: no URL specified!";

    // Ensure protocol
    let targetUrl = url;
    if (!/^https?:\/\//i.test(url)) {
        targetUrl = 'http://' + url;
    }

    try {
        // Prevent SSRF (basic check - real production needs more robust filtering)
        // We rely on the hosting environment's firewall mostly, but let's block localhost
        if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1') || targetUrl.includes('::1')) {
            return "curl: access to local network denied.";
        }

        const response = await fetch(targetUrl, {
            method: 'GET',
            // Limit response size?
        });

        const text = await response.text();
        return text.slice(0, 2000) + (text.length > 2000 ? '\n... (output truncated)' : '');
    } catch (error: any) {
        return `curl: (${error.cause?.code || 'ERR'}) ${error.message}`;
    }
}
