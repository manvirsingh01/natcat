export class PackageManager {
    installedPackages: Set<string>;
    availablePackages: Set<string>;

    constructor() {
        this.installedPackages = new Set();
        // List of packages that *can* be installed
        this.availablePackages = new Set(['curl', 'wget', 'htop', 'vim', 'npm', 'node']);
    }

    isInstalled(packageName: string): boolean {
        return this.installedPackages.has(packageName);
    }

    isAvailable(packageName: string): boolean {
        return this.availablePackages.has(packageName);
    }

    install(packageName: string): boolean {
        if (this.isAvailable(packageName)) {
            this.installedPackages.add(packageName);
            return true;
        }
        return false;
    }

    list(): string[] {
        return Array.from(this.installedPackages);
    }
}
