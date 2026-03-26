import { TrackGrid } from "../components/TrackGrid";
import { TrackCard } from "../components/TrackCard";
import { EmptyState } from "../components/EmptyState";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { Heart } from "lucide-react";

export function Favorites() {
  const { favorites } = useFavoritesStore();

  return (
    <div className="flex flex-col gap-10 animate-in pt-8">
      <div className="flex flex-col md:flex-row items-end gap-6 pb-6 border-b border-zinc-800/50">
        <div className="w-48 h-48 bg-gradient-to-br from-indigo-700 to-indigo-300 rounded-lg shadow-2xl flex items-center justify-center">
            <Heart className="w-24 h-24 text-white fill-white shadow-xl" />
        </div>
        <div className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">Playlist</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                Músicas Curtidas
            </h1>
            <div className="flex items-center gap-2 mt-4">
                <span className="font-bold text-sm text-white">{favorites.length} músicas</span>
            </div>
        </div>
      </div>

      <div className="mt-4">
        {favorites.length > 0 ? (
          <TrackGrid>
            {favorites.map((track) => (
              <TrackCard key={track.id} track={track} queue={favorites} />
            ))}
          </TrackGrid>
        ) : (
          <EmptyState
            title="Nenhum favorito ainda"
            description="Comece a explorar e clique no coração nas músicas que você ama."
          />
        )}
      </div>
    </div>
  );
}
