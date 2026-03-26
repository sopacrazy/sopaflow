import { useEffect, useState, useCallback } from "react";
import { SearchBar } from "../components/SearchBar";
import { TrackGrid } from "../components/TrackGrid";
import { TrackCard } from "../components/TrackCard";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { jamendoApi } from "../services/api"; // Rename it in the future, for now it matches current api.ts
import { Track } from "../types";
import { toast } from "sonner";
import { Play } from "lucide-react";

const CATEGORIES = [
  { label: "Pop", query: "pop", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80" },
  { label: "Rock", query: "rock", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80" },
  { label: "Hip-Hop", query: "hip hop", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80" },
  { label: "Lo-fi", query: "lofi", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" },
  { label: "Piano", query: "piano", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80" },
  { label: "Indie", query: "indie", image: "https://images.unsplash.com/photo-1453738773917-9c8fdfb306dd?w=400&q=80" },
];

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTracks = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const results = await jamendoApi.searchTracks(query || "trending");
      setTracks(results);
    } catch (error) {
      toast.error("Falha ao carregar as músicas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks(searchQuery);
  }, [searchQuery, fetchTracks]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="flex flex-col gap-10 animate-in pt-8">
      {/* Spotify style Header */}
      <section className="space-y-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {getGreeting()}
        </h1>
        
        {/* Quick Picks / Daily Mixes Style */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.label}
              onClick={() => setSearchQuery(cat.query)}
              className="flex items-center gap-3 sm:gap-4 bg-white/10 hover:bg-white/20 transition-all rounded-md overflow-hidden cursor-pointer group shadow-lg"
            >
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-zinc-800 flex-shrink-0 shadow-xl overflow-hidden">
                 <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" />
                 </div>
              </div>
              <span className="font-bold text-sm sm:text-base text-white truncate">{cat.label}</span>
              <div className="ml-auto mr-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-current ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Feito para você"}
          </h2>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="mt-4">
          {isLoading ? (
            <LoadingState />
          ) : tracks.length > 0 ? (
            <TrackGrid>
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} queue={tracks} />
              ))}
            </TrackGrid>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </div>
  );
}
