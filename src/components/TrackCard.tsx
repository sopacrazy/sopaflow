import React from "react";
import { Heart, Play, Pause, Plus } from "lucide-react";
import { Track } from "../types";
import { usePlayerStore } from "../store/usePlayerStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { cn } from "../utils/cn";
import { toast } from "sonner";

interface TrackCardProps {
  track: Track;
  queue?: Track[];
}

export function TrackCard({ track, queue }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { playlists, addTrackToPlaylist } = usePlaylistStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isFavoriteTrack = isFavorite(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track, queue);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  const handleAddToPlaylistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlists.length === 0) {
      toast.error("Crie uma playlist primeiro no menu lateral!");
      return;
    }
    const targetPlaylist = playlists[0];
    addTrackToPlaylist(targetPlaylist.id, track);
    toast.success(`Música adicionada à ${targetPlaylist.name}`);
  };

  const placeholderImg = `https://picsum.photos/seed/${track.id}/400/400`;

  return (
    <div
      className="group relative flex flex-col gap-3 p-3 sm:p-4 rounded-2xl bg-[#181818] border border-zinc-800 hover:border-zinc-700 hover:bg-[#282828] transition-all duration-300 cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
      onClick={handlePlayClick}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md shadow-lg bg-zinc-800">
        <img
          src={track.image || placeholderImg}
          alt={track.name}
          className={cn(
            "object-cover w-full h-full transition-transform duration-500",
            isCurrentTrack && "scale-105"
          )}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
             // Fallback to placeholder if link is broken
             e.currentTarget.src = placeholderImg;
          }}
        />
        
        {/* Play Button Overlay */}
        <div
          className={cn(
            "absolute bottom-2 right-2 flex items-center justify-center transform transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-xl",
            isCurrentTrack ? "opacity-100 translate-y-0" : ""
          )}
        >
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#20D760] text-black hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#20D760]/30"
            onClick={handlePlayClick}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Add to Playlist Button */}
        <button
          onClick={handleAddToPlaylistClick}
          className="absolute top-2 right-10 p-1.5 rounded-full transition-all duration-200 bg-black/50 backdrop-blur-md text-zinc-300 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white"
          title="Adicionar à sua playlist"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 bg-black/50 backdrop-blur-md",
            isFavoriteTrack
              ? "text-[#20D760] opacity-100 bg-black"
              : "text-zinc-300 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavoriteTrack && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-col min-w-0 px-1">
        <h3
          className={cn(
            "font-extrabold text-sm truncate leading-tight",
            isCurrentTrack ? "text-[#20D760]" : "text-white"
          )}
          title={track.name}
        >
          {track.name}
        </h3>
        <p
          className="text-xs text-zinc-400 truncate mt-1 font-semibold"
          title={track.artist}
        >
          {track.artist}
        </p>
      </div>
    </div>
  );
}
