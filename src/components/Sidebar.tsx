import { Home, Search, Library, PlusSquare, Heart, Music2, X, Radio, Video, Users } from "lucide-react";
import { cn } from "../utils/cn";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useAuth } from "../context/AuthContext";
import { usePlayerStore } from "../store/usePlayerStore";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ currentTab = "home", onTabChange }: SidebarProps) {
  const { playlists, addPlaylist, removePlaylist } = usePlaylistStore();
  const { user, signOut } = useAuth();
  const { plan, resetHome } = usePlayerStore();

  const handleCreatePlaylist = () => {
    if (plan !== 'premium') {
      toast.error("Recurso Premium", {
        description: "Assine o plano Premium para criar suas próprias playlists!",
      });
      return;
    }
    const name = window.prompt("Nome da nova playlist:");
    if (name && name.trim().length > 0) {
      addPlaylist(name.trim());
    }
  };

  const handleGoHome = () => {
    resetHome();
    onTabChange?.("home");
  };

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-full bg-black border-r border-zinc-900 p-6 gap-8 shadow-[10px_0_40px_rgba(0,0,0,0.5)] z-10 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 text-white">
        <span className="text-xl font-extrabold tracking-tight text-white uppercase">
          SOPAMUSIC
        </span>
        <div className="w-6 h-6 bg-[#20D760] rounded-full flex items-center justify-center ml-1 shadow-md shadow-[#20D760]/20">
            <Music2 className="w-3.5 h-3.5 text-black" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <button
          onClick={handleGoHome}
          className={cn(
            "flex items-center gap-4 text-sm font-bold transition-all duration-200 px-4 py-3 rounded-xl",
            currentTab === "home" 
              ? "bg-[#20D760] text-black shadow-lg shadow-[#20D760]/20" 
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          )}
        >
          <Home className="w-5 h-5" />
          Início
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Search className="w-5 h-5" />
          Buscar
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Radio className="w-5 h-5" />
          Rádio
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Video className="w-5 h-5" />
          Videoclipes
        </button>
        <button
          className="flex items-center gap-4 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 px-4 py-3 rounded-xl"
        >
          <Users className="w-5 h-5" />
          Comunidade
        </button>
      </nav>

      {/* Playlists Extra */}
      <div className="mt-2">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2 block mb-4">Sua Biblioteca</span>
        <div className="flex flex-col gap-1">
          <button 
            onClick={handleCreatePlaylist}
            className="flex items-center gap-4 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all px-2 py-2 rounded-lg"
          >
            <PlusSquare className="w-5 h-5" />
            Criar playlist
          </button>
          <button
            onClick={() => onTabChange?.("favorites")}
            className={cn(
              "flex items-center gap-4 text-sm font-bold transition-all px-2 py-2 rounded-lg",
              currentTab === "favorites" ? "text-[#20D760] bg-[#20D760]/10" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <Heart className={cn("w-5 h-5", currentTab === "favorites" ? "fill-current" : "")} />
            Músicas Curtidas
          </button>
        </div>
      </div>

      {/* Custom Playlists */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 text-sm text-zinc-400 font-semibold pl-2 pr-1 custom-scrollbar">
        {playlists.map((pl) => (
           <div 
             key={pl.id}
             className={cn(
               "group flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors",
               currentTab === pl.id ? "bg-[#20D760]/10 text-[#20D760]" : "hover:bg-zinc-900 hover:text-white"
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

      {/* User Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-zinc-900 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-2 mb-2 group">
           <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-green-500/0 group-hover:border-green-500/50 transition-all flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="User profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-zinc-500" />
              )}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate capitalize">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário"}</p>
              <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                    plan === 'premium' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-zinc-800 text-zinc-500 border-white/5"
                  )}>
                    Plano {plan}
                  </span>
               </div>
           </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-4 text-sm font-bold text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200 px-4 py-3 rounded-xl w-full text-left mt-2"
          title="Sair da Conta"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
