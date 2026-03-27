import { Home, Search, Library, PlusSquare, Heart, Headphones, X } from "lucide-react";
import { cn } from "../utils/cn";
import { usePlaylistStore } from "../store/usePlaylistStore";

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ currentTab = "home", onTabChange }: SidebarProps) {
  const { playlists, addPlaylist, removePlaylist } = usePlaylistStore();

  const handleCreatePlaylist = () => {
    const name = window.prompt("Nome da nova playlist:");
    if (name && name.trim().length > 0) {
      addPlaylist(name.trim());
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-black border-r border-zinc-800/20 p-6 gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2 text-green-500">
        <Headphones className="w-8 h-8" />
        <span className="text-2xl font-bold tracking-tight text-white italic">
          SopaMusic
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
        <button 
          onClick={handleCreatePlaylist}
          className="flex items-center gap-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
        >
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

      {/* Custom Playlists */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 text-sm text-zinc-400">
        {playlists.map((pl) => (
           <div 
             key={pl.id}
             className="group flex items-center justify-between"
           >
             <p 
               onClick={() => onTabChange?.(pl.id)}
               className={cn(
                 "px-1 hover:text-white cursor-pointer truncate flex-1",
                 currentTab === pl.id ? "text-green-500 font-bold" : ""
               )}
             >
               {pl.name}
             </p>
             <button 
               onClick={() => removePlaylist(pl.id)} 
               className="opacity-0 group-hover:opacity-100 hover:text-white text-zinc-500 transition-opacity p-1"
               title="Remover Playlist"
             >
               <X className="w-4 h-4" />
             </button>
           </div>
        ))}
      </div>
    </aside>
  );
}
