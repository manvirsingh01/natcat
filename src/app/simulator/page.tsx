import Terminal from "@/components/Terminal";

export default function SimulatorPage() {
    return (
        <div className="container py-12 md:py-24 flex flex-col items-center">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary mb-4">
                    Terminal Simulator
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    Practice your Netcat skills in a safe environment. Try commands like <code>nc -h</code> or <code>nc -l -p 8080</code>.
                </p>
            </div>

            <Terminal />

            <div className="mt-12 max-w-2xl text-sm text-muted-foreground bg-muted/50 p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">How it works</h3>
                <p>
                    This simulator mimics a basic shell environment with Netcat installed.
                    It does not actually connect to the network, but simulates the input/output behavior of common <code>nc</code> commands.
                    Perfect for learning syntax without risking your own network.
                </p>
            </div>
        </div>
    );
}
