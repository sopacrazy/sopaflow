import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Track } from "../types";
import { supabase } from "../lib/supabase";

interface FavoritesState {
  favorites: Track[];
  toggleFavorite: (track: Track, userId?: string) => Promise<void>;
  isFavorite: (trackId: string) => boolean;
  loadFavorites: (userId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      loadFavorites: async (userId) => {
        try {
          const { data, error } = await supabase
            .from("favorites")
            .select("track_data")
            .eq("user_id", userId);
          
          if (error) throw error;
          
          if (data) {
            const tracks = data.map(item => item.track_data as Track);
            set({ favorites: tracks });
          }
        } catch (err) {
          console.error("Error loading favorites:", err);
        }
      },

      toggleFavorite: async (track, userId) => {
        const { favorites } = get();
        const exists = favorites.some((t) => t.id === track.id);
        
        let newFavorites;
        if (exists) {
          newFavorites = favorites.filter((t) => t.id !== track.id);
          
          // Sync with database if userId is provided
          if (userId) {
            try {
              await supabase
                .from("favorites")
                .delete()
                .eq("user_id", userId)
                .eq("track_id", track.id);
            } catch (err) {
              console.error("Error removing favorite:", err);
            }
          }
        } else {
          newFavorites = [...favorites, track];
          
          // Sync with database if userId is provided
          if (userId) {
            try {
              await supabase
                .from("favorites")
                .upsert({
                  user_id: userId,
                  track_id: track.id,
                  track_data: track,
                  created_at: new Date().toISOString()
                });
            } catch (err) {
              console.error("Error saving favorite:", err);
            }
          }
        }
        
        set({ favorites: newFavorites });
      },
      
      isFavorite: (trackId) => {
        return get().favorites.some((t) => t.id === trackId);
      },
    }),
    {
      name: "PumpBeats-favorites-storage",
    }
  )
);
