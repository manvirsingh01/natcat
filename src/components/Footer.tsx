export default function Footer() {
    return (
        <footer className="border-t border-border py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by{" "}
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        Antigravity
                    </a>
                    . The source code is available on{" "}
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        GitHub
                    </a>
                    .
                </p>
            </div>
        </footer>
    );
}
