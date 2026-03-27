import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Track } from "../types";

interface FavoritesState {
  favorites: Track[];
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      toggleFavorite: (track) => {
        const { favorites } = get();
        const exists = favorites.some((t) => t.id === track.id);
        
        if (exists) {
          set({ favorites: favorites.filter((t) => t.id !== track.id) });
        } else {
          set({ favorites: [...favorites, track] });
        }
      },
      
      isFavorite: (trackId) => {
        return get().favorites.some((t) => t.id === trackId);
      },
    }),
    {
      name: "SopaMusic-favorites-storage",
    }
  )
);
