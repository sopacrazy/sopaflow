import React from "react";
import { Heart, Play, Pause } from "lucide-react";
import { Track } from "../types";
import { usePlayerStore } from "../store/usePlayerStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { cn } from "../utils/cn";

interface TrackCardProps {
  track: Track;
  queue?: Track[];
}

export function TrackCard({ track, queue }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

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

  const placeholderImg = `https://picsum.photos/seed/${track.id}/400/400`;

  return (
    <div
      className="group relative flex flex-col gap-4 p-4 rounded-lg bg-zinc-900/40 hover:bg-zinc-800/80 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl"
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
            className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-black hover:scale-110 active:scale-95 transition-all shadow-xl"
            onClick={handlePlayClick}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200",
            isFavoriteTrack
              ? "text-green-500 opacity-100"
              : "text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavoriteTrack && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-col min-w-0">
        <h3
          className={cn(
            "font-bold text-sm truncate leading-tight",
            isCurrentTrack ? "text-green-500" : "text-white"
          )}
          title={track.name}
        >
          {track.name}
        </h3>
        <p
          className="text-xs text-zinc-400 truncate mt-1.5 font-medium"
          title={track.artist}
        >
          {track.artist}
        </p>
      </div>
    </div>
  );
}
