import { Link } from "@tanstack/react-router";
import { Home, BookOpen, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme";

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Codex",
    url: "/codex",
    icon: BookOpen,
  },
  {
    title: "Characters",
    url: "/characters",
    icon: Users,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex flex-col px-2 py-3 no-underline">
          <span className="font-display text-lg font-bold text-sidebar-foreground">
            Path to Glory
          </span>
          <span className="text-xs text-sidebar-foreground/60 font-medium tracking-wider">
            WRATH & GLORY TOOLS
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-xs text-sidebar-foreground/60">Theme</span>
          <ThemeToggle variant="ghost" align="end" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
