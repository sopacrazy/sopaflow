import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Track } from "../types";

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  isRepeating: boolean;
  isShuffling: boolean;
  isLoadingAudio: boolean;
  youtubeUrl: string | null;
  nextYoutubeUrl: string | null; // Pre-fetched URL for the next track
  lastGenre: string | null;
  recentlyPlayed: Track[];
  
  // Actions
  setLastGenre: (genre: string | null) => void;
  addToRecentlyPlayed: (track: Track) => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlayPause: () => void;
  setIsPlaying: (playing: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setLoadingAudio: (loading: boolean) => void;
  setYoutubeUrl: (url: string | null) => void;
  setNextYoutubeUrl: (url: string | null) => void;
  playAlbum: (albumTracks: Track[]) => void;
  searchYoutube: (track: Track) => Promise<string | null>;
  prefetchNextTrack: () => Promise<void>;
  
  // Navigation & Search (Moved here to allow global reset from Sidebar)
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAlbum: any | null;
  setSelectedAlbum: (album: any | null) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  searchResults: Track[];
  setSearchResults: (tracks: Track[]) => void;
  artistAlbums: any[];
  setArtistAlbums: (albums: any[]) => void;
  resetHome: () => void;
  closePlayer: () => void;

  // Plan/Skip logic
  plan: 'free' | 'premium';
  setPlan: (plan: 'free' | 'premium') => void;
  skipCount: number;
  lastSkipReset: number;
  canSkip: () => boolean;
  registerSkip: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      volume: 0.8,
      progress: 0,
      isRepeating: false,
      isShuffling: false,
      isLoadingAudio: false,
      youtubeUrl: null,
      nextYoutubeUrl: null,
      lastGenre: null,
      recentlyPlayed: [],
      plan: 'free',
      skipCount: 0,
      lastSkipReset: Date.now(),
      
      searchQuery: "",
      selectedAlbum: null,
      isSearching: false,
      searchResults: [],
      artistAlbums: [],

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedAlbum: (album) => set({ selectedAlbum: album }),
      setIsSearching: (searching) => set({ isSearching: searching }),
      setSearchResults: (tracks) => set({ searchResults: tracks }),
      setArtistAlbums: (albums) => set({ artistAlbums: albums }),
      
      resetHome: () => set({ 
        searchQuery: "", 
        selectedAlbum: null, 
        isSearching: false,
        searchResults: [],
        artistAlbums: []
      }),

      closePlayer: () => set({
        currentTrack: null,
        isPlaying: false,
        youtubeUrl: null,
        queue: [],
        currentIndex: -1,
        progress: 0
      }),

      setQueue: (tracks, startIndex = 0) => {
        set({
          queue: tracks,
          currentIndex: startIndex,
          currentTrack: tracks[startIndex] || null,
          isPlaying: true,
        });
      },

      playTrack: (track, queue) => {
        const state = get();
        const newQueue = queue || state.queue;
        const index = newQueue.findIndex((t) => t.id === track.id);
        
        // Add to recently played and set genre for taste learning
        state.addToRecentlyPlayed(track);
        if (track.genre) state.setLastGenre(track.genre);
        
        set({
          currentTrack: track,
          queue: newQueue.length > 0 ? newQueue : [track],
          currentIndex: index >= 0 ? index : 0,
          isPlaying: true,
        });
      },

      addToRecentlyPlayed: (track) => {
        set((state) => {
          const filtered = state.recentlyPlayed.filter((t) => t.id !== track.id);
          return {
            recentlyPlayed: [track, ...filtered].slice(0, 20) // Keep last 20
          };
        });
      },

      togglePlayPause: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      setIsPlaying: (playing) => set({ isPlaying: playing }),

      nextTrack: () => {
        const { queue, currentIndex, isRepeating, isShuffling } = get();
        if (queue.length === 0) return;

        let nextIndex = currentIndex + 1;

        if (isShuffling && queue.length > 1) {
          nextIndex = Math.floor(Math.random() * queue.length);
          // Don't repeat current song if possible
          while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * queue.length);
          }
        } else if (nextIndex >= queue.length) {
          if (isRepeating) {
            nextIndex = 0;
          } else {
            // Stop playing at the end of the queue
            set({ isPlaying: false, progress: 0 });
            return;
          }
        }

        // If we have a prefetched URL, use it immediately
        const { nextYoutubeUrl } = get();
        
        set({
          currentIndex: nextIndex,
          currentTrack: queue[nextIndex],
          isPlaying: true,
          progress: 0,
          youtubeUrl: nextYoutubeUrl, // Use prefetched URL
          nextYoutubeUrl: null // Reset prefetch
        });
      },

      prevTrack: () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return;

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = queue.length - 1; // Loop to end
        }

        set({
          currentIndex: prevIndex,
          currentTrack: queue[prevIndex],
          isPlaying: true,
          progress: 0,
        });
      },

      setVolume: (volume) => set({ volume }),
      setProgress: (progress) => set({ progress }),
      toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating })),
      toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
      setLoadingAudio: (loading) => set({ isLoadingAudio: loading }),
      setYoutubeUrl: (url) => set({ youtubeUrl: url }),
      setNextYoutubeUrl: (url) => set({ nextYoutubeUrl: url }),
      setLastGenre: (genre) => set({ lastGenre: genre }),

      searchYoutube: async (track: Track) => {
        try {
          const query = `${track.name} ${track.artist} official audio`;
          const isDev = import.meta.env.MODE === 'development';
          const apiUrl = isDev ? 'http://localhost:3001' : '';
          
          const response = await fetch(`${apiUrl}/api/search-youtube?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          
          if (data.url) return data.url;
          return track.audio || null;
        } catch (error) {
          console.error("Search failed:", error);
          return track.audio || null;
        }
      },

      prefetchNextTrack: async () => {
        const state = get();
        const { queue, currentIndex, isShuffling, isRepeating } = state;
        if (queue.length === 0) return;

        let nextIndex = currentIndex + 1;
        if (isShuffling && queue.length > 1) {
          nextIndex = Math.floor(Math.random() * queue.length);
          while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * queue.length);
          }
        } else if (nextIndex >= queue.length) {
          if (isRepeating) nextIndex = 0;
          else return;
        }

        const nextTrack = queue[nextIndex];
        if (!nextTrack) return;

        const nextUrl = await state.searchYoutube(nextTrack);
        set({ nextYoutubeUrl: nextUrl });
      },

      playAlbum: (tracks) => {
        if (!tracks || tracks.length === 0) return;
        set({
          queue: tracks,
          currentIndex: 0,
          currentTrack: tracks[0],
          isPlaying: true,
          progress: 0
        });
      },

      setPlan: (plan) => set({ plan }),

      canSkip: () => {
        const { plan, skipCount, lastSkipReset } = get();
        if (plan === 'premium') return true;
        
        // Reset check (1 hour)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - lastSkipReset > oneHour) {
          set({ skipCount: 0, lastSkipReset: Date.now() });
          return true;
        }

        return skipCount < 4;
      },

      registerSkip: () => {
        const { plan, skipCount } = get();
        if (plan === 'premium') return;
        set({ skipCount: skipCount + 1 });
      },
    }),
    {
      name: "PumpBeats-player-storage",
      partialize: (state) => ({
        volume: state.volume,
        isRepeating: state.isRepeating,
        isShuffling: state.isShuffling,
        skipCount: state.skipCount,
        lastSkipReset: state.lastSkipReset,
        plan: state.plan,
        lastGenre: state.lastGenre,
        recentlyPlayed: state.recentlyPlayed
      }),
    }
  )
);
