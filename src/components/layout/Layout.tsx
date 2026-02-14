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
          <div className="container py-6 px-6">{children}</div>
        </main>
      </div>
      <footer className="pl-64 border-t border-border/40 py-5">
        <p className="text-center text-sm text-muted-foreground/60">
          Made with ❤️ just for Foodies
        </p>
      </footer>
    </div>
  );
}
