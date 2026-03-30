import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Track } from "../types";

export interface CustomPlaylist {
  id: string;
  name: string;
  tracks: Track[];
}

interface PlaylistState {
  playlists: CustomPlaylist[];
  addPlaylist: (name: string) => void;
  removePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      addPlaylist: (name) => {
        const newPlaylist: CustomPlaylist = { id: Date.now().toString(), name, tracks: [] };
        set({ playlists: [...get().playlists, newPlaylist] });
      },
      removePlaylist: (id) => {
         set({ playlists: get().playlists.filter(p => p.id !== id) });
      },
      addTrackToPlaylist: (playlistId, track) => {
         const { playlists } = get();
         const updated = playlists.map(p => {
            if (p.id === playlistId && !p.tracks.find(t => t.id === track.id)) {
               return { ...p, tracks: [...p.tracks, track] };
            }
            return p;
         });
         set({ playlists: updated });
      },
      removeTrackFromPlaylist: (playlistId, trackId) => {
         const { playlists } = get();
         const updated = playlists.map(p => {
            if (p.id === playlistId) {
               return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
            }
            return p;
         });
         set({ playlists: updated });
      }
    }),
    { name: "PumpBeats-playlists-storage" }
  )
);
