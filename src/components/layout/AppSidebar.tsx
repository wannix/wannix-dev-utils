import {
  Home, FileText, Key, Hash, RefreshCw, Shield, Clock,
  FileJson, Settings, Terminal, GitCompare, Timer,
  Image, Code, Keyboard, ArrowRightLeft, Fingerprint, Zap, Lock
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const categories = [
  {
    title: "Conversion & Parsing",
    items: [
      { title: "Base64 Encoder", url: "/base64", icon: FileText },
      { title: "JWT Decoder", url: "/jwt", icon: Key },
      { title: "Spring ↔ YAML", url: "/spring-yaml", icon: Settings },
      { title: "JSON ↔ YAML", url: "/json-yaml", icon: FileJson },
      { title: "Certificate Decoder", url: "/certificate", icon: Shield },
      { title: "Unix Timestamp", url: "/timestamp", icon: Clock },
    ],
  },
  {
    title: "Generation & Building",
    items: [
      { title: "UUID Generator", url: "/uuid", icon: Fingerprint },
      { title: "ID Generator", url: "/id-generator", icon: Zap },
      { title: "Hash Generator", url: "/hash", icon: Lock },
      { title: "Curl Builder", url: "/curl", icon: Terminal },
    ],
  },
  {
    title: "Validation & Debugging",
    items: [
      { title: "Diff Checker", url: "/diff", icon: GitCompare },
      { title: "Cron Tester", url: "/cron", icon: Timer },
      { title: "SVG Optimizer", url: "/svg", icon: Image },
      { title: "Regex Tester", url: "/regex", icon: Code },
      { title: "Keycode Info", url: "/keycode", icon: Keyboard },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">
          <NavLink to="/" className="block">
            <h1 className="text-xl font-bold text-primary">DevUtils</h1>
            {open && <p className="text-xs text-muted-foreground mt-1">Developer Utilities Hub</p>}
          </NavLink>
        </div>

        {categories.map((category) => (
          <SidebarGroup key={category.title}>
            <SidebarGroupLabel>{category.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
