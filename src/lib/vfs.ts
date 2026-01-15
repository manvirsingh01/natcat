export type FileSystemNode = {
    type: 'file' | 'directory';
    name: string;
    content?: string; // For files
    children?: { [key: string]: FileSystemNode }; // For directories
    parent?: FileSystemNode | null; // Reference to parent for traversal
};

export class VirtualFileSystem {
    root: FileSystemNode;
    current: FileSystemNode;
    path: string[];

    constructor() {
        this.root = {
            type: 'directory',
            name: '/',
            children: {},
            parent: null,
        };
        // Create default home directory
        const home = { type: 'directory', name: 'home', children: {}, parent: this.root } as FileSystemNode;
        const user = { type: 'directory', name: 'user', children: {}, parent: home } as FileSystemNode;

        // Add some default files
        user.children = {
            'welcome.txt': { type: 'file', name: 'welcome.txt', content: 'Welcome to Netcat Simulator!', parent: user },
            'notes.txt': { type: 'file', name: 'notes.txt', content: 'Remember to check out the cheatsheet.', parent: user },
        };

        if (this.root.children) {
            this.root.children['home'] = home;
            if (home.children) {
                home.children['user'] = user;
            }
        }

        this.current = user;
        this.path = ['', 'home', 'user'];
    }

    resolvePath(pathStr: string): FileSystemNode | null {
        if (pathStr === '/') return this.root;
        if (pathStr === '.') return this.current;
        if (pathStr === '..') return this.current.parent || this.root;

        const parts = pathStr.split('/').filter(p => p.length > 0);
        let node = pathStr.startsWith('/') ? this.root : this.current;

        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') {
                node = node.parent || this.root;
                continue;
            }
            if (node.type !== 'directory' || !node.children || !node.children[part]) {
                return null;
            }
            node = node.children[part];
        }
        return node;
    }

    ls(pathStr?: string): string {
        const target = pathStr ? this.resolvePath(pathStr) : this.current;
        if (!target) return `ls: cannot access '${pathStr}': No such file or directory`;
        if (target.type === 'file') return target.name;

        return Object.keys(target.children || {}).join('  ');
    }

    cd(pathStr: string): string {
        if (!pathStr) {
            // Go home
            this.current = this.root.children!['home'].children!['user'];
            this.path = ['', 'home', 'user'];
            return '';
        }
        const target = this.resolvePath(pathStr);
        if (!target) return `bash: cd: ${pathStr}: No such file or directory`;
        if (target.type !== 'directory') return `bash: cd: ${pathStr}: Not a directory`;

        this.current = target;

        // Reconstruct path string for display
        // This is a simplified path reconstruction
        if (target === this.root) {
            this.path = [''];
        } else {
            // A proper implementation would trace back parents, but for now we can just track it if we assume simple navigation
            // Or better, let's just trace back parents to rebuild the path array
            const newPath = [];
            let curr: FileSystemNode | null | undefined = target;
            while (curr && curr.parent) {
                newPath.unshift(curr.name);
                curr = curr.parent;
            }
            newPath.unshift(''); // Root
            this.path = newPath;
        }

        return '';
    }

    pwd(): string {
        if (this.current === this.root) return '/';
        // Trace back to root to build path
        let path = '';
        let curr: FileSystemNode | null | undefined = this.current;
        while (curr && curr.parent) {
            path = '/' + curr.name + path;
            curr = curr.parent;
        }
        return path || '/';
    }

    mkdir(name: string): string {
        if (this.current.children && this.current.children[name]) {
            return `mkdir: cannot create directory '${name}': File exists`;
        }
        if (this.current.children) {
            this.current.children[name] = {
                type: 'directory',
                name: name,
                children: {},
                parent: this.current
            };
        }
        return '';
    }

    touch(name: string): string {
        if (this.current.children && this.current.children[name]) {
            // Update timestamp in a real FS, here just do nothing
            return '';
        }
        if (this.current.children) {
            this.current.children[name] = {
                type: 'file',
                name: name,
                content: '',
                parent: this.current
            };
        }
        return '';
    }

    cat(pathStr: string): string {
        const target = this.resolvePath(pathStr);
        if (!target) return `cat: ${pathStr}: No such file or directory`;
        if (target.type === 'directory') return `cat: ${pathStr}: Is a directory`;
        return target.content || '';
    }

    rm(pathStr: string): string {
        const target = this.resolvePath(pathStr);
        if (!target) return `rm: cannot remove '${pathStr}': No such file or directory`;
        if (target.type === 'directory') return `rm: cannot remove '${pathStr}': Is a directory`;

        // Remove from parent
        if (target.parent && target.parent.children) {
            delete target.parent.children[target.name];
        }
        return '';
    }

    writeToFile(name: string, content: string): string {
        // Simple implementation: write to file in current directory
        if (this.current.children) {
            this.current.children[name] = {
                type: 'file',
                name: name,
                content: content,
                parent: this.current
            };
        }
        return '';
    }
}
