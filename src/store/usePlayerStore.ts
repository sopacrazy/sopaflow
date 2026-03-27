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
  isLoadingAudio: boolean; // New state
  youtubeUrl: string | null; // New state
  
  // Actions
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setLoadingAudio: (loading: boolean) => void;
  setYoutubeUrl: (url: string | null) => void;
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
        
        set({
          currentTrack: track,
          queue: newQueue.length > 0 ? newQueue : [track],
          currentIndex: index >= 0 ? index : 0,
          isPlaying: true,
        });
      },

      togglePlayPause: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      nextTrack: () => {
        const { queue, currentIndex, isRepeating, isShuffling } = get();
        if (queue.length === 0) return;

        let nextIndex = currentIndex + 1;

        if (isShuffling) {
          nextIndex = Math.floor(Math.random() * queue.length);
        } else if (nextIndex >= queue.length) {
          if (isRepeating) {
            nextIndex = 0;
          } else {
            // Stop playing at the end of the queue
            set({ isPlaying: false, progress: 0 });
            return;
          }
        }

        set({
          currentIndex: nextIndex,
          currentTrack: queue[nextIndex],
          isPlaying: true,
          progress: 0,
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
    }),
    {
      name: "SopaMusic-player-storage",
      partialize: (state) => ({
        volume: state.volume,
        currentTrack: state.currentTrack,
        queue: state.queue,
        currentIndex: state.currentIndex,
        isRepeating: state.isRepeating,
        isShuffling: state.isShuffling,
      }),
    }
  )
);
