import { Headphones, Heart, Home } from "lucide-react";
import { cn } from "../utils/cn";

interface HeaderProps {
  currentTab?: "home" | "favorites";
  onTabChange?: (tab: "home" | "favorites") => void;
}

export function Header({ currentTab = "home", onTabChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <Headphones className="w-6 h-6" />
          <span className="text-xl font-semibold tracking-tight text-zinc-100">
            SopaFlow
          </span>
        </div>
        
        {onTabChange && (
          <nav className="flex items-center gap-1 sm:gap-2 bg-zinc-900/50 p-1 rounded-full border border-zinc-800/50">
            <button
              onClick={() => onTabChange("home")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                currentTab === "home"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </button>
            <button
              onClick={() => onTabChange("favorites")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                currentTab === "favorites"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favoritos</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
