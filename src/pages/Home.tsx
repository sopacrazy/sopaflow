import { useEffect, useState, useCallback } from "react";
import { SearchBar } from "../components/SearchBar";
import { TrackGrid } from "../components/TrackGrid";
import { TrackCard } from "../components/TrackCard";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { jamendoApi } from "../services/api";
import { Track } from "../types";
import { toast } from "sonner";
import { Play, Sparkles, TrendingUp, Globe, SkipBack, Heart } from "lucide-react";
import { usePlayerStore } from "../store/usePlayerStore";

const CATEGORIES = [
  { label: "Pop", query: "Pop Hits 2024", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80", bgClass: "bg-gradient-to-br from-[#4A148C] to-[#311B92]" },
  { label: "Rock", query: "Queen AC/DC Nirvana Bon Jovi Guns N Roses Rock Classics", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80", bgClass: "bg-gradient-to-br from-[#121212] to-[#8b5cf6]" },
  { label: "Hip-Hop", query: "Hip Hop 2024", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80", bgClass: "bg-gradient-to-br from-[#880E4F] to-[#4A148C]" },
  { label: "Lo-fi", query: "Lofi Beats", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80", bgClass: "bg-gradient-to-br from-[#311B92] to-[#1A237E]" },
  { label: "Piano", query: "Piano Relax", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80", bgClass: "bg-gradient-to-br from-[#004D40] to-[#006064]" },
  { label: "Indie", query: "Indie Hits", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80", bgClass: "bg-gradient-to-br from-[#BF360C] to-[#3E2723]" },
];

const FEATURED_PLAYLISTS = [
  { title: "Rock Anos 2000", query: "Classic Rock 2000s Pop Punk", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&q=80" },
  { title: "Top Sertanejo", query: "Sertanejo 2024", image: "https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?w=400&q=80" },
  { title: "Phonk Night", query: "Phonk Type Beats", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" },
  { title: "Jazz de Elite", query: "Smooth Jazz Collection", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80" },
];

export function Home() {
  const [topBrasil, setTopBrasil] = useState<Track[]>([]);
  const [topInternacional, setTopInternacional] = useState<Track[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    recentlyPlayed, lastGenre, setLastGenre, 
    playTrack, playAlbum,
    searchQuery, setSearchQuery,
    selectedAlbum, setSelectedAlbum,
    isSearching, setIsSearching,
    searchResults, setSearchResults,
    artistAlbums, setArtistAlbums,
    resetHome
  } = usePlayerStore();

  const fetchHomeData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [brasil, inter, recs] = await Promise.all([
        jamendoApi.searchTracks("Top Brasil Hits 2024", 6, true),
        jamendoApi.searchTracks("Top Global Hits 2024", 6, true),
        jamendoApi.searchTracks(lastGenre || "Top Trending Hits", 8, true)
      ]);
      
      setTopBrasil(brasil);
      setTopInternacional(inter);
      setRecommendations(recs);
    } catch (error) {
      console.error("Failed to load home data", error);
    } finally {
      setIsLoading(false);
    }
  }, [lastGenre]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setArtistAlbums([]);
      setIsSearching(false);
      return;
    }
    setIsLoading(true);
    setIsSearching(true);
    setSelectedAlbum(null);
    try {
      const [tracks, albumData] = await Promise.all([
        jamendoApi.searchTracks(query),
        jamendoApi.searchArtistWithAlbums(query)
      ]);
      setSearchResults(tracks);
      setArtistAlbums(albumData.albums);
    } catch (error) {
      toast.error("Erro ao buscar conteúdo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const viewAlbum = async (album: any) => {
    setIsLoading(true);
    setSelectedAlbum(album);
    setSearchResults([]); // Reset tracks while loading new album
    
    try {
      console.log("Fetching tracks for Album ID:", album.collectionId);
      const tracks = await jamendoApi.getAlbumTracks(album.collectionId.toString());
      
      if (tracks && tracks.length > 0) {
        setSearchResults(tracks);
      } else {
        // Fallback: search by album and artist name if ID lookup fails
        console.warn("Album lookup by ID failed, trying text search fallback...");
        const fallbackTracks = await jamendoApi.searchTracks(`${album.artistName} ${album.collectionName}`, 25);
        setSearchResults(fallbackTracks);
      }
    } catch (error) {
      toast.error("Erro ao carregar faixas do álbum.");
      console.error("View album error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAlbum = async (e: React.MouseEvent, album: any) => {
    e.stopPropagation();
    try {
      console.log("Playing tracks for Album ID:", album.collectionId);
      const tracks = await jamendoApi.getAlbumTracks(album.collectionId.toString());
      
      if (tracks && tracks.length > 0) {
        playAlbum(tracks);
        toast.success(`Iniciando álbum: ${album.collectionName}`);
      } else {
        // Fallback search
        console.warn("Album play by ID failed, trying search fallback...");
        const fallback = await jamendoApi.searchTracks(`${album.artistName} ${album.collectionName}`, 25);
        if (fallback.length > 0) {
            playAlbum(fallback);
            toast.success(`Iniciando álbum: ${album.collectionName}`);
        }
      }
    } catch (error) {
        toast.error("Erro ao reproduzir álbum.");
        console.error("Play album error:", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchHomeData();
    }
  }, [searchQuery, fetchHomeData, handleSearch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const onCategoryClick = (query: string) => {
     setSearchQuery(query);
     setLastGenre(query);
  };

  if (isSearching) {
    return (
      <div className="flex flex-col gap-6 sm:gap-10 animate-in pt-4 sm:pt-8 pb-32">
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2 px-2 sm:px-0">
             <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => { setIsSearching(false); setSearchQuery(""); }} 
                  className="p-2 sm:p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-full text-white transition-colors flex-shrink-0"
                >
                  <SkipBack className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-xl sm:text-3xl font-black text-white px-1 sm:px-2 truncate">
                   {selectedAlbum ? selectedAlbum.collectionName : `Resultados para "${searchQuery}"`}
                </h2>
             </div>
             <div className="w-full sm:w-auto">
                <SearchBar onSearch={setSearchQuery} />
             </div>
          </div>

          {!selectedAlbum && artistAlbums.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
               {/* Top Result Artist Card Style */}
               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2">Melhor Resultado</h3>
                  <div className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900 border border-white/5 shadow-2xl overflow-hidden cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-row sm:flex-col gap-4 sm:gap-6 items-center sm:items-start">
                        <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-2xl border-2 border-white/10 flex-shrink-0">
                            <img src={artistAlbums[0].artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg")} className="w-full h-full object-cover" alt={artistAlbums[0].artistName} />
                        </div>
                        <div className="space-y-1 overflow-hidden">
                            <h4 className="text-xl sm:text-4xl font-black text-white truncate">{artistAlbums[0].artistName}</h4>
                            <p className="text-green-500 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">Artista</p>
                        </div>
                    </div>
                  </div>
               </div>

               {/* Top Songs as List */}
               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2">Top Músicas</h3>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {isLoading ? <LoadingState /> : searchResults.slice(0, 5).map((track, i) => (
                      <div 
                        key={track.id} 
                        onClick={() => playTrack(track, searchResults)}
                        className="group flex items-center gap-3 sm:gap-4 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                      >
                         <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                            <img src={track.image} className="w-full h-full object-cover rounded-md" alt={track.name} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                               <Play className="w-4 h-4 text-white fill-current" />
                            </div>
                         </div>
                         <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-bold text-white truncate">{track.name}</p>
                            <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold">{track.artist}</p>
                         </div>
                         <div className="text-zinc-500 text-[10px] font-mono pr-2 opacity-50">
                             0{i+1}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* Album View Detail */}
          {selectedAlbum && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-2 sm:pt-4 px-2 sm:px-0">
                <div className="w-full lg:w-80 flex-shrink-0 flex sm:flex-col gap-6 sm:gap-8 items-center sm:items-start">
                    <div className="w-32 h-32 sm:w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-3xl bg-zinc-800 group relative flex-shrink-0">
                        <img src={selectedAlbum.artworkUrl100.replace("100x100bb.jpg", "800x800bb.jpg")} className="w-full h-full object-cover" alt={selectedAlbum.collectionName} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">{selectedAlbum.collectionName}</h3>
                            <p className="text-sm sm:text-lg text-zinc-400 font-bold hover:text-green-500 cursor-pointer transition-colors line-clamp-1">{selectedAlbum.artistName}</p>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-zinc-600 font-black uppercase tracking-widest hidden sm:block">
                            Álbum • {selectedAlbum.primaryGenreName} • {new Date(selectedAlbum.releaseDate).getFullYear()}
                        </p>
                        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-4">
                            <button 
                               onClick={(e) => handlePlayAlbum(e, selectedAlbum)}
                               className="flex-1 bg-green-500 text-black py-3 sm:py-4 rounded-full font-black text-sm sm:text-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/10"
                            >
                                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> Tocar Tudo
                            </button>
                            <button className="p-3 sm:p-4 border border-zinc-800 rounded-full text-white hover:bg-zinc-800 transition-colors">
                                <Heart className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-active:scale-125" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-1 mt-6 lg:mt-0">
                   {isLoading ? <LoadingState /> : searchResults.map((track, i) => (
                      <div 
                        key={track.id} 
                        onClick={() => playTrack(track, searchResults)}
                        className="group flex items-center gap-4 sm:gap-6 p-3 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                      >
                         <span className="w-5 sm:w-6 font-black text-zinc-700 group-hover:text-green-500 text-xs sm:text-sm text-center">{i + 1}</span>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-extrabold text-white truncate">{track.name}</p>
                            <p className="text-[10px] sm:text-xs text-zinc-500 font-bold">{track.artist}</p>
                         </div>
                         <Play className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity fill-current" />
                      </div>
                   ))}
                </div>
            </div>
          )}

          {/* Artist Albums Section */}
          {!selectedAlbum && artistAlbums.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-white/5 px-2 sm:px-0">
              <h3 className="text-xl sm:text-2xl font-black text-white">Mais de {artistAlbums[0].artistName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6">
                {artistAlbums.map((album: any) => (
                  <div 
                    key={album.collectionId} 
                    className="group relative flex flex-col gap-2 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-zinc-900/40 hover:bg-zinc-800 transition-all cursor-pointer shadow-lg border border-white/5"
                    onClick={() => viewAlbum(album)}
                  >
                    <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl relative">
                      <img src={album.artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={album.collectionName} />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      
                      <div 
                        onClick={(e) => handlePlayAlbum(e, album)}
                        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-black flex items-center justify-center shadow-2xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all shadow-green-500/20"
                      >
                         <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="px-1 py-1">
                        <p className="text-xs sm:text-sm font-extrabold text-white truncate leading-tight mb-0.5">{album.collectionName}</p>
                        <p className="text-[8px] sm:text-[10px] text-zinc-500 font-black uppercase tracking-widest">{new Date(album.releaseDate).getFullYear()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-12 animate-in pt-4 sm:pt-8 pb-32">
      {/* Header & Categories */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2 sm:px-0 text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tighter">
            {getGreeting()}
          </h1>
          <div className="w-full sm:w-auto">
             <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 px-1 sm:px-0">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.label}
              onClick={() => onCategoryClick(cat.query)}
              className={`flex items-center gap-2 sm:gap-4 transition-all rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl active:scale-[0.98] ${cat.bgClass} relative`}
            >
              <div className="relative w-12 h-12 sm:w-20 sm:h-20 bg-black/30 flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                 <img src={cat.image} alt={cat.label} className="w-full h-full object-cover rounded-lg m-1 opacity-90 group-hover:opacity-100 transition-all group-hover:scale-110" style={{ width: 'calc(100% - 8px)', height: 'calc(100% - 8px)' }} />
              </div>
              <span className="font-black text-xs sm:text-lg text-white truncate z-10 px-1 sm:px-2">{cat.label}</span>
              <div className="ml-auto mr-2 sm:mr-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 hidden sm:block">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white text-black shadow-2xl flex items-center justify-center">
                  <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-current ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists Montadas */}
      <section className="space-y-6 px-1 sm:px-0">
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight pl-2">Para animar seu dia</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {FEATURED_PLAYLISTS.map((pl) => (
            <div 
              key={pl.title}
              onClick={() => onCategoryClick(pl.query)}
              className="group flex flex-col gap-3 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-900/40 hover:bg-zinc-800 transition-all cursor-pointer shadow-lg border border-white/5"
            >
              <div className="aspect-square relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl">
                <img src={pl.image} alt={pl.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl flex items-center justify-center text-black">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <div className="px-1">
                <span className="font-extrabold text-sm sm:text-xl text-white truncate leading-tight block">{pl.title}</span>
                <span className="text-[10px] sm:text-xs text-zinc-500 font-bold tracking-wide uppercase mt-1 block">Curadoria SopaFlow</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recentes */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-6 px-1 sm:px-0">
          <div className="flex items-center gap-2 pl-2">
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">Tocadas recentemente</h2>
          </div>
          <TrackGrid>
            {recentlyPlayed.slice(0, 6).map((track) => (
              <TrackCard key={`recent-${track.id}`} track={track} queue={recentlyPlayed} />
            ))}
          </TrackGrid>
        </section>
      )}

      {/* Feito para você (Personalized) */}
      <section className="space-y-6 px-1 sm:px-0">
        <div className="flex items-center gap-2 pl-2">
          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-500" />
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">Músicas em destaque</h2>
        </div>
        <div className="mt-4">
          {isLoading ? <LoadingState /> : (
            <TrackGrid>
              {recommendations.map((track) => (
                <TrackCard key={`rec-${track.id}`} track={track} queue={recommendations} />
              ))}
            </TrackGrid>
          )}
        </div>
      </section>

      {/* Top Brasil */}
      <section className="space-y-6 px-1 sm:px-0">
        <div className="flex items-center gap-2 pl-2">
          <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 text-[#20D760]" />
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">Brasil Top Hits</h2>
        </div>
        <div className="mt-4">
          {isLoading ? <LoadingState /> : (
            <TrackGrid>
              {topBrasil.map((track) => (
                <TrackCard key={`br-${track.id}`} track={track} queue={topBrasil} />
              ))}
            </TrackGrid>
          )}
        </div>
      </section>

      {/* Top Internacional */}
      <section className="space-y-6 px-1 sm:px-0 pb-20 sm:pb-0">
        <div className="flex items-center gap-2 pl-2">
          <Globe className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500" />
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">Internacional Top Hits</h2>
        </div>
        <div className="mt-4">
          {isLoading ? <LoadingState /> : (
            <TrackGrid>
              {topInternacional.map((track) => (
                <TrackCard key={`int-${track.id}`} track={track} queue={topInternacional} />
              ))}
            </TrackGrid>
          )}
        </div>
      </section>
    </div>
  );
}
