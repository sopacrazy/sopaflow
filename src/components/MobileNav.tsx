import { Home, Search, Library, Heart } from "lucide-react";
import { cn } from "../utils/cn";
import { usePlayerStore } from "../store/usePlayerStore";

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNav({ currentTab, onTabChange }: MobileNavProps) {
  const { resetHome } = usePlayerStore();

  const handleGoHome = () => {
    resetHome();
    onTabChange("home");
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex items-center justify-between pb-[calc(1.2rem+env(safe-area-inset-bottom,0))]">
      <button
        onClick={handleGoHome}
        className={cn(
          "flex flex-col items-center gap-1 transition-all",
          currentTab === "home" ? "text-white" : "text-zinc-500"
        )}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-bold">Início</span>
      </button>

      <button
        onClick={() => onTabChange("home")} 
        className={cn(
          "flex flex-col items-center gap-1 transition-all text-zinc-500"
        )}
      >
        <Search className="w-6 h-6" />
        <span className="text-[10px] font-bold">Buscar</span>
      </button>

      <button
        onClick={() => onTabChange("favorites")}
        className={cn(
          "flex flex-col items-center gap-1 transition-all",
          currentTab === "favorites" ? "text-white" : "text-zinc-500"
        )}
      >
        <Heart className="w-6 h-6" />
        <span className="text-[10px] font-bold">Curtidas</span>
      </button>

      <button
        className="flex flex-col items-center gap-1 text-zinc-500"
      >
        <Library className="w-6 h-6" />
        <span className="text-[10px] font-bold">Biblioteca</span>
      </button>
    </nav>
  );
}
