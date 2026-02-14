import { Download } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";

export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Logo />
        </div>

        <div className="flex items-center gap-4">
          <InstallButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function InstallButton() {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={install}
      className="gap-2 hidden md:flex"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}
