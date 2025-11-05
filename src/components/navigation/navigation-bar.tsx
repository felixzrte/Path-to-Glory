import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";

interface NavigationItem {
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Codex", href: "/codex" },
  { label: "Character", href: "/character" },
];

export function NavigationBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="group flex items-center space-x-3 no-underline"
          >
            <div className="flex flex-col">
              <span className="font-display text-lg lg:text-xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                Path to Glory
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wider">
                WRATH & GLORY TOOLS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  to={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-accent/50"
                >
                  {item.label}
                </Link>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-primary to-primary/80 transition-all duration-300 group-hover:w-3/4" />
              </div>
            ))}

            {/* Theme Toggle */}
            <div className="ml-2 pl-2 border-l border-border/30">
              <ThemeToggle variant="ghost" align="end" />
            </div>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block"></div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle variant="ghost" align="end" />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 hover:bg-accent/50"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-background/95 backdrop-blur-xl border-l border-border/50"
              >
                <SheetHeader className="text-left space-y-1 pb-6">
                  <SheetTitle className="font-display text-xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Path to Glory
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground">
                    Wrath & Glory Reference Codex
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col space-y-2 pb-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-accent/50 text-left"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-border/50"></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
