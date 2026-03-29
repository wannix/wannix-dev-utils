import { APP_VERSION } from "@/lib/constants";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pl-64">
          <div className="max-w-[1600px] mx-auto w-full py-4 px-6">{children}</div>
        </main>
      </div>
      <footer className="pl-64 border-t border-border/40 py-5">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6">
          <div aria-hidden="true" />
          <p className="text-center text-sm text-muted-foreground/60">
            Made with ❤️ just for Devs!
          </p>
          <div className="justify-self-end">
            <small
              aria-label={`Application version ${APP_VERSION}`}
              className="font-mono text-xs tabular-nums tracking-wide text-muted-foreground/45"
            >
              v{APP_VERSION}
            </small>
          </div>
        </div>
      </footer>
    </div>
  );
}
