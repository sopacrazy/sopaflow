import { useEffect, useState, useCallback, useRef } from "react";
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
  { label: "Jazz", query: "Jazz Hits", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80" },
  { label: "Soul", query: "Soul Classics", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80" },
];

const FEATURED_PLAYLISTS = [
  { title: "Rock Anos 2000", query: "Classic Rock 2000s Pop Punk", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&q=80" },
  { title: "Top Sertanejo", query: "Sertanejo 2024", image: "https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?w=400&q=80" },
  { title: "Phonk Night", query: "Phonk Type Beats", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" },
  { title: "Jazz de Elite", query: "Smooth Jazz Collection", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80" },
];

const HOME_FILTERS = [
  "Podcasts", "Relax", "Energia", "Romance", "Para treinar", "Para ouvir no trânsito", "Festa", "Positividade", "Foco", "Triste", "Para dormi"
];

// Top 36 always loaded first - the legends
const ROCK_TOP = [
  "AC/DC", "Queen", "Nirvana", "Guns N' Roses", "Pink Floyd", "Led Zeppelin", 
  "Metallica", "Iron Maiden", "Black Sabbath", "The Rolling Stones", "The Beatles", 
  "Aerosmith", "Foo Fighters", "Red Hot Chili Peppers", "Linkin Park", "Bon Jovi", 
  "Pearl Jam", "Deep Purple", "KISS", "Scorpions", "Oasis", "Green Day",
  "System of a Down", "Slipknot", "Avenged Sevenfold", "Muse", "The Who",
  "Def Leppard", "Jimi Hendrix", "The Doors", "Radiohead", "Arctic Monkeys",
  "The Strokes", "The Killers", "Evanescence", "Paramore"
];

// Extended list - loaded progressively via infinite scroll
const ROCK_EXTENDED = [
  "Rage Against the Machine", "Alice in Chains", "Soundgarden", "Stone Temple Pilots",
  "The Smashing Pumpkins", "Nine Inch Nails", "Marilyn Manson", "Rob Zombie",
  "Pantera", "Megadeth", "Anthrax", "Sepultura",
  "Motorhead", "Twisted Sister", "Whitesnake", "Warrant",
  "Poison", "Cinderella", "Quiet Riot", "Night Ranger",
  "Ozzy Osbourne", "Dio", "Rainbow", "Uriah Heep",
  "Status Quo", "Thin Lizzy", "Wishbone Ash", "Free",
  "Bad Company", "Foreigner", "Journey", "Styx",
  "Boston", "Kansas", "REO Speedwagon", "Asia",
  "Supertramp", "Fleetwood Mac", "Heart", "Pat Benatar",
  "Blondie", "The Pretenders", "The Clash", "The Ramones",
  "Sex Pistols", "The Cure", "The Smiths", "Joy Division",
  "New Order", "Depeche Mode", "The Police", "Talking Heads",
  "R.E.M.", "U2", "Coldplay", "Travis",
  "Snow Patrol", "Kaiser Chiefs", "Franz Ferdinand", "Interpol",
  "White Stripes", "Wolfmother", "Queens of the Stone Age", "Them Crooked Vultures",
  "Audioslave", "Temple of the Dog", "Mad Season", "Blind Melon",
  "Dinosaur Jr", "Pixies", "Sonic Youth", "Mudhoney"
];

const ROCK_LEGENDS = [...ROCK_TOP, ...ROCK_EXTENDED]; // keep for mix function


export function Home() {
  const [topBrasil, setTopBrasil] = useState<Track[]>([]);
  const [topInternacional, setTopInternacional] = useState<Track[]>([]);
  const [rockClassics, setRockClassics] = useState<Track[]>([]);
  const [rockAnthems, setRockAnthems] = useState<Track[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const rockExtendedPageRef = useRef(0); // tracks how many batches of ROCK_EXTENDED loaded
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isRockModeRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
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
      const [brasil, inter, rockClas, rockAnth, recs] = await Promise.all([
        jamendoApi.searchTracks("Top Brasil Hits 2024", 6, true),
        jamendoApi.searchTracks("Top Global Hits 2024", 6, true),
        jamendoApi.searchTracks("Pink Floyd Nirvana Iron Maiden Deep Purple Black Sabbath legendary rock albums", 12, true),
        jamendoApi.searchTracks("Stairway to Heaven Smells Like Teen Spirit Enter Sandman rock anthems", 12, true),
        jamendoApi.searchTracks(lastGenre || "Top Trending Hits", 12, true)
      ]);
      
      setTopBrasil(brasil);
      setTopInternacional(inter);
      setRockClassics(rockClas);
      setRockAnthems(rockAnth);
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
      isRockModeRef.current = false;
      return;
    }
    
    setIsLoading(true);
    setIsSearching(true);
    setSelectedAlbum(null);

    const isRock = query.toLowerCase().includes('rock') || 
                   query.toLowerCase().includes('queen') || 
                   query.toLowerCase().includes('ac/dc') || 
                   query.toLowerCase().includes('nirvana');

    try {
      if (isRock) {
        // Always use ROCK_TOP (36 icons) for the initial load
        const rockSubset = jamendoApi.shuffle([...ROCK_TOP]).slice(0, 36);
        isRockModeRef.current = true;
        rockExtendedPageRef.current = 0;
        const [tracks, anthems, ...legendResults] = await Promise.all([
          jamendoApi.searchTracks(query, 20),
          jamendoApi.searchTracks("Rock Anthems Classics 70s 80s 90s", 15, true),
          ...rockSubset.map(band => jamendoApi.searchArtistWithAlbums(band, 1))
        ]);

        // Take the first album from each legend result to represent the artist
        const legendAlbums = legendResults
            .map(res => res.albums[0])
            .filter(Boolean);

        setSearchResults([...tracks, ...anthems].slice(0, 40));
        
        // Remove duplicates and combine
        const uniqueAlbums = legendAlbums.filter((v, i, a) => 
            a.findIndex(t => t.artistName === v.artistName) === i
        );
        
        setArtistAlbums(uniqueAlbums);
      } else {
        const [tracks, albumData] = await Promise.all([
          jamendoApi.searchTracks(query),
          jamendoApi.searchArtistWithAlbums(query)
        ]);
        setSearchResults(tracks);
        setArtistAlbums(albumData.albums);
      }
    } catch (error) {
      toast.error("Erro ao buscar conteúdo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load more rock bands when user scrolls to bottom
  const loadMoreRockBands = useCallback(async () => {
    if (isLoadingMoreRef.current) return;
    const batchSize = 12;
    const page = rockExtendedPageRef.current;
    const batch = ROCK_EXTENDED.slice(page * batchSize, (page + 1) * batchSize);
    if (batch.length === 0) return; // all loaded

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const results = await Promise.all(batch.map(band => jamendoApi.searchArtistWithAlbums(band, 1)));
      const newAlbums = results
        .map(r => r.albums[0])
        .filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.artistName === v.artistName) === i);

      if (newAlbums.length > 0) {
        const current = usePlayerStore.getState().artistAlbums;
        const merged = [
          ...current,
          ...newAlbums.filter((na: any) => !current.some((p: any) => p.artistName === na.artistName))
        ];
        setArtistAlbums(merged);
      }
      rockExtendedPageRef.current = page + 1;
    } catch (e) {
      console.error("loadMoreRockBands error:", e);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [setArtistAlbums]);
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

  const handlePlayMix = async () => {
    toast.loading("Carregando todas as faixas...", { id: 'mix' });
    try {
      // Fetch ALL tracks from ALL albums - no limits!
      const allAlbums = [...artistAlbums];
      const trackPromises = allAlbums.map(album => jamendoApi.getAlbumTracks(album.collectionId.toString()));
      const results = await Promise.all(trackPromises);

      // Group tracks by artist
      const byArtist: Record<string, Track[]> = {};
      results.filter(Boolean).forEach(albumTracks => {
        albumTracks.forEach(track => {
          if (!byArtist[track.artist]) byArtist[track.artist] = [];
          byArtist[track.artist].push(track);
        });
      });

      // Shuffle tracks within each artist and shuffle artist order
      const artistKeys = jamendoApi.shuffle(Object.keys(byArtist));
      const artistQueues = artistKeys.map(a => jamendoApi.shuffle(byArtist[a]));

      // Interleave: pick 1 track at a time from each artist in rotation
      // e.g: AC/DC, Nirvana, Queen, Metallica, AC/DC, Nirvana, ...
      const interleaved: Track[] = [];
      const maxLen = Math.max(...artistQueues.map(a => a.length));
      for (let i = 0; i < maxLen; i++) {
        artistQueues.forEach(queue => {
          if (queue[i]) interleaved.push(queue[i]);
        });
      }

      if (interleaved.length > 0) {
        playAlbum(interleaved);
        toast.success(`${interleaved.length} faixas de ${artistKeys.length} artistas! Tocando até acabar 🔥`, { id: 'mix' });
      } else {
        toast.error("Nenhuma faixa encontrada.", { id: 'mix' });
      }
    } catch (e) {
      toast.error("Erro ao iniciar mix.", { id: 'mix' });
      console.error("Play mix error:", e);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchHomeData();
    }
  }, [searchQuery, fetchHomeData, handleSearch]);

  // Callback ref for sentinel: attach IntersectionObserver when the element mounts
  const sentinelCallbackRef = useCallback((node: HTMLDivElement | null) => {
    // Disconnect old observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    sentinelRef.current = node;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isRockModeRef.current && !isLoadingMoreRef.current) {
          loadMoreRockBands();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(node);
    observerRef.current = observer;
  }, [loadMoreRockBands]);

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
            <div className="flex flex-col gap-10">
               {/* Premium Vitrine Header */}
               <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-6 sm:p-10 mb-2">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
                  <div className="relative z-10 space-y-4">
                     <span className="text-xs font-black text-purple-500 uppercase tracking-[0.3em]">Vitrine de Lendas</span>
                     <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">
                        {searchQuery.toLowerCase().includes('rock') ? 'O Melhor do Rock' : `Explorar: ${searchQuery}`}
                     </h3>
                     <p className="text-sm sm:text-lg text-zinc-400 font-medium max-w-xl">
                        Descubra álbuns icônicos, as bandas mais influentes e os hits que definiram gerações. Tudo em um só lugar.
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start px-2 sm:px-0">
                  {/* Top Artists Row */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2">Artistas em Destaque</h3>
                        <div className="h-px flex-1 bg-white/5 ml-4" />
                     </div>
                     <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pr-4">
                       {artistAlbums.slice(0, 40).map((artist, idx) => (
                         <div 
                           key={`${artist.artistId || artist.collectionId}-${idx}`} 
                           onClick={() => viewAlbum(artist)}
                           className="flex-shrink-0 w-32 sm:w-44 flex flex-col items-center gap-4 group cursor-pointer"
                         >
                            <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-2xl border border-white/10 relative ring-4 ring-transparent group-hover:ring-purple-500/20 transition-all">
                                <img loading="lazy" src={artist.artworkUrl100.replace("100x100bb.jpg", "200x200bb.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={artist.artistName} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                   <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                                      <Play className="w-6 h-6 fill-current" />
                                   </div>
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm sm:text-base font-bold text-white truncate w-full px-2">{artist.artistName}</p>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Lenda</p>
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Top Songs as List */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2">Maiores Hits</h3>
                        <div className="h-px flex-1 bg-white/5 ml-4" />
                     </div>
                     <div className="space-y-2 bg-zinc-900/40 rounded-3xl p-4 border border-white/5">
                       {isLoading ? <LoadingState /> : searchResults.slice(0, 8).map((track, i) => (
                         <div 
                           key={track.id} 
                           onClick={() => playTrack(track, searchResults)}
                           className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer"
                         >
                            <div className="relative w-12 h-12 flex-shrink-0">
                               <img src={track.image} className="w-full h-full object-cover rounded-xl shadow-lg" alt={track.name} />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                  <Play className="w-5 h-5 text-white fill-current" />
                               </div>
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                               <p className="text-sm sm:text-base font-bold text-white truncate">{track.name}</p>
                               <p className="text-xs text-zinc-400 font-semibold">{track.artist}</p>
                            </div>
                            <div className="text-purple-500 text-xs font-black px-3 py-1 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                0{i+1}
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Album View Detail */}
          {selectedAlbum && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-2 sm:pt-4 px-2 sm:px-0">
                <div className="w-full lg:w-80 flex-shrink-0 flex sm:flex-col gap-6 sm:gap-8 items-center sm:items-start">
                    <div className="w-32 h-32 sm:w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-3xl bg-zinc-800 group relative flex-shrink-0">
                        <img src={selectedAlbum.artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg")} className="w-full h-full object-cover" alt={selectedAlbum.collectionName} />
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

          {/* Full Grid of Albums found in Search/Category */}
          {!selectedAlbum && artistAlbums.length > 0 && (
            <div className="space-y-8 pt-12 border-t border-white/5 px-2 sm:px-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                   <h3 className="text-2xl sm:text-3xl font-black text-white">Discografia e Clássicos</h3>
                   <p className="text-zinc-500 text-sm font-bold">Baseado na sua busca por "{searchQuery}"</p>
                </div>
                <div className="flex gap-2 items-center">
                   <button 
                     onClick={handlePlayMix}
                     className="px-6 py-2 rounded-full bg-purple-500 hover:bg-purple-400 text-white font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                   >
                      <Play className="w-4 h-4 fill-current" /> Mix Aleatório
                   </button>
                   <div className="px-4 py-2 rounded-full bg-zinc-800 text-[10px] font-black text-white uppercase tracking-widest border border-white/5 hidden sm:block">Populares</div>
                   <div className="px-4 py-2 rounded-full bg-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest border border-purple-500/30 hidden sm:block">Essenciais</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                {artistAlbums.map((album: any, idx: number) => (
                  <div 
                    key={`${album.collectionId}-${idx}`} 
                    className="group relative flex flex-col gap-3 p-4 rounded-[2rem] bg-zinc-900/40 hover:bg-zinc-800 transition-all cursor-pointer shadow-lg border border-white/5 hover:border-purple-500/20"
                    onClick={() => viewAlbum(album)}
                  >
                    <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-zinc-800 shadow-2xl relative">
                      <img loading="lazy" src={album.artworkUrl100.replace("100x100bb.jpg", "200x200bb.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={album.collectionName} />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      
                      <div 
                        onClick={(e) => handlePlayAlbum(e, album)}
                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all shadow-purple-500/40"
                      >
                         <Play className="w-5 h-5 fill-current ml-1" />
                      </div>
                    </div>
                    <div className="px-1 py-1 space-y-1">
                        <p className="text-sm font-black text-white truncate leading-tight group-hover:text-purple-400 transition-colors">{album.collectionName}</p>
                        <p className="text-[11px] text-zinc-500 font-bold truncate">{album.artistName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{new Date(album.releaseDate).getFullYear()}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-800" />
                          <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{album.primaryGenreName}</span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sentinel for infinite scroll */}
              <div ref={sentinelCallbackRef} className="w-full py-6 flex justify-center">
                {isLoadingMore && (
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Carregando mais bandas...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-10 animate-in pt-4 sm:pt-6 pb-32">
      {/* YT Music Style Filter Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar pr-4">
        {HOME_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onCategoryClick(filter)}
            className="px-4 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm font-medium text-white whitespace-nowrap hover:bg-zinc-800 transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Header & Categories */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 px-2 sm:px-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 hidden sm:block">
                 <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{localStorage.getItem('sb-scvrmvuxzixidghstxqu-auth-token') ? 'ADRIANO MARTINS' : 'OUVINTE'}</span>
                <h1 className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tighter">
                    {getGreeting() === "Bom dia" ? "Ouvir de novo" : getGreeting()}
                </h1>
             </div>
          </div>
        </div>

        <div className="absolute top-4 sm:top-6 right-6 z-20 hidden lg:block">
           <SearchBar onSearch={setSearchQuery} />
        </div>
        
        <div className="flex items-center gap-6 overflow-x-auto pb-6 no-scrollbar snap-x px-1 sm:px-0 scroll-smooth">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              onClick={() => onCategoryClick(cat.query)}
              className="flex-shrink-0 w-[140px] sm:w-[180px] group flex flex-col items-center gap-3 transition-all cursor-pointer snap-start"
            >
              <div className="relative w-full aspect-square bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-2xl group-hover:scale-105 transition-all duration-500">
                 <img src={cat.image} alt={cat.label} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                 </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-bold text-sm sm:text-lg text-white truncate w-full px-2">{cat.label}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Artista</span>
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

      {/* Álbuns Lendários do Rock */}
      <section className="space-y-6 px-1 sm:px-0">
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
             <Play className="w-5 h-5 text-rose-500 fill-current" />
          </div>
          <h2 className="text-xl sm:text-4xl font-brand text-white">Álbuns Lendários</h2>
        </div>
        <div className="mt-2">
            {isLoading ? <LoadingState /> : (
              <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-8 no-scrollbar snap-x px-1 sm:px-0 scroll-smooth">
                 {rockClassics.map((track) => (
                    <div 
                      key={`rock-album-${track.id}`}
                      onClick={() => playTrack(track, rockClassics)}
                      className="flex-shrink-0 w-[200px] sm:w-[280px] group flex flex-col gap-4 p-4 sm:p-5 rounded-[2.5rem] bg-zinc-900/30 hover:bg-zinc-800 transition-all cursor-pointer shadow-xl border border-white/5 snap-start"
                    >
                        <div className="aspect-square relative rounded-[1.8rem] overflow-hidden bg-zinc-800 shadow-2xl">
                            <img src={track.image.replace("600x600bb.jpg", "300x300bb.jpg")} alt={track.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                <span className="text-white font-black text-sm block truncate">{track.name}</span>
                            </div>
                        </div>
                        <div className="px-1 text-center sm:text-left">
                            <span className="font-brand text-2xl sm:text-3xl text-white truncate leading-tight block">{track.artist}</span>
                            <span className="text-[9px] text-zinc-500 font-bold tracking-[0.3em] uppercase mt-2 block">Legendary Album</span>
                        </div>
                    </div>
                 ))}
              </div>
            )}
        </div>
      </section>

      {/* Hinos do Rock (Mais ouvidas) */}
      <section className="space-y-6 px-1 sm:px-0">
        <div className="flex items-center gap-2 pl-2">
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">Hinos do Rock</h2>
        </div>
        <div className="mt-4">
          {isLoading ? <LoadingState /> : (
            <TrackGrid>
              {rockAnthems.map((track) => (
                <TrackCard key={`rock-hits-${track.id}`} track={track} queue={rockAnthems} />
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
