import { Home, Search, Library, PlusSquare, Heart, Music2, X, Radio, Video, Users } from "lucide-react";
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
    <aside className="hidden md:flex flex-col w-[260px] h-full bg-white border-r border-zinc-100 p-6 gap-8 shadow-[10px_0_40px_rgba(0,0,0,0.02)] z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 text-zinc-900">
        <span className="text-xl font-extrabold tracking-tight text-zinc-900 uppercase">
          STORYBOARD
        </span>
        <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center ml-1">
            <Music2 className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => onTabChange?.("home")}
          className={cn(
            "flex items-center gap-4 text-sm font-bold transition-all duration-200 px-4 py-3 rounded-xl",
            currentTab === "home" 
              ? "bg-[#20D760] text-white shadow-lg shadow-[#20D760]/30" 
              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          )}
        >
          <Home className="w-5 h-5" />
          Home
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Search className="w-5 h-5" />
          Browse
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Radio className="w-5 h-5" />
          Radio
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Video className="w-5 h-5" />
          Video
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Users className="w-5 h-5" />
          Community
        </button>
      </nav>

      {/* Playlists Extra */}
      <div className="mt-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2 block mb-4">Your Library</span>
        <div className="flex flex-col gap-1">
          <button 
            onClick={handleCreatePlaylist}
            className="flex items-center gap-4 text-sm font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all px-2 py-2 rounded-lg"
          >
            <PlusSquare className="w-5 h-5" />
            Criar playlist
          </button>
          <button
            onClick={() => onTabChange?.("favorites")}
            className={cn(
              "flex items-center gap-4 text-sm font-bold transition-all px-2 py-2 rounded-lg",
              currentTab === "favorites" ? "text-rose-500 bg-rose-50" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <Heart className={cn("w-5 h-5", currentTab === "favorites" ? "fill-current" : "")} />
            Músicas Curtidas
          </button>
        </div>
      </div>

      {/* Custom Playlists */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 text-sm text-zinc-500 font-semibold pl-2 pr-1 custom-scrollbar-light">
        {playlists.map((pl) => (
           <div 
             key={pl.id}
             className={cn(
               "group flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors",
               currentTab === pl.id ? "bg-[#20D760]/10 text-[#20D760]" : "hover:bg-zinc-50 hover:text-zinc-900"
             )}
             onClick={() => onTabChange?.(pl.id)}
           >
             <p className="truncate flex-1">{pl.name}</p>
             <button 
               onClick={(e) => { e.stopPropagation(); removePlaylist(pl.id); }} 
               className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity p-1"
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
