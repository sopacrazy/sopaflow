import { TrackGrid } from "../components/TrackGrid";
import { TrackCard } from "../components/TrackCard";
import { EmptyState } from "../components/EmptyState";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Music2 } from "lucide-react";

interface PlaylistViewProps {
  playlistId: string;
}

export function PlaylistView({ playlistId }: PlaylistViewProps) {
  const { playlists } = usePlaylistStore();
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return <EmptyState title="Playlist não encontrada" description="A playlist não existe mais." />;
  }

  return (
    <div className="flex flex-col gap-10 animate-in pt-8">
      <div className="flex flex-col md:flex-row items-end gap-6 pb-6 border-b border-zinc-200">
        <div className="w-48 h-48 bg-gradient-to-br from-[#E2E6FA] to-[#E3DCF7] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-zinc-100">
            <Music2 className="w-24 h-24 text-indigo-400 drop-shadow-sm" />
        </div>
        <div className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">Playlist</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 truncate max-w-full">
                {playlist.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-sm text-zinc-600">{playlist.tracks.length} músicas</span>
            </div>
        </div>
      </div>

      <div className="mt-4">
        {playlist.tracks.length > 0 ? (
          <TrackGrid>
            {playlist.tracks.map((track) => (
              <TrackCard key={track.id} track={track} queue={playlist.tracks} />
            ))}
          </TrackGrid>
        ) : (
          <EmptyState
            title="Sua playlist está vazia"
            description="Procure músicas no Início e adicione-as aqui!"
          />
        )}
      </div>
    </div>
  );
}
