import { Home, Search, Library, PlusSquare, Heart, Music2, Headphones } from "lucide-react";
import { cn } from "../utils/cn";

interface SidebarProps {
  currentTab?: "home" | "favorites";
  onTabChange?: (tab: "home" | "favorites") => void;
}

export function Sidebar({ currentTab = "home", onTabChange }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-black border-r border-zinc-800/20 p-6 gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2 text-green-500">
        <Headphones className="w-8 h-8" />
        <span className="text-2xl font-bold tracking-tight text-white italic">
          SopaFlow
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        <button
          onClick={() => onTabChange?.("home")}
          className={cn(
            "flex items-center gap-4 text-sm font-semibold transition-colors duration-200",
            currentTab === "home" ? "text-white" : "text-zinc-400 hover:text-white"
          )}
        >
          <Home className="w-6 h-6" />
          Início
        </button>
        <button
          className="flex items-center gap-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <Search className="w-6 h-6" />
          Buscar
        </button>
        <button
          className="flex items-center gap-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <Library className="w-6 h-6" />
          Sua Biblioteca
        </button>
      </nav>

      {/* Playlists Extra */}
      <div className="flex flex-col gap-4 mt-4">
        <button className="flex items-center gap-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
          <div className="bg-zinc-800 p-1.5 rounded-sm">
            <PlusSquare className="w-4 h-4" />
          </div>
          Criar playlist
        </button>
        <button
          onClick={() => onTabChange?.("favorites")}
          className={cn(
            "flex items-center gap-4 text-sm font-semibold transition-colors",
            currentTab === "favorites" ? "text-white" : "text-zinc-400 hover:text-white"
          )}
        >
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-300 p-1.5 rounded-sm">
            <Heart className="w-4 h-4 fill-white text-white" />
          </div>
          Músicas Curtidas
        </button>
      </div>

      <hr className="border-zinc-800/40" />

      {/* Playlist List (Dummy) */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 text-sm text-zinc-400">
        <p className="px-1 hover:text-white cursor-pointer truncate">Minha Playlist #1</p>
        <p className="px-1 hover:text-white cursor-pointer truncate">Top Global</p>
        <p className="px-1 hover:text-white cursor-pointer truncate">Foco no Código</p>
        <p className="px-1 hover:text-white cursor-pointer truncate">90's Rock</p>
        <p className="px-1 hover:text-white cursor-pointer truncate">Lo-fi Study</p>
      </div>
    </aside>
  );
}
