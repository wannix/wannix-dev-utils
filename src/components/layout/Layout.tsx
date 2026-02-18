import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

import { ModeToggle } from "@/components/mode-toggle";

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // Get breadcrumb from current path
  const getBreadcrumb = () => {
    const path = location.pathname;
    const breadcrumbs: Record<string, string> = {
      "/": "Home",
      "/base64": "Base64 Encoder/Decoder",
      "/jwt": "JWT Decoder",
      "/uuid": "UUID Generator",
      "/spring-yaml": "Spring ↔ YAML",
      "/json-yaml": "JSON ↔ YAML",
      "/certificate": "Certificate Decoder",
      "/timestamp": "Unix Timestamp",
      "/id-generator": "ID Generator",
      "/hash": "Hash Generator",
      "/curl": "Curl Builder",
      "/diff": "Diff Checker",
      "/cron": "Cron Tester",
      "/svg": "SVG Optimizer",
      "/regex": "Regex Tester",
      "/keycode": "Keycode Info",
    };
    return breadcrumbs[path] || "";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
        <AppSidebar />

        <div className="flex-1 flex flex-col transition-all">
          {/* Header with breadcrumb and toggle */}
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card transition-colors">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-foreground font-medium">{getBreadcrumb()}</span>
              </div>
            </div>
            <ModeToggle />
          </header>

          {/* Main content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
